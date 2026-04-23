// ─────────────────────────────────────────────────────────────────────────────
// Feed the City — Ingredient data + quantity formulas
// Single source of truth. Used by MainCalculator and any future components.
// ─────────────────────────────────────────────────────────────────────────────

export const ITEMS = [
  {
    key: 'bread',
    img: 'https://static.wixstatic.com/media/a9ae83_3bfd318c84d44c35b91fff4f46dba805~mv2.png/v1/crop/x_0,y_5,w_400,h_391/fill/w_220,h_215,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1.png',
    name: 'Sliced Bread',
    hint: '~20 slices/loaf · 2 per sandwich',
    baseUnit: 'loaf',
    pluralUnit: 'loaves',
  },
  {
    key: 'meat',
    img: 'https://static.wixstatic.com/media/a9ae83_aa14fd8f544444f78b47554fb506aeb5~mv2.png/v1/crop/x_0,y_5,w_400,h_391/fill/w_220,h_215,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design%20(4).png',
    name: 'Deli Meat',
    hint: '2 oz per sandwich · any package size',
    baseUnit: 'oz total',
    pluralUnit: 'oz total',
  },
  {
    key: 'cheese',
    img: 'https://static.wixstatic.com/media/a9ae83_aed7077faf3e4d5399000e1c667585fc~mv2.png/v1/crop/x_0,y_5,w_400,h_391/fill/w_220,h_215,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2.png',
    name: 'Sliced Cheese',
    hint: '1 slice per sandwich · varies by brand',
    baseUnit: 'slice',
    pluralUnit: 'slices',
  },
  {
    key: 'mustard',
    img: 'https://static.wixstatic.com/media/a9ae83_664af05eb665460b926ad3ddbfa83164~mv2.jpg/v1/crop/x_0,y_32,w_2800,h_2736/fill/w_220,h_215,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/001853126.jpg',
    name: 'Yellow Mustard',
    hint: 'Standard 14–20 oz · 1 squirt per sandwich',
    baseUnit: 'bottle',
    pluralUnit: 'bottles',
  },
  {
    key: 'bags',
    img: 'https://static.wixstatic.com/media/a9ae83_13b53c33ff1b4e6db6fdc83f89d8247a~mv2.png/v1/crop/x_0,y_9,w_800,h_782/fill/w_220,h_215,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/000092478.png',
    name: 'Sandwich Bags',
    hint: '~50 bags/box · 1 per sandwich',
    baseUnit: 'box',
    pluralUnit: 'boxes',
  },
];

export const ALSO_ITEMS = [
  {
    key: 'chips',
    img: 'https://static.wixstatic.com/media/a9ae83_3b7b0c57641f49aa94e36cbbe9583ae6~mv2.png/v1/crop/x_0,y_5,w_400,h_391/fill/w_220,h_215,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3.png',
    name: 'Large Chips',
    hint: '~13 servings/bag · healthier ingredients preferred',
    baseUnit: 'full-size bag',
    pluralUnit: 'full-size bags',
  },
  {
    key: 'tangerines',
    img: 'https://static.wixstatic.com/media/a9ae83_a11fa6e07654426da9cc47a5acb60054~mv2.png/v1/crop/x_0,y_6,w_512,h_500/fill/w_220,h_215,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/image-of-neapolitan-tangerines-fruit-27960700829740_512x512.png',
    name: 'Tangerines',
    hint: 'Halos or Cuties · ~18 per bag · 2 per meal',
    baseUnit: 'bag (3 lbs)',
    pluralUnit: 'bags (3 lbs)',
  },
];

// Quantity formulas — goal = sandwich count
export function getReq(g) {
  return {
    bread:      Math.ceil(g / 10),
    meat:       g * 2,
    cheese:     g,
    mustard:    Math.ceil(g / 50),
    bags:       Math.ceil(g / 50),
    chips:      Math.max(1, Math.floor(g / 20)),
    tangerines: Math.max(1, Math.floor(g / 20)),
  };
}

// Singular/plural unit label
export function getUnit(item, val) {
  return val === 1 ? item.baseUnit : item.pluralUnit;
}
