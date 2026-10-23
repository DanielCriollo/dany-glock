# 14 — Despliegue en VPS (Producción)

Guía práctica del despliegue de Dany Glock en el VPS Ubuntu compartido con otros proyectos (Laravel, WordPress, n8n…).
Despliegue inicial realizado el **2026-10-23**. Sin CI/CD ni automatización: las actualizaciones son manuales.

> Este documento no contiene secretos. Los secretos viven solo en `/var/www/dany-glock/.env` (permisos `600`, ignorado por Git).

---

## 1. Ficha

| Elemento | Valor |
| :--- | :--- |
| URL pública | `https://dany.forcefilters.com` |
| Payload Admin | `https://dany.forcefilters.com/admin` |
| VPS | `51.83.75.178` — Ubuntu 24.04.4 LTS, 2 vCPU, 1.9 GB RAM + 2 GB swap |
| Acceso SSH (Windows) | `ssh dany-vps` (alias en `~/.ssh/config`, clave `~/.ssh/dany_vps_ed25519`, usuario `ubuntu`) |
| Directorio | `/var/www/dany-glock` |
| Usuario Linux de la app | `danyglock` (sin sudo) |
| Puerto interno | `127.0.0.1:3100` (solo localhost; el 3000 lo ocupa otro servicio) |
| Servicio systemd | `dany-glock.service` (`/etc/systemd/system/dany-glock.service`) |
| Proxy web | Nginx 1.24 existente — `/etc/nginx/sites-available/dany.forcefilters.com`, enlazado como `sites-enabled/zz-dany.forcefilters.com` |
| Certificado | Let's Encrypt `dany.forcefilters.com` (webroot `/var/www/letsencrypt-dany`), renovación por `certbot.timer`, hook `systemctl reload nginx` |
| Base de datos | PostgreSQL 16 existente — BD `danyglock_db`, rol `danyglock_app` (sin superusuario) |
| Runtime | Node `v24.22.1`, pnpm `10.34.4` (fijado vía Corepack solo para `danyglock`) |
| Repositorio | `https://github.com/DanielCriollo/dany-glock.git` (público, clonado por HTTPS) |
| Rama / commit desplegado | `wip/mision-006a` @ `329157f412a06c732efb663da5f1dc5770e10b7c` (M006-B.3 + M006-B.4, 2026-10-23 21:43 UTC). Anteriores: `45b84d2`, `e12f397`, `8ea781f` |

### Por qué el enlace se llama `zz-…`
Nginx carga `sites-enabled/*` en orden alfabético y el primer `server` de cada `listen` es el *default server*. Con el nombre `dany.forcefilters.com` el vhost quedaba primero y capturaba peticiones de dominios sin bloque propio en :80 / :443. El prefijo `zz-` lo carga al final y preserva el default original (`game-app.conf`). **No renombrar.**

---

## 2. Variables de entorno (`/var/www/dany-glock/.env`)

| Variable | Uso |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `3100` |
| `HOSTNAME` | `127.0.0.1` |
| `NEXT_PUBLIC_SITE_URL` | `https://dany.forcefilters.com` (de `.env.example`; hoy no lo lee el código) |
| `DATABASE_URL` | `postgresql://danyglock_app:<secreto>@127.0.0.1:5432/danyglock_db` |
| `PAYLOAD_SECRET` | 64 caracteres hex aleatorios (obligatorio en producción) |

Permisos: `-rw------- danyglock:danyglock`. Para leer un valor: `sudo -u danyglock grep ^VAR /var/www/dany-glock/.env`.
**Nunca** cambiar `PAYLOAD_SECRET` sin necesidad: invalida sesiones y tokens.

---

## 3. Seguridad aplicada (cambios fuera del directorio del proyecto)

