'use strict'
const avoidShame = require('./App')
const tap = require('tap')
const { join, resolve } = require('path')
const { readFileSync, writeFileSync, readdirSync, existsSync } = require('fs')

const commentRegex = /console\..+\(([^)]+)\)((;)|($))*/gim

// add arg test
tap.test('Error test', async ({ throws }) => {
  throws(() => avoidShame(), new Error('Please enter a valid path array'))
  throws(() => avoidShame([]), new Error('Please enter a valid path array'))
  throws(() => avoidShame(['./twedwedest/']), new Error('Please enter a valid path array'))
  throws(() => avoidShame(['./twedwedest.js']), new Error('Please enter a valid path array'))
})
tap.test('Output test', ({ equal, end }) => {
  const dirs = readdirSync('./test/tst')
  dirs.push('lol.ts')
  const readbf = dirs.map(cont => {
    const temppth = existsSync(join('./test/', cont)) ? join('./test/', cont) : join('./test/tst', cont)
    return {
      cnt: readFileSync(resolve(temppth), 'utf8'),
      path: resolve(temppth)
    }
  })
  avoidShame(['./test/tst/', './test/lol.ts'])
  readbf.forEach(({ path, cnt }, index) => {
    equal(commentRegex.test(readFileSync(path, 'utf8')), false)
    writeFileSync(path, cnt)
  })

  end()
})
