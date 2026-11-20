/**
 * Misión 006-C.4 — Reparación de estados editoriales en Payload CMS.
 *
 * Corrige los 17 eventos históricos importados que quedaron en `_status: 'published'`
 * en la tabla `events`, devolviéndolos a `_status: 'draft'` sin alterar Media,
 * relaciones, derechos de uso, historial de versiones ni el evento protegido
 * `pasto-vive-flow-2026`.
 *
 * Uso en VPS (donde `pnpm dlx tsx` está disponible):
 *   pnpm dlx tsx src/scripts/repair-stage-history-drafts.ts --dry-run
 *   pnpm dlx tsx src/scripts/repair-stage-history-drafts.ts
 */
import { getPayload, type Payload } from 'payload';

import config from '@/payload.config';
import { STAGE_HISTORY } from '@/data/stage-history';
import type { Event } from '@/payload-types';

export const PROTECTED_SLUG = 'pasto-vive-flow-2026';

export const ARCHIVE_SLUGS: string[] = STAGE_HISTORY.map((entry) => entry.slug).filter(
  (slug) => slug !== PROTECTED_SLUG,
);

export const EXPECTED_ARCHIVE_COUNT = 17;

export interface RepairStageHistoryOptions {
  dryRun?: boolean;
  payload?: Payload;
  logger?: Pick<Console, 'log' | 'warn' | 'error'>;
}

export interface RepairStageHistorySummary {
  dryRun: boolean;
  inspected: number;
  repaired: number;
  alreadyDraft: number;
  skippedVerifiedOrApproved: number;
  anonLocalApiVisibleAfter: number;
  verifiedAllDraftAfter: boolean;
  protectedEventIntact: boolean;
}

interface ProtectedSnapshot {
  id: number | string;
  _status: Event['_status'];
  listing: Event['listing'];
  updatedAt: string;
}

function assertProtectedSnapshotUnchanged(
  before: ProtectedSnapshot,
  afterDoc: Event | undefined,
): boolean {
  if (!afterDoc) {
    throw new Error(
      `[repair-stage-history-drafts] ABORTED/FAILED: protected event "${PROTECTED_SLUG}" disappeared after execution.`,
    );
  }

  const unchanged =
    afterDoc.id === before.id &&
    afterDoc._status === before._status &&
    afterDoc.listing === before.listing &&
    afterDoc.updatedAt === before.updatedAt;

  if (!unchanged) {
    throw new Error(
      `[repair-stage-history-drafts] Protected event "${PROTECTED_SLUG}" changed unexpectedly! ` +
        `before=${JSON.stringify(before)} after=${JSON.stringify({
          id: afterDoc.id,
          _status: afterDoc._status,
          listing: afterDoc.listing,
          updatedAt: afterDoc.updatedAt,
        })}`,
    );
  }

  return true;
}

