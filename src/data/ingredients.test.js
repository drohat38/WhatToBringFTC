import { describe, it, expect } from 'vitest'
import { ITEMS, ALSO_ITEMS, getReq, getUnit } from './ingredients'

describe('getReq — quantity formulas', () => {
  it('computes the default goal (30 sandwiches)', () => {
    expect(getReq(30)).toEqual({
      bread: 3, // ceil(30/10)
      meat: 60, // 2 oz each
      cheese: 30, // 1 slice each
      mustard: 1, // ceil(30/50)
      bags: 1, // ceil(30/50)
      chips: 1, // floor(30/20)
      tangerines: 1, // floor(30/20)
    })
  })

  it('scales linearly for larger goals (100 sandwiches)', () => {
    expect(getReq(100)).toEqual({
      bread: 10,
      meat: 200,
      cheese: 100,
      mustard: 2,
      bags: 2,
      chips: 5,
      tangerines: 5,
    })
  })

  it('rounds bread, mustard, and bags UP so volunteers never under-buy', () => {
    const r = getReq(45)
    expect(r.bread).toBe(5) // ceil(45/10) = 5, not 4
    expect(r.mustard).toBe(1) // ceil(45/50) = 1
    expect(r.bags).toBe(1) // ceil(45/50) = 1
  })

  it('clamps chips and tangerines to a minimum of 1 for small goals', () => {
    const r = getReq(5)
    expect(r.chips).toBe(1) // floor(5/20) = 0 -> clamped to 1
    expect(r.tangerines).toBe(1)
  })

  it('returns whole numbers for every item across the supported range', () => {
    for (let g = 5; g <= 500; g += 5) {
      for (const qty of Object.values(getReq(g))) {
        expect(Number.isInteger(qty)).toBe(true)
        expect(qty).toBeGreaterThanOrEqual(1)
      }
    }
  })
})

describe('getUnit — singular/plural labels', () => {
  const bread = ITEMS.find((i) => i.key === 'bread')

  it('uses the singular unit for a quantity of 1', () => {
    expect(getUnit(bread, 1)).toBe('loaf')
  })

  it('uses the plural unit for any quantity other than 1', () => {
    expect(getUnit(bread, 3)).toBe('loaves')
    expect(getUnit(bread, 0)).toBe('loaves')
  })
})

describe('item data integrity', () => {
  const allItems = [...ITEMS, ...ALSO_ITEMS]

  it('exposes the expected core and snack items', () => {
    expect(ITEMS.map((i) => i.key)).toEqual([
      'bread',
      'meat',
      'cheese',
      'mustard',
      'bags',
    ])
    expect(ALSO_ITEMS.map((i) => i.key)).toEqual(['chips', 'tangerines'])
  })

  it('gives every item the fields the UI renders', () => {
    for (const item of allItems) {
      expect(item.key).toBeTruthy()
      expect(item.name).toBeTruthy()
      expect(item.hint).toBeTruthy()
      expect(item.baseUnit).toBeTruthy()
      expect(item.pluralUnit).toBeTruthy()
      expect(item.img).toMatch(/^https:\/\//)
    }
  })

  it('has a quantity formula for every item key', () => {
    const req = getReq(30)
    for (const item of allItems) {
      expect(req).toHaveProperty(item.key)
    }
  })
})
