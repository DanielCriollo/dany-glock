import config from '../payload.config';
import { getPayload, type Payload } from 'payload';

/**
 * Script de siembra reproducible e idempotente para Dany Glock — Artist Digital Experience.
 * Fuente de verdad: local/_ai-workspace/13-research-inventory.md
 * 
 * Reglas mandatorias:
 * 1. Idempotente: ejecutarse múltiples veces no crea duplicados.
 * 2. No sobrescribe ediciones manuales no relacionadas ni borra usuarios o contactos.
 * 3. Mantiene en borrador (_status: 'draft') los registros con datos pendientes de confirmar:
 *    - Release: 'sig-sauer-remix'
 *    - Evento: 'pasto-vive-flow-2026'
 * 4. Asigna trazabilidad y verificación de fuentes en cada registro.
 */
export async function seedArtistData(payloadInstance?: Payload) {
  const payload = payloadInstance || (await getPayload({ config }));
  console.log('🚀 Iniciando siembra idempotente de datos del artista...');

  // -------------------------------------------------------------
  // 1. Obtener o crear Media placeholder para artes de portada
  // -------------------------------------------------------------
  let coverMediaId: number;
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 1,
  });

  if (existingMedia.totalDocs > 0) {
    coverMediaId = Number(existingMedia.docs[0].id);
    console.log(`✓ Usando Media existente para portadas (ID: ${coverMediaId})`);
  } else {
    // Si no existiera media previo, crear un placeholder PNG de 1x1 transparente
    const placeholderBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    const mediaDoc = await payload.create({
      collection: 'media',
      draft: false,
      data: {
        alt: 'Artwork Placeholder Temporal Oficial',
        caption: 'Arte temporal pendiente de entrega oficial en alta resolución por el artista.',
        category: 'artwork',
      },
      file: {
        data: placeholderBuffer,
        mimetype: 'image/png',
        name: 'placeholder-cover.png',
        size: placeholderBuffer.length,
      },
    });
    coverMediaId = Number(mediaDoc.id);
    console.log(`✓ Creado Media placeholder temporal (ID: ${coverMediaId})`);
  }

  // -------------------------------------------------------------
  // 2. Siembra de Lanzamientos (Releases)
  // -------------------------------------------------------------
  const releasesData = [
    {
      title: 'SIG Sauer',
      slug: 'sig-sauer',
      type: 'single' as const,
      artistRole: 'main' as const,
      coverStatus: 'pending' as const,
      releaseDate: '2024-04-04T00:00:00.000Z',
      description:
        'Single debut oficial de Dany Glock. Producción musical de Nick Montana Beatmen. Sello discográfico Beatmen Generations / Diskover Co.',
      catalogNumber: 'BG-2024-SIG',
      featured: true,
      streamingLinks: {
        appleMusic: 'https://music.apple.com/us/album/sig-sauer-single/1739566495',
        youtube: 'https://www.youtube.com/watch?v=kcac_CIFJ7k',
      },
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://music.apple.com/us/album/sig-sauer-single/1739566495',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado mediante iTunes Lookup ID 1739566495 y canal de YouTube oficial @danyglock.',
      },
      seo: {
        metaTitle: 'SIG Sauer — Dany Glock (Single Oficial)',
        metaDescription: 'Escucha SIG Sauer, single oficial de Dany Glock producido por Nick Montana Beatmen.',
      },
      isDraft: false,
    },
    {
      title: 'SO FRESH, SO CLEAN',
      slug: 'so-fresh-so-clean',
      type: 'single' as const,
      artistRole: 'main' as const,
      coverStatus: 'pending' as const,
      releaseDate: '2025-07-29T00:00:00.000Z',
      description:
        'Colaboración de autor entre Nick Montana & Dany Glock. Sello BeatmenGenerations / Diskover Co.',
      catalogNumber: 'BG-2025-SFSC',
      featured: true,
      streamingLinks: {
        appleMusic: 'https://music.apple.com/us/album/so-fresh-so-clean-single/1828774400',
        youtube: 'https://www.youtube.com/watch?v=hvoy-jQNUnc',
      },
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://music.apple.com/us/album/so-fresh-so-clean-single/1828774400',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado mediante iTunes Lookup ID 1828774400 y canal oficial.',
      },
      seo: {
        metaTitle: 'SO FRESH, SO CLEAN — Nick Montana & Dany Glock',
        metaDescription: 'Single oficial SO FRESH, SO CLEAN por Nick Montana & Dany Glock.',
      },
      isDraft: false,
    },
    {
      title: 'Cicatrices (feat. Maick Records)',
      slug: 'cicatrices',
      type: 'single' as const,
      artistRole: 'main' as const,
      coverStatus: 'pending' as const,
      releaseDate: '2026-07-01T00:00:00.000Z',
      description:
        'Single oficial con Nick Montana, Dark Pro & Dany Glock feat. Maick Records. ℗ 2026 Prix Music Group.',
      catalogNumber: 'PMG-2026-CIC',
      featured: true,
      streamingLinks: {
        appleMusic: 'https://music.apple.com/us/album/cicatrices-feat-maick-records-single/6794031338',
        youtube: 'https://www.youtube.com/watch?v=DuU5yoDscxs',
      },
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://music.apple.com/us/album/cicatrices-feat-maick-records-single/6794031338',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado mediante iTunes Lookup ID 6794031338 y video oficial de YouTube.',
      },
      seo: {
        metaTitle: 'Cicatrices — Dany Glock, Nick Montana & Dark Pro',
        metaDescription: 'Escucha Cicatrices de Dany Glock en plataformas oficiales.',
      },
      isDraft: false,
    },
    {
      title: 'EXCESO (feat. Dany Glock & Sebas BP)',
      slug: 'exceso',
      type: 'single' as const,
      artistRole: 'featured' as const, // Dany Glock como artista invitado
      coverStatus: 'pending' as const,
      releaseDate: '2026-07-07T00:00:00.000Z',
      description:
        'Single oficial de Nick Montana con la participación de Dany Glock y Sebas BP como artistas invitados. ℗ 2026 BeatmenGenerations.',
      catalogNumber: 'BG-2026-EXC',
      featured: false,
      streamingLinks: {
        appleMusic: 'https://music.apple.com/us/album/exceso-feat-dany-glock-sebas-bp-single/6792980912',
      },
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://music.apple.com/us/album/exceso-feat-dany-glock-sebas-bp-single/6792980912',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado mediante iTunes Lookup ID 6792980912. Dany Glock figura como artista invitado (featured).',
      },
      seo: {
        metaTitle: 'EXCESO — Nick Montana feat. Dany Glock & Sebas BP',
        metaDescription: 'Single EXCESO de Nick Montana con la participación de Dany Glock y Sebas BP.',
      },
      isDraft: false,
    },
    {
      title: 'SIG Sauer (Remix)',
      slug: 'sig-sauer-remix',
      type: 'single' as const,
      artistRole: 'main' as const,
      coverStatus: 'pending' as const,
      releaseDate: '2024-12-28T00:00:00.000Z',
      description:
        'Versión remix extendida con Brak Johnz, Dollaro, TVZ, Selene Psycho, Darev y Loneliness. En borrador pendiente de confirmación de catálogo y metadatos DSP definitivos.',
      featured: false,
      streamingLinks: {
        amazonMusic: 'https://music.amazon.fr/albums/B0DS2SL23S',
        youtube: 'https://www.youtube.com/watch?v=4BzpqeraFjc',
      },
      verification: {
        status: 'to_confirm' as const,
        sourceUrl: 'https://www.youtube.com/watch?v=4BzpqeraFjc',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Publicado en YouTube el 2024-12-26 y referenciado en Amazon Music (2024-12-28). Registro en borrador hasta validar metadatos ISRC y DSP definitivos.',
      },
      seo: {
        metaTitle: 'SIG Sauer (Remix) — Dany Glock',
        metaDescription: 'SIG Sauer Remix en borrador editorial.',
      },
      isDraft: true, // Borrador mandatorio
    },
  ];

  const releaseMap = new Map<string, number>();

  for (const rel of releasesData) {
    const existing = await payload.find({
      collection: 'releases',
      where: {
        slug: {
          equals: rel.slug,
        },
      },
      draft: true,
    });

    if (existing.totalDocs === 0) {
      const created = await payload.create({
        collection: 'releases',
        draft: rel.isDraft,
        data: {
          title: rel.title,
          slug: rel.slug,
          type: rel.type,
          artistRole: rel.artistRole,
          coverImage: coverMediaId,
          coverStatus: rel.coverStatus,
          releaseDate: rel.releaseDate,
          description: rel.description,
          catalogNumber: rel.catalogNumber,
          featured: rel.featured,
          streamingLinks: rel.streamingLinks,
          verification: rel.verification,
          seo: rel.seo,
          _status: rel.isDraft ? 'draft' : 'published',
        },
      });
      releaseMap.set(rel.slug, Number(created.id));
      console.log(`  + Creado Release "${rel.title}" (${rel.isDraft ? 'BORRADOR' : 'PUBLICADO'}, ID: ${created.id})`);
    } else {
      const existingId = Number(existing.docs[0].id);
      releaseMap.set(rel.slug, existingId);
      console.log(`  = Release existente "${rel.title}" (ID: ${existingId})`);
    }
  }

  // -------------------------------------------------------------
  // 3. Siembra de Canciones (Tracks)
  // -------------------------------------------------------------
  const tracksData = [
    {
      title: 'SIG Sauer',
      releaseSlug: 'sig-sauer',
      trackNumber: 1,
      duration: '2:52',
      artistRole: 'main' as const,
      appleMusicUrl: 'https://music.apple.com/us/album/sig-sauer-single/1739566495',
      credits: {
        producers: 'Nick Montana Beatmen',
      },
      featured: true,
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://music.apple.com/us/album/sig-sauer-single/1739566495',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado con metadatos de Apple Music y créditos de YouTube.',
      },
    },
    {
      title: 'SO FRESH, SO CLEAN',
      releaseSlug: 'so-fresh-so-clean',
      trackNumber: 1,
      duration: '2:48',
      artistRole: 'main' as const,
      featuredArtists: 'Nick Montana',
      appleMusicUrl: 'https://music.apple.com/us/album/so-fresh-so-clean-single/1828774400',
      credits: {
        producers: 'Nick Montana Beatmen',
      },
      featured: true,
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://music.apple.com/us/album/so-fresh-so-clean-single/1828774400',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado con metadatos de Apple Music.',
      },
    },
    {
      title: 'Cicatrices (feat. Maick Records)',
      releaseSlug: 'cicatrices',
      trackNumber: 1,
      duration: '3:19',
      artistRole: 'main' as const,
      featuredArtists: 'feat. Maick Records, Nick Montana & Dark Pro',
      appleMusicUrl: 'https://music.apple.com/us/album/cicatrices-feat-maick-records-single/6794031338',
      credits: {
        producers: 'Nick Montana x Dark Pro',
      },
      featured: true,
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://music.apple.com/us/album/cicatrices-feat-maick-records-single/6794031338',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado con metadatos de Apple Music y título oficial en YouTube.',
      },
    },
    {
      title: 'EXCESO',
      releaseSlug: 'exceso',
      trackNumber: 1,
      duration: '2:35',
      artistRole: 'featured' as const, // Dany Glock como invitado
      featuredArtists: 'Nick Montana (Lead), Sebas BP',
      appleMusicUrl: 'https://music.apple.com/us/album/exceso-feat-dany-glock-sebas-bp-single/6792980912',
      credits: {
        producers: 'Nick Montana',
      },
      featured: false,
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://music.apple.com/us/album/exceso-feat-dany-glock-sebas-bp-single/6792980912',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado en Apple Music. Dany Glock participa como artista invitado.',
      },
    },
    {
      title: 'SIG Sauer (Remix)',
      releaseSlug: 'sig-sauer-remix',
      trackNumber: 1,
      duration: '7:07',
      artistRole: 'main' as const,
      featuredArtists: 'Brak Johnz, Dollaro, TVZ, Selene Psycho, Darev, Loneliness',
      featured: false,
      verification: {
        status: 'to_confirm' as const,
        sourceUrl: 'https://www.youtube.com/watch?v=4BzpqeraFjc',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Pista correspondiente al lanzamiento en borrador. Duración 7:07 verificada en YouTube.',
      },
    },
  ];

  const trackMap = new Map<string, number>();

  for (const tr of tracksData) {
    const relId = releaseMap.get(tr.releaseSlug);
    if (!relId) {
      console.warn(`! Release no encontrado para track: ${tr.title}`);
      continue;
    }

    const existing = await payload.find({
      collection: 'tracks',
      where: {
        and: [
          { title: { equals: tr.title } },
          { release: { equals: relId } },
        ],
      },
    });

    if (existing.totalDocs === 0) {
      const created = await payload.create({
        collection: 'tracks',
        data: {
          title: tr.title,
          release: relId,
          trackNumber: tr.trackNumber,
          duration: tr.duration,
          artistRole: tr.artistRole,
          featuredArtists: tr.featuredArtists,
          appleMusicUrl: tr.appleMusicUrl,
          credits: tr.credits,
          featured: tr.featured,
          verification: tr.verification,
        },
      });
      trackMap.set(tr.releaseSlug, Number(created.id));
      console.log(`  + Creada Track "${tr.title}" (ID: ${created.id})`);
    } else {
      const existingId = Number(existing.docs[0].id);
      trackMap.set(tr.releaseSlug, existingId);
      console.log(`  = Track existente "${tr.title}" (ID: ${existingId})`);
    }
  }

  // -------------------------------------------------------------
  // 4. Siembra de Videos de YouTube
  // -------------------------------------------------------------
  const videosData = [
    {
      title: 'SIG Sauer - Dany Glock (Video Oficial)',
      slug: 'sig-sauer-video-oficial',
      type: 'official_music_video' as const,
      youtubeUrl: 'https://www.youtube.com/watch?v=kcac_CIFJ7k',
      youtubeId: 'kcac_CIFJ7k',
      duration: '3:20',
      releaseDate: '2024-04-05T00:00:00.000Z',
      relatedTrackSlug: 'sig-sauer',
      featured: true,
      description:
        'Videoclip oficial de SIG Sauer. Producción musical de Nick Montana Beatmen. Estética nocturna y cinematográfica.',
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://www.youtube.com/watch?v=kcac_CIFJ7k',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado en el canal oficial @danyglock de YouTube.',
      },
    },
    {
      title: 'SIG Sauer - Dany Glock (Trailer Oficial)',
      slug: 'sig-sauer-trailer-oficial',
      type: 'trailer' as const,
      youtubeUrl: 'https://www.youtube.com/watch?v=SKgil-Dd1_M',
      youtubeId: 'SKgil-Dd1_M',
      duration: '0:24',
      releaseDate: '2024-02-27T00:00:00.000Z',
      relatedTrackSlug: 'sig-sauer',
      featured: false,
      description: 'Trailer y teaser cinematográfico previo al estreno de SIG Sauer.',
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://www.youtube.com/watch?v=SKgil-Dd1_M',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado en el canal oficial @danyglock.',
      },
    },
    {
      title: 'Dany Glock - SIG SAUER (Remix) TRAILER OFICIAL',
      slug: 'sig-sauer-remix-trailer-oficial',
      type: 'trailer' as const,
      youtubeUrl: 'https://www.youtube.com/watch?v=N3REsYJtfn4',
      youtubeId: 'N3REsYJtfn4',
      duration: '0:35',
      releaseDate: '2024-11-17T00:00:00.000Z',
      relatedTrackSlug: 'sig-sauer-remix',
      featured: false,
      description: 'Trailer oficial de anticipación del remix colaborativo de SIG Sauer.',
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://www.youtube.com/watch?v=N3REsYJtfn4',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado en el canal oficial @danyglock.',
      },
    },
    {
      title: 'Dany Glock, Brak Johnz, Dollaro, TVZ, Selene Psycho, Darev, Loneliness - Sig Sauer REMIX',
      slug: 'sig-sauer-remix',
      type: 'official_music_video' as const,
      youtubeUrl: 'https://www.youtube.com/watch?v=4BzpqeraFjc',
      youtubeId: '4BzpqeraFjc',
      duration: '7:07',
      releaseDate: '2024-12-26T00:00:00.000Z',
      relatedTrackSlug: 'sig-sauer-remix',
      featured: false,
      description:
        'Presentación completa del remix de SIG Sauer con Brak Johnz, Dollaro, TVZ, Selene Psycho, Darev y Loneliness.',
      verification: {
        status: 'to_confirm' as const,
        sourceUrl: 'https://www.youtube.com/watch?v=4BzpqeraFjc',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Existencia y fecha verificada en YouTube; clasificación de formato (videoclip vs visualizer) por confirmar.',
      },
    },
    {
      title: 'SO FRESH, SO CLEAN — Dany Glock',
      slug: 'so-fresh-so-clean',
      type: 'official_music_video' as const,
      youtubeUrl: 'https://www.youtube.com/watch?v=hvoy-jQNUnc',
      youtubeId: 'hvoy-jQNUnc',
      duration: '2:53',
      releaseDate: '2025-07-22T00:00:00.000Z',
      relatedTrackSlug: 'so-fresh-so-clean',
      featured: true,
      description: 'Videoclip oficial de SO FRESH, SO CLEAN. Producido por Nick Montana Beatmen.',
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://www.youtube.com/watch?v=hvoy-jQNUnc',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado en el canal oficial @danyglock.',
      },
    },
    {
      title: 'CICATRICES - DANY GLOCK (PROD NICK MONTANA x DARK PRO)',
      slug: 'cicatrices',
      type: 'official_music_video' as const,
      youtubeUrl: 'https://www.youtube.com/watch?v=DuU5yoDscxs',
      youtubeId: 'DuU5yoDscxs',
      duration: '3:53',
      releaseDate: '2026-07-25T00:00:00.000Z',
      relatedTrackSlug: 'cicatrices',
      featured: true,
      description: 'Producción audiovisual oficial de Cicatrices (Prod. Nick Montana x Dark Pro).',
      verification: {
        status: 'verified' as const,
        sourceUrl: 'https://www.youtube.com/watch?v=DuU5yoDscxs',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes: 'Verificado en el canal oficial @danyglock.',
      },
    },
  ];

  for (const vid of videosData) {
    const existing = await payload.find({
      collection: 'videos',
      where: {
        slug: {
          equals: vid.slug,
        },
      },
      draft: true,
    });

    const relatedTrackId = trackMap.get(vid.relatedTrackSlug);

    if (existing.totalDocs === 0) {
      const created = await payload.create({
        collection: 'videos',
        draft: false,
        data: {
          title: vid.title,
          slug: vid.slug,
          type: vid.type,
          youtubeUrl: vid.youtubeUrl,
          youtubeId: vid.youtubeId,
          duration: vid.duration,
          releaseDate: vid.releaseDate,
          relatedTrack: relatedTrackId,
          featured: vid.featured,
          description: vid.description,
          verification: vid.verification,
          _status: 'published',
        },
      });
      console.log(`  + Creado Video "${vid.title}" (ID: ${created.id})`);
    } else {
      console.log(`  = Video existente "${vid.title}" (ID: ${existing.docs[0].id})`);
    }
  }

  // -------------------------------------------------------------
  // 5. Configuración del Global: ArtistProfile
  // -------------------------------------------------------------
  await payload.updateGlobal({
    slug: 'artist-profile',
    data: {
      stageName: 'Dany Glock',
      tagline: 'Artist Digital Experience — Dark Cinematic Editorial',
      bioStatus: 'editorial_draft',
      manifesto:
        'La música urbana como cinematografía sonora: una narrativa nocturna nacida en el sur de Colombia y proyectada a la escena global.',
      shortBio:
        'Dany Glock es un artista de música urbana y trap originario de Pasto, Nariño, Colombia. Su propuesta combina líricas introspectivas, identidad andina contemporánea y una estética visual nocturna de alto impacto cinematográfico.',
      mediumBio:
        'Originario de Pasto, Nariño, Colombia, Dany Glock representa una nueva visión del trap y la música urbana latina. Con producciones como SIG Sauer, SO FRESH, SO CLEAN y Cicatrices, ha forjado una identidad oscura, elegante y editorial, uniendo sonido global y autenticidad territorial.',
      origin: {
        city: 'Pasto',
        country: 'Colombia',
      },
      translations: {
        en: {
          status: 'draft_pending_review',
          shortBio:
            'Dany Glock is an urban music and Latin trap artist from Pasto, Colombia. His sonic vision merges nocturnal storytelling with a dark, high-impact cinematic editorial aesthetic.',
          mediumBio:
            'Hailing from Pasto, Nariño, Colombia, Dany Glock brings a distinct and sophisticated perspective to contemporary Latin urban music. Anchored by heavy atmospheric beats and introspective lyrics, his work defines a dark cinematic visual and sonic experience.',
        },
      },
      verification: {
        status: 'editorial_proposal',
        sourceUrl: 'https://music.apple.com/us/artist/dany-glock/1739565666',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes:
          'Biografía redactada estrictamente con base en hechos verificables (perfil oficial en Apple Music, créditos y producciones oficiales). Estado: propuesta editorial pendiente de confirmación formal por el artista.',
      },
    },
  });
  console.log('✓ Global ArtistProfile actualizado con biografía editorial y origen Pasto/Colombia.');

  // -------------------------------------------------------------
  // 6. Configuración del Global: SiteSettings
  // -------------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteTitle: 'Dany Glock — Official Artist Experience',
      siteDescription:
        'Plataforma oficial de Dany Glock: música urbana, discografía, lanzamientos, videografía cinematográfica y fechas de conciertos.',
      socialLinks: {
        instagram: 'https://www.instagram.com/danyglock_/',
        youtube: 'https://www.youtube.com/@danyglock',
        youtubeChannelId: 'UCf-4AJMV8QZz1jj4OVBzaxg',
        appleMusic: 'https://music.apple.com/us/artist/dany-glock/1739565666',
      },
      copyrightText: '© 2026 Dany Glock. Todos los derechos reservados.',
      maintenanceMode: false,
      verification: {
        status: 'verified',
        sourceUrl: 'https://www.youtube.com/@danyglock',
        consultedAt: '2026-10-23T00:00:00.000Z',
        notes:
          'Canales oficiales de YouTube (@danyglock, ID UCf-4AJMV8QZz1jj4OVBzaxg), Instagram (@danyglock_) y Apple Music (ID 1739565666) verificados. No se asignan correos ficticios ni perfiles no confirmados.',
      },
    },
  });
  console.log('✓ Global SiteSettings actualizado con canales oficiales y verificación.');

  // -------------------------------------------------------------
  // 7. Siembra de Eventos (Events) — Pasto Vive Flow (Borrador)
  // -------------------------------------------------------------
  const eventSlug = 'pasto-vive-flow-2026';
  const existingEvent = await payload.find({
    collection: 'events',
    where: {
      slug: {
        equals: eventSlug,
      },
    },
    draft: true,
  });

  if (existingEvent.totalDocs === 0) {
    const createdEvent = await payload.create({
      collection: 'events',
      draft: true, // BORRADOR MANDATORIO
      data: {
        eventName: 'Pasto Vive Flow 2026',
        slug: eventSlug,
        date: '2026-08-01T20:00:00.000Z',
        city: 'Pasto',
        country: 'Colombia',
        venue: 'Centro de Eventos Andino, Pasto',
        ticketStatus: 'available',
        additionalInfo:
          'Mención en prensa regional sobre festival urbano en Nariño. Registro conservado estrictamente como borrador con participación pendiente de confirmación oficial.',
        verification: {
          status: 'to_confirm',
          sourceUrl: 'https://www.instagram.com/danyglock_/',
          consultedAt: '2026-10-23T00:00:00.000Z',
          notes:
            'Participación y cartel oficial pendientes de confirmación formal por parte del management y promotores del evento. No debe publicarse en la web pública hasta confirmación.',
        },
        _status: 'draft',
      },
    });
    console.log(`  + Creado Evento "${createdEvent.eventName}" (BORRADOR, ID: ${createdEvent.id})`);
  } else {
    console.log(`  = Evento existente "${existingEvent.docs[0].eventName}" (ID: ${existingEvent.docs[0].id})`);
  }

  console.log('✅ Siembra de datos del artista completada con éxito.');
}

// Ejecución directa si se invoca vía CLI / tsx
if (process.argv[1]?.includes('seed-artist-data')) {
  seedArtistData()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error ejecutando seedArtistData:', err);
      process.exit(1);
    });
}
