import { readFile } from 'fs/promises'

type Point = {
  x: number
  y: number
}

const isValid = (maxY: number, maxX: number) => (p: Point) =>
  p.x >= 0 && p.x < maxX && p.y >= 0 && p.y < maxY

const read = () => readFile('./input.txt', 'utf8')

const isSymbol = (s: string) => /[^\.\d]/.test(s)

const isNumber = (s: string | undefined) => s && /\d/.test(s)

const getPartNumber = (line: string[], i: number): number => {
  let j = i,
    k = i,
    parts = `${line[i]}`
  do {
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
  } while (true)
  return Number(parts)
}

const getAdjacent = (y: number, x: number, grid: string[][]): Point[] => {
  const valid = isValid(grid.length, grid[0].length)
  return [-1, 0, 1]
    .flatMap((i) =>
      [-1, 0, 1].map((j) => ({
        y: y + i,
        x: x + j,
      }))
    )
    .filter(valid)
}

const main = async () => {
  const input = await read()
  const grid = input.split(/\r?\n/).map((line) => line.split(''))
  const parts: Record<number, boolean> = {}

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const c = grid[y][x]
      if (isSymbol(c)) {
        const adj = getAdjacent(y, x, grid)
        const all = adj
          .filter((p) => isNumber(grid[p.y][p.x]))
          .map((p) => getPartNumber(grid[p.y], p.x))
        all.forEach((n) => (parts[n] = true))
      }
    }
  }

  console.log(
    'Total',
    Object.keys(parts)
      .map(Number)
      .reduce((total, p) => total + p, 0)
  )
}

main()
