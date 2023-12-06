import { readFile } from 'fs/promises'

const read = () => readFile('./input.txt', 'utf8')

type Record = {
  time: number
  distance: number
}

const parse = async (): Promise<Record[]> => {
  const [time, distance] = (await read()).split(/\r?\n/)
  const times = time.split(':')[1].trim().split(/\s+/).map(Number)
  const distances = distance.split(':')[1].trim().split(/\s+/).map(Number)
  return [
    {
      time: Number(times.join('')),
      distance: Number(distances.join('')),
    },
  ]
}

const main = async () => {
  const options: number[] = (await parse()).map(
    (r) =>
      Array(r.time)
        .fill(0)
        .map((_, i) => i * (r.time - i))
        .filter((d) => d > r.distance).length
  )

  console.log(
    'Options',
    options.reduce((t, n) => t * n, 1)
  )
}

main()
