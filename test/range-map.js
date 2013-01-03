
var assert = require('assert')
var merge = require('../lib/range-map')

describe('range-map merging', function() {
  it ('should merge without conflicts', function() {
    var map1 = [
      {range: [1, 3], value: 1},
      {range: [4, 5], value: 2}
    ]
    var map2 = [
      {range: [2, 3], value: 1},
      {range: [6, 7], value: 3}
    ]
    var expected = {result: [
      {range: [1, 3], value: 1},
      {range: [4, 5], value: 2},
      {range: [6, 7], value: 3}
    ]}
    var result = merge([map1, map2])
    console.log(result.result)
    assert.deepEqual(result, expected)
  })
})