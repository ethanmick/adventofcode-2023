import { readFile } from 'fs/promises'

const read = () => readFile('./input.txt', 'utf8')

type Node = {
  id: string
  L: string
  R: string
}

const parse = async () => {
  const [instructions, _, ...nodes] = (await read()).split(/\r?\n/)

  return {
    instructions: instructions.trim().split(''),
    nodes: nodes.map((line) => {
      const [id, _eq, left, right] = line.split(/\s+/)
      return {
        id: id,
        L: left.substring(1, 4),
        R: right.substring(0, 3),
      }
    }),
  }
}

const main = async () => {
  const { instructions, nodes } = await parse()
  const nodeMap: Record<string, Node> = {}
  nodes.forEach((n) => (nodeMap[n.id] = n))

  let count = 0
  let i = 0
  let current = 'AAA'
  while (current != 'ZZZ') {
    const instruction = instructions[i]
    const next = nodeMap[current][instruction]
    current = nodeMap[next].id
    i = (i + 1) % instructions.length
    count++
  }
  console.log('Count', count)
}

main()
