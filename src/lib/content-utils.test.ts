import { describe, it, expect } from 'vitest';
import {
  slugify,
  extractYouTubeId,
  youTubeThumbnailUrl,
  youTubeEmbedUrl,
} from './content-utils';

describe('content-utils: slugify', () => {
  it('converts titles with accents and symbols to clean lowercase slugs', () => {
    expect(slugify('SIG Sauer - Single (Remix)')).toBe('sig-sauer-single-remix');
    expect(slugify('Cicatrices (feat. Maick Records)')).toBe('cicatrices-feat-maick-records');
    expect(slugify('SO FRESH, SO CLEAN')).toBe('so-fresh-so-clean');
    expect(slugify('Canción con tildes: ¡Árbol, camión, ñandú!')).toBe('cancion-con-tildes-arbol-camion-nandu');
  });

  it('handles empty, null, and edge cases safely', () => {
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
    expect(slugify('---hello---world---')).toBe('hello-world');
  });
});

describe('content-utils: extractYouTubeId', () => {
  it('extracts valid 11-char ID from standard watch URLs', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=kcac_CIFJ7k')).toBe('kcac_CIFJ7k');
    expect(extractYouTubeId('https://youtube.com/watch?v=DuU5yoDscxs&t=40s')).toBe('DuU5yoDscxs');
    expect(extractYouTubeId('https://m.youtube.com/watch?v=4BzpqeraFjc')).toBe('4BzpqeraFjc');
  });

  it('extracts valid ID from youtu.be short URLs', () => {
    expect(extractYouTubeId('https://youtu.be/SKgil-Dd1_M')).toBe('SKgil-Dd1_M');
    expect(extractYouTubeId('https://youtu.be/N3REsYJtfn4?si=xyz123')).toBe('N3REsYJtfn4');
  });

  it('extracts valid ID from embed, shorts, and live URLs', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/hvoy-jQNUnc')).toBe('hvoy-jQNUnc');
    expect(extractYouTubeId('https://www.youtube.com/shorts/kcac_CIFJ7k')).toBe('kcac_CIFJ7k');
    expect(extractYouTubeId('https://www.youtube-nocookie.com/embed/kcac_CIFJ7k')).toBe('kcac_CIFJ7k');
  });

  it('rejects invalid, spoofed or malicious domains', () => {
    expect(extractYouTubeId('https://youtube.com.attacker.com/watch?v=kcac_CIFJ7k')).toBeNull();
    expect(extractYouTubeId('https://faketube.com/watch?v=kcac_CIFJ7k')).toBeNull();
    expect(extractYouTubeId('javascript:alert(1)')).toBeNull();
    expect(extractYouTubeId('ftp://youtube.com/watch?v=kcac_CIFJ7k')).toBeNull();
    expect(extractYouTubeId('not-a-url')).toBeNull();
    expect(extractYouTubeId('')).toBeNull();
    expect(extractYouTubeId(null)).toBeNull();
    expect(extractYouTubeId(undefined)).toBeNull();
  });

  it('rejects URLs where video ID is not 11 chars or has invalid characters', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=short')).toBeNull();
    expect(extractYouTubeId('https://www.youtube.com/watch?v=waytoolongvideoidhere123456')).toBeNull();
    expect(extractYouTubeId('https://www.youtube.com/watch?v=invalid@char!')).toBeNull();
  });
});

describe('content-utils: youTubeThumbnailUrl & youTubeEmbedUrl', () => {
  it('generates correct thumbnail URL for valid IDs and null for invalid', () => {
    expect(youTubeThumbnailUrl('kcac_CIFJ7k')).toBe('https://i.ytimg.com/vi/kcac_CIFJ7k/hqdefault.jpg');
    expect(youTubeThumbnailUrl('invalid')).toBeNull();
    expect(youTubeThumbnailUrl(null)).toBeNull();
  });

  it('generates privacy-enhanced embed URL for valid IDs and null for invalid', () => {
    expect(youTubeEmbedUrl('kcac_CIFJ7k')).toBe('https://www.youtube-nocookie.com/embed/kcac_CIFJ7k?rel=0');
    expect(youTubeEmbedUrl('bad_id')).toBeNull();
    expect(youTubeEmbedUrl(undefined)).toBeNull();
  });
});
