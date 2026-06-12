
export const COLOURS = [
  { name: 'Midnight', hex: '#1a1a2e' },
  { name: 'Ivory',    hex: '#f5f0e8' },
  { name: 'Slate',    hex: '#6b7280' },
  { name: 'Rust',     hex: '#b45309' },
  { name: 'Forest',   hex: '#166534' },
  { name: 'Cobalt',   hex: '#1d4ed8' },
];

const SIZE_SETS = {
  "men's clothing":   ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  "women's clothing": ['XS', 'S', 'M', 'L', 'XL'],
  "jewelery":         ['6.5"', '7"', '7.5"', '8"'],
  "electronics":      ['64GB', '128GB', '256GB'],  // or just remove sizes entirely
};

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];
const SIZE_STATUS   = ['available', 'available', 'available', 'low-stock', 'available', 'sold-out'];


export function getVariantsForProduct(product) {
  const seed = Number(product.id) || 1;
  const sizes = SIZE_SETS[product.category] ?? DEFAULT_SIZES;

  const numColours = (seed % 3) + 2;
  const colours = [];
  for (let i = 0; i < numColours; i++) {
    colours.push(COLOURS[(seed + i * 3) % COLOURS.length]);
  }

  return colours.map((colour, ci) => ({
    colour: colour.name,
    hex: colour.hex,
    sizes: sizes.map((size, si) => ({
      size,
      status: SIZE_STATUS[(seed + ci + si) % SIZE_STATUS.length],
    })),
  }));
}

export function getThumbnails(image) {
  if (!image) return [];
  return [image, image, image, image];
}