| Cambio | Archivo | Respaldo |
| :--- | :--- | :--- |
| Swap 2 GB + `vm.swappiness=10` (autorizado) | `/swapfile`, `/etc/fstab`, `/etc/sysctl.d/99-dany-swap.conf` | `/etc/fstab.bak-dany-20261023` |
| Rechazo de conexiones remotas solo a `danyglock_db` (autorizado) | `/etc/postgresql/16/main/pg_hba.conf` (2 líneas `reject` antes de `host all all 0.0.0.0/0 md5`) | `pg_hba.conf.bak-dany-20261023` |
| Vhost exclusivo | `/etc/nginx/sites-available/dany.forcefilters.com` | `/root/dany.forcefilters.com.phase{1,2}.bak` |
| Servicio | `/etc/systemd/system/dany-glock.service` | — (nuevo) |

`/api/users/first-register` responde **403** en Nginx (defensa adicional; el admin ya existe).
El admin inicial se creó por el usuario mediante túnel SSH (`ssh -N -L 3100:127.0.0.1:3100 dany-vps` → `http://localhost:3100/admin`) antes de exponer `/admin`.

---

## 4. Actualizar la web (procedimiento manual)

**En Windows:** desarrollar → `pnpm typecheck && pnpm lint && pnpm test && pnpm build` → commit → `git push`.

**En el VPS:**

```bash
ssh dany-vps
sudo -iu danyglock
cd /var/www/dany-glock

git fetch origin
git log --oneline HEAD..origin/wip/mision-006a      # revisar qué llega
git diff --stat HEAD origin/wip/mision-006a -- src/migrations pnpm-lock.yaml
git pull --ff-only origin wip/mision-006a

pnpm install --frozen-lockfile                        # si cambió pnpm-lock.yaml

# SIEMPRE respaldar la BD antes de desplegar si cambió src/migrations/
set -a; . ./.env; set +a
pg_dump -Fc "$DATABASE_URL" -f /var/backups/dany-glock/pre-deploy-$(date +%Y%m%d-%H%M%S).dump
pnpm payload migrate:status
pnpm payload migrate                                  # aplica migraciones pendientes
exit                                                  # volver al usuario ubuntu
```

```bash
# Build con el servicio detenido (RAM limitada: build ≈1.4 GB). Interrupción ≈ 1–2 min.
sudo systemctl stop dany-glock
sudo -iu danyglock bash -c 'cd /var/www/dany-glock && NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 pnpm build'
sudo systemctl start dany-glock
systemctl status dany-glock --no-pager
curl -s -o /dev/null -w "%{http_code}\n" https://dany.forcefilters.com/
curl -s -o /dev/null -w "%{http_code}\n" https://dany.forcefilters.com/admin
```

Si el build falla, **no arrancar** con un `.next` roto: volver al commit anterior (sección 7) y recompilar.

Recuperación rápida opcional: antes del build copiar el build actual (`cp -a .next /home/danyglock/next-prev-<commit>`); si el nuevo build falla, `git checkout <commit-anterior>`, restaurar esa copia en `.next` y arrancar (las migraciones aditivas son compatibles con el código anterior).

### Advertencias
- `payload.config.ts` define `prodMigrations`: **al arrancar en producción Payload aplica automáticamente las migraciones pendientes**. Un simple `systemctl restart` tras un `pull` con migraciones nuevas modifica la BD → respaldar antes. **También cualquier comando CLI de Payload con el `.env` cargado** (incluido `pnpm payload migrate:status` o el seed) aplica las pendientes: hacer el `pg_dump` **antes** de cualquier comando `payload` (ocurrió así en el despliegue de `e12f397`).
- Una migración incompatible (renombrar/eliminar columnas, cambiar tipos) puede requerir coordinación adicional (migración en dos fases, ventana de mantenimiento). Revisar el SQL de cada migración nueva antes de desplegar.
- El procedimiento provoca una interrupción breve del sitio.
- Hasta desplegar M006-B.3, los cambios del CMS requieren build + restart. **Con M006-B.3 desplegado** se publican sin build (ISR bajo demanda, `16-cache-revalidation.md`); tras seeds por CLI usar `POST /api/revalidate` (admin) o esperar ≤ 1 h.

### Seed de datos verificados (idempotente)
`seed-artist-data.ts` solo se ejecuta si `argv[1]` contiene `seed-artist-data`; con `pnpm payload run` **no hace nada**. Forma correcta:

