import { readFile } from 'fs/promises'

const read = () => readFile('./input.txt', 'utf8')

type Range = {
  min: number
  max: number
}

type Mapper = {
  destination: Range
  source: Range
  n: number
}

// Returns the range of r2 that overlaps in r1.
const overlap = (r1: Range, r2: Range): Range | null => {
  if (r2.max < r1.min) return null
  if (r2.min > r1.max) return null
  return {
    min: Math.max(r1.min, r2.min),
    max: Math.min(r1.max, r2.max),
  }
}

const mapRange = (m: Mapper, input: Range): Range | null => {
  const subset = overlap(m.source, input)
  if (!subset) {
    return null
  }
  const offset = Math.max(m.source.min, subset.min) - m.source.min
  const length = subset.max - subset.min
  return {
    min: m.destination.min + offset,
    max: m.destination.min + offset + length,
  }
}

const parse = async () => {
  const split = (await read()).split('\n\n')
  const [seedsUnparsed, ...unparsedMaps] = split
  // Seed Generators
  const seeds = seedsUnparsed.split(':')[1].trim().split(/\s+/).map(Number)
  const generators: Range[] = []
  while (seeds.length) {
    const s = seeds.shift() as number
    const r = seeds.shift() as number
    generators.push({ min: s, max: s + r })
  }
  // Mappers
  const maps: Mapper[][] = unparsedMaps.map((raw) => {
    const [_, ...inputs] = raw.split('\n')
    return inputs.flatMap((line) => {
      const [destination, source, n] = line.split(/\s+/).map(Number)
      return {
        source: {
          min: Number(source),
          max: Number(source) + Number(n),
        },
        destination: {
          min: Number(destination),
          max: Number(destination) + Number(n),
        },
        n: Number(n),
      } as Mapper
    })
  })

  return {
    seeds: generators,
    maps,
  }
}

const main = async () => {
  const { seeds, maps } = await parse()

  const all: Range[] = []
  for (const seed of seeds) {
    let ranges: Range[] = [seed]
    for (const m of maps) {
      ranges = ranges.flatMap(
        (r) => m.map((m) => mapRange(m, r)).filter((n) => !!n) as Range[]
      )
    }
    all.push(...ranges)
  }

  console.log('Mininum Location', Math.min(...all.map((r) => r.min)))
}

main()
