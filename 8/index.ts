import { readFile } from 'fs/promises'

const read = () => readFile('./input.txt', 'utf8')

type MapNode = {
  id: string
  L: string
  R: string
}

type Instruction = 'L' | 'R'

type NodeMap = Record<string, MapNode>

class Ghost {
  public current: string
  public path: Array<string> = []

  public m: number
  public b: number
  public l: number

  constructor(public map: NodeMap, public start: string) {
    this.current = start
  }

  public buildLoop(instructions: Instruction[]) {
    const seen = new Set<string>()
    let path: Array<string> = []

    let current = this.current
    let i = -1
    let key = `${i}.${current}`
    let pre = 0
    path.push(key)
    seen.add(key)
    while (true) {
      i = (i + 1) % instructions.length
      const instruction = instructions[i]
      const next = this.map[current][instruction]
      const n = this.map[next]
      key = `${i}.${n.id}`
      if (seen.has(key)) {
        pre = path.findIndex((s) => s === key)
        path = path.slice(pre)
        break
      }
      path.push(key)
      seen.add(key)
      current = next
    }

    path = path.map((s) => s.split('.')[1])
    const zs = new Set()
    path.forEach((id, i) => {
      if (id.endsWith('Z')) {
        zs.add(i)
      }
    })

    const b = pre
    const m = Number([...zs].pop())
    this.path = path
    this.m = m
    this.b = b
    this.l = path.length

    console.log('Equation', `${this.l}x + ${b + m}`)
  }

  public step(step: Instruction) {
    const next = this.map[this.current][step]
    this.current = this.map[next].id
  }

  public isOnZ() {
    return this.current.endsWith('Z')
  }
}

const parse = async () => {
  const [instructions, _, ...nodes] = (await read()).split(/\r?\n/)

  return {
    instructions: instructions.trim().split('') as Instruction[],
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
  const nodeMap: Record<string, MapNode> = {}
  nodes.forEach((n) => (nodeMap[n.id] = n))

  const ghosts = nodes
    .filter((n) => n.id.endsWith('A'))
    .map((n) => new Ghost(nodeMap, n.id))

  ghosts.forEach((g) => {
    g.buildLoop(instructions)
  })

  let c = 0
  let stop = false
  let steps = 0
  while (!stop) {
    const [og, ...rest] = ghosts
    steps = og.l * c + og.m + og.b
    stop = rest.every((g) => {
      return ((steps - g.b) % g.l) - g.m === 0
    })
    c++
  }

  console.log('Steps', steps)
}

main()
