import { describe, it, expect } from 'vitest'
import { CHAPTERS, CHAPTERS_BY_WEEK, getChapter } from './chapters'

describe('getChapter — slug lookup', () => {
  it('resolves a known slug to its chapter object', () => {
    expect(getChapter('denton-tx')).toEqual({
      slug: 'denton-tx',
      name: 'Denton, TX',
      page: '/feed-the-city-denton',
      week: 3,
    })
  })

  it('returns null for an unknown slug', () => {
    expect(getChapter('atlantis-xx')).toBeNull()
  })

  it('returns null for empty or missing input', () => {
    expect(getChapter('')).toBeNull()
    expect(getChapter(null)).toBeNull()
    expect(getChapter(undefined)).toBeNull()
  })
})

describe('CHAPTERS data integrity', () => {
  it('has unique slugs', () => {
    const slugs = CHAPTERS.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('gives every chapter the required fields', () => {
    for (const c of CHAPTERS) {
      expect(c.slug).toMatch(/^[a-z0-9-]+$/)
      expect(c.name).toBeTruthy()
      expect(c.page).toMatch(/^\/feed-the-city-/)
      expect([1, 2, 3, 4]).toContain(c.week)
    }
  })
})

describe('CHAPTERS_BY_WEEK — optgroup grouping', () => {
  it('produces one group per Saturday with the right label', () => {
    expect(CHAPTERS_BY_WEEK.map((g) => g.label)).toEqual([
      'First Saturdays',
      'Second Saturdays',
      'Third Saturdays',
      'Fourth Saturdays',
    ])
  })

  it('partitions every chapter into exactly one week group', () => {
    const grouped = CHAPTERS_BY_WEEK.flatMap((g) => g.chapters)
    expect(grouped).toHaveLength(CHAPTERS.length)
    for (const group of CHAPTERS_BY_WEEK) {
      for (const c of group.chapters) {
        expect(c.week).toBe(group.week)
      }
    }
  })
})
