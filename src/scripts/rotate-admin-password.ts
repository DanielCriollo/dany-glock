import config from '../payload.config';
import { getPayload } from 'payload';

async function rotatePassword() {
  const email = process.env.ROTATE_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const newPassword = process.env.ROTATE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!email || !newPassword) {
    console.error('ERROR: Debes definir las variables ROTATE_ADMIN_EMAIL y ROTATE_ADMIN_PASSWORD en el entorno.');
    console.error('Ejemplo: $env:ROTATE_ADMIN_EMAIL="admin@dominio.com"; $env:ROTATE_ADMIN_PASSWORD="[NUEVA_CLAVE]"; pnpm exec tsx src/scripts/rotate-admin-password.ts');
    process.exit(1);
  }

  if (newPassword.length < 14) {
    console.error('ERROR: La nueva contraseña debe tener al menos 14 caracteres por política de seguridad.');
    process.exit(1);
  }

  const payload = await getPayload({ config });

  const users = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
  });

  if (users.totalDocs === 0) {
    console.error('ERROR: No se encontró ningún usuario con el correo especificado.');
    process.exit(1);
  }

  const targetUser = users.docs[0];

  await payload.update({
    collection: 'users',
    id: targetUser.id,
    data: {
      password: newPassword,
    },
  });

  // Salida segura sin revelar la contraseña ni tokens
  console.log('✅ Contraseña actualizada exitosamente para el usuario ID:', targetUser.id);
  console.log('ℹ️ La sesión anterior ha sido invalidada.');
  process.exit(0);
}

rotatePassword().catch((err) => {
  console.error('Error durante la rotación:', err.message);
  process.exit(1);
});
