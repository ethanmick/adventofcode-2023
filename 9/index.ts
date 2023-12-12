import { readFile } from 'fs/promises'

const read = () => readFile('./input.txt', 'utf8')

const parse = async (): Promise<Array<number[]>> => {
  return (await read())
    .split(/\r?\n/)
    .map((line) => line.split(/\s+/).map(Number))
}

const next = (arr: number[]): number[] => {
  if (arr.every((n) => n === 0)) {
    return arr
  }

  const [_, ...calc] = arr
  const diffs = calc.map((n, i) => n - arr[i])
  const last = next(diffs).pop() as number
  return [...arr, arr[arr.length - 1] + last]
}

const main = async () => {
  const inputs = await parse()
  const updated = inputs.map(next)
  const total = updated
    .map((u) => u[u.length - 1])
    .reduce((total, n) => total + n, 0)
  console.log('Total', total)
}

main()