```bash
sudo -iu danyglock
cd /var/www/dany-glock && set -a && . ./.env && set +a
node node_modules/.pnpm/tsx@*/node_modules/tsx/dist/cli.mjs src/scripts/seed-artist-data.ts
```

**No ejecutar** `src/scripts/seed-admin.ts` en producción: crea datos de prueba ficticios.
**No ejecutar** `pnpm test` con el `.env` de producción: `cms-security.test.ts` escribe en la BD. Para tests en el VPS usar una BD temporal (`danyglock_test`) y exportar `DATABASE_URL` hacia ella.

---

## 5. Logs y diagnóstico

```bash
journalctl -u dany-glock -f                      # logs en vivo
journalctl -u dany-glock --since "1 hour ago"
systemctl status dany-glock --no-pager
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
sudo nginx -t
sudo certbot certificates --cert-name dany.forcefilters.com
free -h
```

---

## 6. Backups — qué respaldar

| Qué | Dónde | Cómo |
| :--- | :--- | :--- |
| Base de datos | `danyglock_db` | `pg_dump -Fc "$DATABASE_URL" -f /var/backups/dany-glock/manual-$(date +%F).dump` (como `danyglock`, con `.env` cargado) |
| Multimedia subida (Payload) | `/var/www/dany-glock/media/` (ignorado por Git; `git pull` y `pnpm build` no lo tocan) | `tar czf /var/backups/dany-glock/media-$(date +%F).tgz -C /var/www/dany-glock media` |
| Secretos | `/var/www/dany-glock/.env` | Copiar a un gestor de contraseñas (no a Git) |

Directorio local de dumps: `/var/backups/dany-glock` (propietario `danyglock`, `750`). Hoy **no hay copia automática ni externa** (pendiente DEPLOY-03).

---

## 7. Recuperación ante fallos

| Síntoma | Acción |
| :--- | :--- |
| Sitio caído / 502 | `systemctl status dany-glock`, `journalctl -u dany-glock -n 100`. El servicio se reinicia solo (`Restart=always`, probado con `kill -9`). |
| Build roto tras `pull` | `sudo -iu danyglock` → `cd /var/www/dany-glock && git checkout <commit-anterior>` → `pnpm install --frozen-lockfile` → build → `sudo systemctl restart dany-glock`. Volver a la rama con `git checkout wip/mision-006a` cuando esté corregido. |
| Migración dañó datos | Detener servicio, `pg_restore --clean --if-exists --no-owner -d "$DATABASE_URL" /var/backups/dany-glock/<dump>`, volver al commit anterior, build, arrancar. |
| Nginx no valida | Nunca recargar si `sudo nginx -t` falla. Restaurar el vhost desde `/root/dany.forcefilters.com.phase2.bak` o deshabilitar: `sudo rm /etc/nginx/sites-enabled/zz-dany.forcefilters.com && sudo nginx -t && sudo systemctl reload nginx`. |
| Falta de memoria (OOM) | `free -h`; `swapon --show`. El build necesita el servicio detenido. |
| Certificado | `sudo certbot renew --cert-name dany.forcefilters.com` (webroot; no edita configuración de Nginx). |

---

## 8. Próximo despliegue: M006-B integrado (Multimedia + Brochure)

Estado: **desplegado el 2026-10-23 20:30 UTC** (`45b84d2`, interrupción 73 s, migración en lote 3, seed ejecutado). Rollback rápido disponible en `/home/danyglock/next-prev-e12f397` + backup `pre-deploy-m006b-20261023-202816.dump`. Diferencias respecto a `e12f397`:

