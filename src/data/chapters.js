/**
 * src/data/chapters.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Ported from legacy_vanilla_app/shared/chapters.js.
 * Single source of truth for all Feed the City chapter cities.
 *
 * TO ADD A NEW CITY: add one object to CHAPTERS. That's all.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const CHAPTERS = [
  // ── FIRST SATURDAYS ──────────────────────────────────────────────────────
  { slug: 'arlington-tx',            name: 'Arlington, TX',               page: '/feed-the-city-arlington',              week: 1 },
  { slug: 'fort-worth-tx-south',     name: 'Fort Worth, TX (South)',      page: '/feed-the-city-fort-worth-south',       week: 1 },
  { slug: 'highland-village-tx',     name: 'Highland Village, TX',        page: '/feed-the-city-highland-village',       week: 1 },
  { slug: 'plano-tx',                name: 'Plano, TX',                   page: '/feed-the-city-plano',                  week: 1 },
  { slug: 'prosper-tx',              name: 'Prosper, TX',                 page: '/feed-the-city-prosper',                week: 1 },
  { slug: 'richmond-tx',             name: 'Richmond, TX',                page: '/feed-the-city-richmond',               week: 1 },
  { slug: 'royse-city-tx',           name: 'Royse City, TX',              page: '/feed-the-city-royse-city',             week: 1 },
  { slug: 'scottsdale-az',           name: 'Scottsdale, AZ',              page: '/feed-the-city-scottsdale',             week: 1 },
  { slug: 'wichita-ks',              name: 'Wichita, KS',                 page: '/feed-the-city-wichita',                week: 1 },
  { slug: 'wylie-tx',                name: 'Wylie, TX',                   page: '/feed-the-city-wylie',                  week: 1 },

  // ── SECOND SATURDAYS ─────────────────────────────────────────────────────
  { slug: 'austin-tx-zilker',        name: 'Austin, TX (Zilker)',         page: '/feed-the-city-austin-zilker',          week: 2 },
  { slug: 'bedford-tx',              name: 'Bedford, TX',                 page: '/feed-the-city-bedford',                week: 2 },
  { slug: 'celina-tx',               name: 'Celina, TX',                  page: '/feed-the-city-celina',                 week: 2 },
  { slug: 'dallas-tx-original',      name: 'Dallas, TX (The Original)',   page: '/feed-the-city-dallas',                 week: 2 },
  { slug: 'fort-worth-tx-alliance',  name: 'Fort Worth, TX (Alliance)',   page: '/feed-the-city-fort-worth-alliance',    week: 2 },
  { slug: 'garland-tx',              name: 'Garland, TX',                 page: '/feed-the-city-garland',                week: 2 },
  { slug: 'houston-tx',              name: 'Houston, TX',                 page: '/feed-the-city-houston',                week: 2 },
  { slug: 'lewisville-coppell-tx',   name: 'Lewisville/Coppell, TX',     page: '/feed-the-city-lewisville',             week: 2 },
  { slug: 'littleton-co',            name: 'Littleton, CO',               page: '/feed-the-city-littleton',              week: 2 },
  { slug: 'rockwall-tx',             name: 'Rockwall, TX',                page: '/feed-the-city-rockwall',               week: 2 },
  { slug: 'tulsa-ok',                name: 'Tulsa, OK',                   page: '/feed-the-city-tulsa',                  week: 2 },

  // ── THIRD SATURDAYS ──────────────────────────────────────────────────────
  { slug: 'alpharetta-ga',           name: 'Alpharetta, GA',              page: '/feed-the-city-alpharetta',             week: 3 },
  { slug: 'bethel-park-pa',          name: 'Bethel Park, PA',             page: '/feed-the-city-bethel-park',            week: 3 },
  { slug: 'denton-tx',               name: 'Denton, TX',                  page: '/feed-the-city-denton',                 week: 3 },
  { slug: 'elizabethtown-ky',        name: 'Elizabethtown, KY',           page: '/feed-the-city-elizabethtown',          week: 3 },
  { slug: 'fort-worth-tx-lake-worth',name: 'Fort Worth, TX (Lake Worth)', page: '/feed-the-city-fort-worth-lake-worth',  week: 3 },
  { slug: 'frisco-tx',               name: 'Frisco, TX',                  page: '/feed-the-city-frisco',                 week: 3 },
  { slug: 'grand-prairie-tx',        name: 'Grand Prairie, TX',           page: '/feed-the-city-grand-prairie',          week: 3 },
  { slug: 'greenville-tx',           name: 'Greenville, TX',              page: '/feed-the-city-greenville',             week: 3 },
  { slug: 'hendersonville-tn',       name: 'Hendersonville, TN',          page: '/feed-the-city-hendersonville',         week: 3 },
  { slug: 'huntsville-al',           name: 'Huntsville, AL',              page: '/feed-the-city-huntsville',             week: 3 },
  { slug: 'mansfield-tx',            name: 'Mansfield, TX',               page: '/feed-the-city-mansfield',              week: 3 },
  { slug: 'mckinney-tx',             name: 'McKinney, TX',                page: '/feed-the-city-mckinney',               week: 3 },
  { slug: 'richardson-tx',           name: 'Richardson, TX',              page: '/feed-the-city-richardson',             week: 3 },
  { slug: 'round-rock-tx',           name: 'Round Rock, TX',              page: '/feed-the-city-round-rock',             week: 3 },
  { slug: 'southlake-tx',            name: 'Southlake, TX',               page: '/feed-the-city-southlake',              week: 3 },
  { slug: 'waco-tx',                 name: 'Waco, TX',                    page: '/feed-the-city-waco',                   week: 3 },
  { slug: 'waxahachie-tx',           name: 'Waxahachie, TX',              page: '/feed-the-city-waxahachie',             week: 3 },

  // ── FOURTH SATURDAYS ─────────────────────────────────────────────────────
  { slug: 'allen-tx',                name: 'Allen, TX',                   page: '/feed-the-city-allen',                  week: 4 },
  { slug: 'austin-tx-south',         name: 'Austin, TX (South)',          page: '/feed-the-city-austin-south',           week: 4 },
  { slug: 'burleson-tx',             name: 'Burleson, TX',                page: '/feed-the-city-burleson',               week: 4 },
  { slug: 'carrollton-tx',           name: 'Carrollton, TX',              page: '/feed-the-city-carrollton',             week: 4 },
  { slug: 'cedar-hill-tx',           name: 'Cedar Hill, TX',              page: '/feed-the-city-cedar-hill',             week: 4 },
  { slug: 'dallas-tx-lakewood',      name: 'Dallas, TX (Lakewood)',       page: '/feed-the-city-dallas-lakewood',        week: 4 },
  { slug: 'denver-co',               name: 'Denver, CO',                  page: '/feed-the-city-denver',                 week: 4 },
  { slug: 'forney-tx',               name: 'Forney, TX',                  page: '/feed-the-city-forney',                 week: 4 },
  { slug: 'irving-tx',               name: 'Irving, TX',                  page: '/feed-the-city-irving',                 week: 4 },
  { slug: 'spring-tx',               name: 'Spring, TX',                  page: '/feed-the-city-spring',                 week: 4 },
]

/** Resolve a ?chapter= slug to its chapter object (or null). */
export function getChapter(slug) {
  if (!slug) return null
  return CHAPTERS.find(c => c.slug === slug) ?? null
}

/** Group chapters by week number for optgroup rendering. */
export const CHAPTERS_BY_WEEK = [1, 2, 3, 4].map(week => ({
  week,
  label: `${['First', 'Second', 'Third', 'Fourth'][week - 1]} Saturdays`,
  chapters: CHAPTERS.filter(c => c.week === week),
}))
