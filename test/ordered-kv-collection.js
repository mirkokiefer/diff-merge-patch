
var assert = require('assert')
var diff = require('../lib/ordered-kv-collection')

var origin = [
  {key: 1, value: 1},
  {key: 2, value: 2},
  {key: 3, value: 3},
  {key: 4, value: 4}
]
var modified1 = [
  {key: 5, value: 6},
  {key: 3, value: 8},
  {key: 2, value: 2},
  {key: 4, value: 4},
  {key: 1, value: 5}
]
var modified2 = [
  {key: 2, value: 2},
  {key: 1, value: 9},
  {key: 4, value: 5}
]

var diff1Expected = {
  values: {
    1: ['m', 1, 5],
    2: ['=', 2],
    3: ['m', 3, 8],
    4: ['=', 4],
    5: ['+', 6]
  },
  keys: [["x",1],["x",2],["+",5],["=",3],["p",2],["=",4],["p",1]]
}
var diff2Expected = {
  values: {
    1: ['m', 1, 9],
    2: ['=', 2],
    3: ['-', 3],
    4: ['m', 4, 5]
  },
  keys: [["x",1],["=",2],["-",3],["p",1],["=",4]]
}

describe('key-diff', function() {
  it('should find the diffs including value changes', function() {
    var diff1 = diff(origin, modified1)
    assert.deepEqual(diff1, diff1Expected)

    var diff2 = diff(origin, modified2)
    assert.deepEqual(diff2, diff2Expected)
  })
})

