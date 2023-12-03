import { input } from './input'

type Color = 'red' | 'green' | 'blue'

type Pair = [number, Color]

type Pull = Pair[]

type Pulls = Pull[]

type GameInput = {
  id: number
  pulls: Pulls
}

type Game = {
  id: number
  red: number
  green: number
  blue: number
}

function parse(str: string): GameInput[] {
  return str.split(/\r?\n/).map((line: string) => {
    const [game, data] = line.trim().split(':')
    const pulls: Pulls = data
      .trim()
      .split('; ')
      .map((pull: string): Pull => {
        return pull.split(', ').map((cubes: string) => {
          const pair = cubes.trim().split(' ')
          return [parseInt(pair[0]), pair[1] as Color]
        })
      })
    return {
      id: parseInt(game.split(/\s/)[1]),
      pulls,
    }
  })
}

function ofColor(c: Color) {
  return function (pull: Pull): number[] {
    return pull.filter((p) => p[1] === c).map((p) => p[0])
  }
}

const games: Game[] = parse(input).map((gi) => {
  return {
    id: gi.id,
    red: Math.max(...gi.pulls.flatMap(ofColor('red'))),
    green: Math.max(...gi.pulls.flatMap(ofColor('green'))),
    blue: Math.max(...gi.pulls.flatMap(ofColor('blue'))),
  }
})

const powers = games.map((g) => g.blue * g.green * g.red)
const total = powers.reduce((total, p) => total + p, 0)
console.log('Total', total)
