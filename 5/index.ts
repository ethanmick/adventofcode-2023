import { readFile } from 'fs/promises'

const read = () => readFile('./input.txt', 'utf8')

type Ranges = {
  source: number
  destination: number
  range: number
}

type Mapper = Ranges[]
type Farm = Mapper[]

const inRange = (n: number, source: number, range: number) =>
  n >= source && n < source + range

const getDestination = (n: number, maps: Mapper) => {
  const m = maps.find((m) => inRange(n, m.source, m.range))
  return m ? m.destination + (n - m.source) : n
}

const parse = async () => {
  const split = (await read()).split('\n\n')
  const [seedsUnparsed, ...unparsedMaps] = split
  const seeds = seedsUnparsed.split(':')[1].trim().split(/\s+/).map(Number)
  const maps = unparsedMaps.map((raw) => {
    const [_, ...inputs] = raw.split('\n')
    return inputs
      .flatMap((line) => {
        const [destination, source, range] = line.split(/\s+/).map(Number)
        return {
          source: Number(source),
          destination: Number(destination),
          range: Number(range),
        }
      })
      .sort((a, b) => a.source - b.source)
  })

  return {
    seeds,
    maps,
  }
}

const main = async () => {
  const { seeds, maps } = await parse()

  const locations = seeds.map((s) => {
    let l = s
    for (let m of maps) {
      l = getDestination(l, m)
    }
    return l
  })

  console.log(Math.min(...locations))
}

main()
