import { readFile } from 'fs/promises'

const read = () => readFile('./input.txt', 'utf8')

type Card = {
  id: number
  winners: Set<number>
  numbers: Set<number>
}

const won = (c: Card): Set<number> => {
  const n = new Set([...c.numbers].filter((x) => c.winners.has(x))).size
  return new Set(
    Array(n)
      .fill(0)
      .map((_, i) => c.id + 1 + i)
  )
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
  const cards: Record<number, Card> = {}
  const processed: Record<number, number> = {}
  const all = parse(await read())
  all.forEach((c) => (cards[c.id] = c))

  const queue = [...all]
  let c: Card | undefined = queue.shift()
  while (c) {
    processed[c.id] = processed[c.id] ? processed[c.id] + 1 : 1
    const wonCards = won(c)
    queue.push(...[...wonCards].map((id) => cards[id]))
    c = queue.shift()
  }

  console.log(
    'Total Cards:',
    Object.values(processed).reduce((total, p) => total + p)
  )
}

main()
