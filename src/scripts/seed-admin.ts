import config from '../payload.config';
import { getPayload } from 'payload';
import path from 'path';
import fs from 'fs';

async function seedData() {
  const payload = await getPayload({ config });

  // 1. Optional admin user creation via environment variables only
  const seedEmail = process.env.SEED_ADMIN_EMAIL;
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;
  const seedName = process.env.SEED_ADMIN_NAME || 'Admin Local';

  if (seedEmail && seedPassword) {
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: seedEmail,
        },
      },
    });

    if (existingUsers.totalDocs === 0) {
      const user = await payload.create({
        collection: 'users',
        data: {
          name: seedName,
          email: seedEmail,
          password: seedPassword,
          role: 'admin',
        },
      });
      console.log('Admin user initialized from environment variables (ID):', user.id);
    } else {
      console.log('User already exists for configured email.');
    }
  }

  // 2. Ensure test media directory and dummy image exists for local testing
  const mediaDir = path.resolve(process.cwd(), 'media');
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }

  const dummyImagePath = path.join(mediaDir, 'test-cover.png');
  const png1x1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );
  if (!fs.existsSync(dummyImagePath)) {
    fs.writeFileSync(dummyImagePath, png1x1);
  }

  // Check if media already exists
  let mediaDoc;
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 1,
  });

  if (existingMedia.totalDocs === 0) {
    mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: 'Portada de prueba local — Misión 004',
        category: 'artwork',
        caption: 'Ficticio local exclusivamente para pruebas de integración',
        isPressAsset: false,
      },
      file: {
        data: png1x1,
        mimetype: 'image/png',
        name: 'test-cover.png',
        size: png1x1.length,
      },
    });
    console.log('Created test media (ID):', mediaDoc.id);
  } else {
    mediaDoc = existingMedia.docs[0];
    console.log('Existing media found (ID):', mediaDoc.id);
  }

  // 3. Check if test release already exists
  const existingReleases = await payload.find({
    collection: 'releases',
    where: {
      slug: {
        equals: 'noctambulo-demo-test',
      },
    },
    draft: true,
  });

  let releaseDoc;
  if (existingReleases.totalDocs === 0) {
    releaseDoc = await payload.create({
      collection: 'releases',
      data: {
        title: 'Noctámbulo (Demo Local Test)',
        slug: 'noctambulo-demo-test',
        type: 'single',
        coverImage: mediaDoc.id,
        releaseDate: new Date().toISOString(),
        description: 'Lanzamiento ficticio de prueba exclusivamente local para validación técnica.',
        _status: 'published',
        streamingLinks: {
          spotify: 'https://open.spotify.com/artist/dummy',
          youtube: 'https://youtube.com/watch?v=dummy',
        },
      },
    });
    console.log('Created test release (ID):', releaseDoc.id);
  } else {
    releaseDoc = existingReleases.docs[0];
    console.log('Existing release found (ID):', releaseDoc.id);
  }

  // 4. Create a draft release to test draft access restrictions
  const draftReleases = await payload.find({
    collection: 'releases',
    where: {
      slug: {
        equals: 'borrador-secreto-test',
      },
    },
    draft: true,
  });

  if (draftReleases.totalDocs === 0) {
    const draftRelease = await payload.create({
      collection: 'releases',
      draft: true,
      data: {
        title: 'Borrador Confidencial (No Publicado)',
        slug: 'borrador-secreto-test',
        type: 'album',
        coverImage: mediaDoc.id,
        releaseDate: new Date().toISOString(),
        description: 'Este álbum está en borrador y NO debe ser visible públicamente para anónimos.',
        _status: 'draft',
      },
    });
    console.log('Created draft release (ID):', draftRelease.id);
  }

  // 5. Create related track
  const existingTracks = await payload.find({
    collection: 'tracks',
    where: {
      title: {
        equals: 'Noctámbulo (Track Demo)',
      },
    },
  });

  if (existingTracks.totalDocs === 0) {
    const track = await payload.create({
      collection: 'tracks',
      data: {
        title: 'Noctámbulo (Track Demo)',
        release: releaseDoc.id,
        trackNumber: 1,
        duration: '3:15',
        featured: true,
        credits: {
          producers: 'Dany Glock & Producer Test',
          composers: 'Daniel Test',
        },
      },
    });
    console.log('Created test track related to release (ID):', track.id);
  }

  console.log('Test data verified successfully without hardcoded credentials.');
  process.exit(0);
}

seedData().catch((err) => {
  console.error('Seed error:', err.message);
  process.exit(1);
});
