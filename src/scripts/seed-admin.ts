import config from '../payload.config';
import { getPayload } from 'payload';
import path from 'path';
import fs from 'fs';

async function seedData() {
  const payload = await getPayload({ config });

  // 1. Ensure test media directory and dummy image exists
  const mediaDir = path.resolve(process.cwd(), 'media');
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }

  // Create a minimal 1x1 dummy PNG if needed
  const dummyImagePath = path.join(mediaDir, 'test-cover.png');
  // 1x1 transparent PNG buffer
  const png1x1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );
  fs.writeFileSync(dummyImagePath, png1x1);

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
    console.log('Created test media:', mediaDoc.id, mediaDoc.alt);
  } else {
    mediaDoc = existingMedia.docs[0];
    console.log('Existing media found:', mediaDoc.id);
  }

  // 2. Check if test release already exists
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
        description: 'Lanzamiento ficticio de prueba exclusivamente local para validación técnica de Misión 004.',
        _status: 'published',
        streamingLinks: {
          spotify: 'https://open.spotify.com/artist/dummy',
          youtube: 'https://youtube.com/watch?v=dummy',
        },
      },
    });
    console.log('Created test release:', releaseDoc.id, releaseDoc.title);
  } else {
    releaseDoc = existingReleases.docs[0];
    console.log('Existing release found:', releaseDoc.id);
  }

  // 3. Create a draft release to test draft access restrictions!
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
    console.log('Created draft release:', draftRelease.id, draftRelease.title);
  }

  // 4. Create related track
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
    console.log('Created test track related to release:', track.id, track.title);
  }

  console.log('All local test data seeded successfully.');
  process.exit(0);
}

seedData().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
