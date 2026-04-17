const mediumMap: Record<string, string> = {
  'canvas': 'canvas',
  'oil': 'oil',
  'acrylic': 'acrylic',
  'spray': 'spray',
  'oil stick': 'oil_stick',
  'collage': 'collage',
  'textile': 'textile',
  'plywood': 'plywood',
  'mural': 'mural',
  'gypsum': 'gypsum',
  'marble': 'marble',
  'silkscreen': 'silkscreen',
  'paper': 'paper',
  'mixed media': 'mixed_media',
  'two canvases': 'two_canvases',
  'esparto blinds': 'esparto_blinds',
  'air hardening modeling clay': 'clay',
  'on': 'on',
  'layers': 'layers',
};

// All known translation keys
const knownKeys = new Set(Object.values(mediumMap));

function safeT(t: (key: string) => string, key: string, fallback: string): string {
  if (knownKeys.has(key)) {
    return t(key);
  }
  return fallback;
}

export function translateMedium(medium: string, t: (key: string) => string): string {
  if (medium === 'mural') return t('mural');
  if (medium === 'acrylic on canvas') return `${t('acrylic')} ${t('on')} ${t('canvas').toLowerCase()}`;
  if (medium.startsWith('mixed media')) {
    const rest = medium.replace('mixed media', '');
    const parts = rest.split(',').filter(Boolean);
    return t('mixed_media') + parts.map(p => `, ${translatePart(p.trim(), t)}`).join('');
  }
  if (medium.startsWith('two canvases')) {
    const rest = medium.replace('two canvases', '');
    const parts = rest.split(',').filter(Boolean);
    return t('two_canvases') + parts.map(p => `, ${translatePart(p.trim(), t)}`).join('');
  }
  if (medium.startsWith('air hardening modeling clay')) {
    const rest = medium.replace('air hardening modeling clay', '');
    const parts = rest.split(',').filter(Boolean);
    return t('clay') + parts.map(p => `, ${translatePart(p.trim(), t)}`).join('');
  }
  if (medium.startsWith('silkscreen')) {
    const parts = medium.split(', ');
    const result = [t('silkscreen')];
    for (let i = 1; i < parts.length; i++) {
      const p = parts[i];
      if (p.match(/^\d+ layers?$/)) {
        result.push(p.replace(/layers?/, t('layers')));
      } else if (p.includes('paper')) {
        result.push(t('paper'));
      } else {
        result.push(p);
      }
    }
    return result.join(', ');
  }

  return medium.split(', ').map(part => translatePart(part, t)).join(', ');
}

function translatePart(part: string, t: (key: string) => string): string {
  if (part.includes('/')) {
    return part.split('/').map(p => translateSingle(p.trim(), t)).join('/');
  }
  return translateSingle(part, t);
}

function translateSingle(word: string, t: (key: string) => string): string {
  const key = mediumMap[word.toLowerCase()];
  if (key) {
    return safeT(t, key, word);
  }
  // Unknown word — return as-is
  return word;
}
