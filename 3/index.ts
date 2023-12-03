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

const isValid = (grid: Grid) => (p: Point) =>
  p.x >= 0 && p.x < grid[0].length && p.y >= 0 && p.y < grid.length

const read = () => readFile('./input.txt', 'utf8')

const isSymbol = (s: string) => /[^\.\d]/.test(s)

const isNumber = (s: string | undefined) => s && /\d/.test(s)

const getPartNumber = (line: string[], i: number): number => {
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
  return Number(parts)
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
          part: getPartNumber(grid[y], x),
        }
        parts.push(part)
        x += `${part.part}`.length
      } else {
        x++
      }
    }
  }

  const actualParts = parts.filter((p) => {
    const s = `${p.part}`
    const adj = getAdjacent(p.point.y, p.point.x, s.length).filter(valid)
    return adj.some((p) => isSymbol(grid[p.y][p.x]))
  })

  console.log(
    'Total',
    actualParts.map((p) => p.part).reduce((total, p) => total + p, 0)
  )
}

main()
