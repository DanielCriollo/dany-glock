import type { CollectionConfig } from 'payload';
import { adminsOnly, adminsOrSelf } from '@/access';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Administración',
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    read: adminsOrSelf,
    create: adminsOnly,
    update: adminsOrSelf,
    delete: adminsOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre Completo',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol en la Plataforma',
      required: true,
      defaultValue: 'admin',
      options: [
        {
          label: 'Administrador (Acceso Total)',
          value: 'admin',
        },
        {
          label: 'Editor (Gestión de Contenido)',
          value: 'editor',
        },
      ],
      access: {
        update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
      },
    },
  ],
};
