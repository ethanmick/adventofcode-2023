import { readFile } from 'fs/promises'

const read = () => readFile('./input.txt', 'utf8')

type Card = {
  id: number
  winners: Set<number>
  numbers: Set<number>
}

const points = (c: Card): number => {
  const intersection = new Set([...c.numbers].filter((x) => c.winners.has(x)))
  return [...intersection].reduce((total) => (total == 0 ? 1 : total * 2), 0)
}

const parse = (input: string): Card[] =>
  input.split(/\r?\n/).map((line) => {
    const [id, rest] = line.split(':')
    const [winners, numbers] = rest.trim().split('|')
    const nums = numbers.trim().split(/\s+/).map(Number)
    if (new Set(nums).size != nums.length) {
      throw new Error('Inconsistency Error: ' + numbers)
    }

    return {
      id: parseInt(id.trim().split(/\s+/)[1].trim()),
      winners: new Set(winners.trim().split(/\s+/).map(Number)),
      numbers: new Set(nums),
    }
  })

const main = async () => {
  const cards = parse(await read())
  console.log(
    'Points:',
    cards.map(points).reduce((total, p) => total + p)
  )
}

main()
