
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
    assert.deepEqual(result, expected)
  })
  it ('should merge with conflicts', function() {
    var map1 = [
      {range: [1, 3], value: 1},
      {range: [6, 8], value: 2}
    ]
    var map2 = [
      {range: [2, 4], value: 5},
      {range: [6, 7], value: 3}
    ]
    var expected = {
      conflict: true,
      result: [[
          {range: [1, 3], value: 1},
          {range: [4, 4], value: 5},
          {range: [6, 8], value: 2},
        ], [
          {range: [1, 1], value: 1},
          {range: [2, 4], value: 5},
          {range: [6, 7], value: 3},
          {range: [8, 8], value: 2}
        ]]
      }
    var result = merge([map1, map2])
    assert.deepEqual(result, expected)
  })
})