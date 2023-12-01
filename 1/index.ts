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

const lines = input.split(/\r?\n/)
const totals = lines.map((line) => {
  let nums = ``
  let found = line.match(
    new RegExp(`(\\d|${Object.keys(numbers).join('|')})`, 'gi')
  )
  while (found) {
    const n = found[0]
    nums += isNaN(parseInt(n)) ? numbers[n] : n
    line = line.slice(Math.max(n.length - 1, 1))
    found = line.match(
      new RegExp(`(\\d|${Object.keys(numbers).join('|')})`, 'gi')
    )
  }

  // const nums = line.matchAll(
  //   new RegExp(`(\\d|${Object.keys(numbers).join('|')})`, 'gi')
  // )
  // const nums = line
  //   .replace(
  //     new RegExp(`${Object.keys(numbers).join('|')}`, 'gi'),
  //     (found) => numbers[found]
  //   )
  //   .replace(/\D/gi, '')
  console.log('Line:', line, nums, Number(`${nums[0]}${nums[nums.length - 1]}`))
  return Number(`${nums[0]}${nums[nums.length - 1]}`)
})

console.log(totals.reduce((prev, cur) => prev + cur, 0))
