import { input } from './input'

const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

const find = (s: string) =>
  s.match(new RegExp(`(\\d|${Object.keys(numbers).join('|')})`, 'gi'))

const totals = input.split(/\r?\n/).map((line) => {
  let nums = ``
  let found = find(line)
  while (found) {
    const n = found[0]
    nums += isNaN(parseInt(n)) ? numbers[n] : n
    line = line.slice(Math.max(n.length - 1, 1))
    found = find(line)
  }
  return Number(`${nums[0]}${nums[nums.length - 1]}`)
})

console.log(totals.reduce((prev, cur) => prev + cur, 0))
