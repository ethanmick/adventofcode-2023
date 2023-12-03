import { readFile } from 'fs/promises'

type Grid = string[][]

type Point = {
  x: number
  y: number
}

type Part = {
  point: Point
  part: number
}

type Gear = {
  point: Point
  parts: Part[]
}

const hash = (p: Part) => `${p.point.y}.${p.point.x}.${p.part}`

const isValid = (grid: Grid) => (p: Point) =>
  p.x >= 0 && p.x < grid[0].length && p.y >= 0 && p.y < grid.length

const read = () => readFile('./input.txt', 'utf8')

const isSymbol = (s: string) => /[^\.\d]/.test(s)

const isGear = (s: string) => s === '*'

const isNumber = (s: string | undefined) => s && /\d/.test(s)

const getPartNumber = (line: string[], i: number): { n: number; i: number } => {
  let j = i,
    k = i,
    parts = `${line[i]}`
  while (true) {
    if (isNumber(line[j - 1])) {
      j--
      parts = line[j] + parts
    }
    if (isNumber(line[k + 1])) {
      k++
      parts = parts + line[k]
    }
    if (!isNumber(line[j - 1]) && !isNumber(line[k + 1])) {
      break
    }
  }
  return {
    n: Number(parts),
    i: j,
  }
}

const getAdjacent = (y: number, x: number, z: number): Point[] => {
  const xs = [...Array(z + 2).fill(0)].map((_, i) => i + x - 1)
  return xs.flatMap((x1) =>
    [-1, 0, 1].map((y1) => ({
      y: y + y1,
      x: x1,
    }))
  )
}

const main = async () => {
  const input = await read()
  const grid: Grid = input.split(/\r?\n/).map((line) => line.split(''))
  const valid = isValid(grid)
  const parts: Part[] = []

  for (let y = 0; y < grid.length; y++) {
    let x = 0
    while (x < grid[0].length) {
      if (isNumber(grid[y][x])) {
        const part = {
          point: { x, y },
          part: getPartNumber(grid[y], x).n,
        }
        parts.push(part)
        x += `${part.part}`.length
      } else {
        x++
      }
    }
  }

  // Part 2
  const partsHash: Record<string, Part> = {}
  parts.forEach((p) => (partsHash[hash(p)] = p))

  const gears: Gear[] = []
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (isGear(grid[y][x])) {
        const adj = getAdjacent(y, x, 1).filter(valid)
        const found: Record<string, Part> = {}
        for (let a of adj) {
          if (isNumber(grid[a.y][a.x])) {
            const { n, i } = getPartNumber(grid[a.y], a.x)
            const part: Part = {
              point: { y: a.y, x: i },
              part: n,
            }
            found[hash(part)] = part
          }
        }
        if (Object.keys(found).length == 2) {
          gears.push({
            point: { x, y },
            parts: Object.values(found),
          })
        }
      }
    }
  }

  console.log(
    'Total',
    gears
      .map((g) => g.parts[0].part * g.parts[1].part)
      .reduce((total, p) => total + p, 0)
  )
}

main()