export async function repairStageHistoryDrafts(
  options: RepairStageHistoryOptions = {},
): Promise<RepairStageHistorySummary> {
  const dryRun = Boolean(options.dryRun);
  const log = options.logger ?? console;
  const payload = options.payload ?? (await getPayload({ config }));

  // 1. Snapshot del evento protegido `pasto-vive-flow-2026` antes de cualquier operación
  const protectedBeforeRes = await payload.find({
    collection: 'events',
    overrideAccess: true,
    draft: true,
    depth: 0,
    limit: 2,
    pagination: false,
    where: {
      slug: { equals: PROTECTED_SLUG },
    },
  });

  if (protectedBeforeRes.docs.length !== 1) {
    throw new Error(
      `[repair-stage-history-drafts] Validación previa fallida: se esperaba exactamente 1 registro "${PROTECTED_SLUG}", se encontraron ${protectedBeforeRes.docs.length}. No se realizaron escrituras.`,
    );
  }

  const protectedBeforeDoc = protectedBeforeRes.docs[0];
  const protectedSnapshot: ProtectedSnapshot = {
    id: protectedBeforeDoc.id,
    _status: protectedBeforeDoc._status,
    listing: protectedBeforeDoc.listing,
    updatedAt: protectedBeforeDoc.updatedAt,
  };

  // 2. Consultar los 17 candidatos históricos estrictamente por slug + listing='archive'
  const candidatesRes = await payload.find({
    collection: 'events',
    overrideAccess: true,
    draft: true,
    depth: 0,
    limit: 100,
    pagination: false,
    where: {
      and: [
        { slug: { in: ARCHIVE_SLUGS } },
        { listing: { equals: 'archive' } },
      ],
    },
  });

  if (candidatesRes.docs.length !== EXPECTED_ARCHIVE_COUNT) {
    throw new Error(
      `[repair-stage-history-drafts] Validación previa fallida: se esperaban ${EXPECTED_ARCHIVE_COUNT} candidatos de archivo, se encontraron ${candidatesRes.docs.length}. No se realizaron escrituras.`,
    );
  }

  // 3. Validar el conjunto completo ANTES de realizar ninguna escritura
  const toRepair: Event[] = [];
  const alreadyDraft: Event[] = [];
  const unexpected: Array<{ slug: string; reason: string }> = [];

  for (const doc of candidatesRes.docs) {
    if (doc.slug === PROTECTED_SLUG) {
      unexpected.push({ slug: doc.slug, reason: 'protected slug matched archive query' });
      continue;
    }

    const verificationStatus = doc.verification?.status;
    const usageStatus = doc.usageRights?.status;

    if (verificationStatus !== 'to_confirm' || usageStatus !== 'pending') {
      unexpected.push({
        slug: doc.slug,
        reason: `unexpected editorial/rights state (verificationStatus=${String(verificationStatus)}, usageRights=${String(usageStatus)})`,
      });
      continue;
    }

    if (doc._status === 'published') {
      toRepair.push(doc);
    } else if (doc._status === 'draft') {
      alreadyDraft.push(doc);
    } else {
      unexpected.push({
        slug: doc.slug,
        reason: `unexpected _status=${String(doc._status)}`,
      });
    }
  }

  if (unexpected.length > 0) {
    throw new Error(
      `[repair-stage-history-drafts] Validación previa fallida: se detectaron estados inesperados; no se realizaron escrituras. Detalle: ${JSON.stringify(unexpected)}`,
    );
  }

  const isAllPublishedBatch =
    toRepair.length === EXPECTED_ARCHIVE_COUNT && alreadyDraft.length === 0;
  const isAllDraftIdempotent =
    toRepair.length === 0 && alreadyDraft.length === EXPECTED_ARCHIVE_COUNT;

  if (!isAllPublishedBatch && !isAllDraftIdempotent) {
    throw new Error(
      `[repair-stage-history-drafts] Validación previa fallida: lote mixto o incompleto (toRepair=${toRepair.length}, alreadyDraft=${alreadyDraft.length}, expected=${EXPECTED_ARCHIVE_COUNT}). No se realizaron escrituras.`,
    );
  }

  log.log(
    `[repair-stage-history-drafts] Pre-check OK (${dryRun ? 'DRY-RUN' : 'APPLY'}): ` +
      `inspected=${candidatesRes.docs.length}, toRepair=${toRepair.length}, alreadyDraft=${alreadyDraft.length}`,
  );

  // 4. Aplicar reparación si no es dry-run
  let repairedCount = 0;
  if (!dryRun) {
    for (const doc of toRepair) {
      const updated = await payload.update({
        collection: 'events',
        id: doc.id,
        overrideAccess: true,
        depth: 0,
        data: {
          _status: 'draft',
        },
      });

      if (updated._status !== 'draft') {
        throw new Error(
          `[repair-stage-history-drafts] Partial write failure on "${doc.slug}" (id=${doc.id}): ` +
            `expected _status='draft' after update, got "${String(updated._status)}". ` +
            `Stopped immediately without automatic rollback; inspect DB before retrying.`,
        );
      }
      repairedCount += 1;
    }
  }

  // 5. Verificación posterior obligatoria (tabla principal e historial)
  const afterMainTableRes = await payload.find({
    collection: 'events',
    overrideAccess: true,
    draft: false,
    depth: 0,
    limit: 100,
    pagination: false,
    where: {
      and: [
        { slug: { in: ARCHIVE_SLUGS } },
        { listing: { equals: 'archive' } },
      ],
    },
  });

  const afterDraftViewRes = await payload.find({
    collection: 'events',
    overrideAccess: true,
    draft: true,
    depth: 0,
    limit: 100,
    pagination: false,
    where: {
      and: [
        { slug: { in: ARCHIVE_SLUGS } },
        { listing: { equals: 'archive' } },
      ],
    },
  });

  const nonDraftMain = afterMainTableRes.docs.filter((doc) => doc._status !== 'draft');
  const nonDraftLatest = afterDraftViewRes.docs.filter((doc) => doc._status !== 'draft');
  const verifiedAllDraftAfter =
    afterMainTableRes.docs.length === EXPECTED_ARCHIVE_COUNT &&
    afterDraftViewRes.docs.length === EXPECTED_ARCHIVE_COUNT &&
    nonDraftMain.length === 0 &&
    nonDraftLatest.length === 0;

  if (!dryRun && !verifiedAllDraftAfter) {
    throw new Error(
      `[repair-stage-history-drafts] Post-repair verification failed: mainNonDraft=${nonDraftMain.length}, latestNonDraft=${nonDraftLatest.length} out of ${EXPECTED_ARCHIVE_COUNT}.`,
    );
  }

  const protectedAfterRes = await payload.find({
    collection: 'events',
    overrideAccess: true,
    draft: true,
    depth: 0,
    limit: 2,
    pagination: false,
    where: {
      slug: { equals: PROTECTED_SLUG },
    },
  });

  const protectedEventIntact = assertProtectedSnapshotUnchanged(
    protectedSnapshot,
    protectedAfterRes.docs[0],
  );

  const anonRes = await payload.find({
    collection: 'events',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 100,
    pagination: false,
    where: {
      slug: { in: ARCHIVE_SLUGS },
    },
  });

  const summary: RepairStageHistorySummary = {
    dryRun,
    inspected: candidatesRes.docs.length,
    repaired: dryRun ? toRepair.length : repairedCount,
    alreadyDraft: alreadyDraft.length,
    skippedVerifiedOrApproved: 0,
    anonLocalApiVisibleAfter: anonRes.totalDocs,
    verifiedAllDraftAfter,
    protectedEventIntact,
  };

  log.log(`[repair-stage-history-drafts] Summary: ${JSON.stringify(summary)}`);
  return summary;
}

const isDirectExecution =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1]?.includes('repair-stage-history-drafts');

if (isDirectExecution) {
  const dryRun = process.argv.includes('--dry-run');
  repairStageHistoryDrafts({ dryRun })
    .then((summary) => {
      if (!dryRun && (!summary.verifiedAllDraftAfter || !summary.protectedEventIntact)) {
        process.exitCode = 1;
      } else {
        process.exitCode = 0;
      }
    })
    .catch((error) => {
      console.error('[repair-stage-history-drafts] Fatal error:', error);
      process.exitCode = 1;
    })
    .finally(() => {
      // Allow Payload / pg pool to close cleanly if needed
      setTimeout(() => process.exit(process.exitCode ?? 0), 150);
    });
}