| Aspecto | Cambio | Impacto en el despliegue |
| :--- | :--- | :--- |
| Dependencias | `sharp` 0.35.5 → 0.34.5 (ADR-019) | **`pnpm install --frozen-lockfile` obligatorio** (cambia el lockfile) |
| Migración | `20261023_194032_add_brochure_content_structure` (aditiva; `down` verificado) | Se aplica al primer comando `payload` o al arrancar el servicio → **backup antes** |
| Datos | `seed-brochure-content.ts` (solo creación) | Ejecutar una vez tras migrar |
| Archivos | Flyers/fotos del brochure **no viajan por Git** | Subirlos desde `/admin` cuando management apruebe derechos |
| Rutas nuevas | `/booking`, `/epk` (404 hasta `press-kit.isPublic`) | Verificar tras el build |

```bash
ssh dany-vps
sudo -iu danyglock
cd /var/www/dany-glock
git fetch origin && git log --oneline HEAD..origin/wip/mision-006a
git pull --ff-only origin wip/mision-006a
pnpm install --frozen-lockfile
set -a; . ./.env; set +a
B=/var/backups/dany-glock/pre-deploy-m006b-$(date +%Y%m%d-%H%M%S).dump
pg_dump -Fc "$DATABASE_URL" -f "$B" && pg_restore --list "$B" | grep -c TABLE     # ANTES de cualquier comando payload
tar czf /var/backups/dany-glock/media-$(date +%Y%m%d-%H%M).tgz media
pnpm payload migrate                                                              # aplica 20261023_194032 (lote 3)
node node_modules/.pnpm/tsx@*/node_modules/tsx/dist/cli.mjs src/scripts/seed-brochure-content.ts
node -e "console.log(require('sharp').versions.vips)"                             # esperado: 8.17.3
cp -a .next /home/danyglock/next-prev-e12f397
exit
```

```bash
sudo systemctl stop dany-glock
sudo -iu danyglock bash -c 'cd /var/www/dany-glock && NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 pnpm build'
sudo systemctl start dany-glock
```

**No ejecutar** `seed-artist-data.ts` (sobrescribe globals, BRO-11) ni `import-brochure-assets.ts` (solo uso local).

Verificar: `/`, `/biografia` (módulo «Trayectoria y Colaboraciones» con 5 hitos verificados, sin Kiwid/Pistolón/INPEC), `/booking` (200, «30–45 minutos», sin contacto de management), `/epk` (404), `/admin`, `/api/globals/booking` (sin `management.name/email/whatsapp`), una imagen vía `/_next/image`, logs sin errores de sharp y los 14 dominios del VPS contra la línea base.

---

## 9. Próximo despliegue: M006-B.3 (revalidación del CMS)

Sin migraciones ni cambios de dependencias. Procedimiento y verificación en `16-cache-revalidation.md` §5. Tras desplegarlo, **los cambios editoriales ya no requieren build ni reinicio**.

---

## 10. Despliegue M006-B.3 + M006-B.4 (2026-10-23 21:43 UTC)

Realizado: `329157f`, corte 54 s, sin migraciones. Rollback rápido: `/home/danyglock/next-prev-45b84d2` + `pre-deploy-b34-*.dump`.

**Importar imágenes oficiales (procedimiento usado):**

```bash
# Windows: transferir solo archivos autorizados, con verificación
ssh dany-vps 'mkdir -m 700 /tmp/dany-b4-import'
scp <archivos.jpg> SHA256SUMS dany-vps:/tmp/dany-b4-import/
ssh dany-vps 'cd /tmp/dany-b4-import && sha256sum -c SHA256SUMS && sudo install -d -o danyglock -g danyglock -m 750 /var/www/dany-glock/local/official-assets/web && sudo install -o danyglock -g danyglock -m 640 *.jpg /var/www/dany-glock/local/official-assets/web/ && rm -rf /tmp/dany-b4-import'
# VPS (usuario danyglock), tras el backup:
node node_modules/.pnpm/tsx@*/node_modules/tsx/dist/cli.mjs src/scripts/import-official-assets.ts
```

Después hay que **regenerar la caché** (los scripts CLI no la invalidan): con sesión de admin en `/admin`, en la consola del navegador `fetch('/api/revalidate',{method:'POST'}).then(r=>r.status)` → `200`, o esperar ≤ 1 h.

**Desde M006-B.3, los cambios de contenido hechos en `/admin` no requieren build ni reinicio.**
