
var assert = require('assert')
var merge = require('../../lib/index').rangeMap.merge

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
      result: [
        [
          {range: [1, 3], value: 1},
          {range: [4, 4], value: 5},
          {range: [6, 8], value: 2},
        ], [
          {range: [1, 1], value: 1},
          {range: [2, 4], value: 5},
          {range: [6, 7], value: 3},
          {range: [8, 8], value: 2}
        ]
      ]
      /* this compressed form doesnt work if we have multiple equal changes with different order
      result: [
        {range: [1, 1], value: 1},
        {range: [2, 3], value: [1, 5}, conflict: true},
        {range: [4, 4], value: 5},
        {range: [6, 7], value: [2, 3], conflict: true},
        {range: [8, 8], value: 2},
      ]*/
    }
    var result = merge([map1, map2])
    assert.deepEqual(result, expected)
  })
  it ('should merge preserving relative order', function() {
    var map1 = [
      { range: [ 0, 0 ], value: 3 },
      { range: [ 3, 3 ], value: 4 },
      { range: [ 2, 2 ], value: 4 }
    ]
    var map2 = [
      { range: [ 0, 0 ], value: 3 },
      { range: [ 2, 2 ], value: 3 }
    ]
    var expected = {
      conflict: true,
      result: [[
          { range: [ 0, 0 ], value: 3 },
          { range: [ 3, 3 ], value: 4 },
          { range: [ 2, 2 ], value: 4 }
        ], [
          { range: [ 0, 0 ], value: 3 },
          { range: [ 2, 2 ], value: 3 },
          { range: [ 3, 3 ], value: 4 }
      ]]
    }
    var result = merge([map1, map2])
    assert.deepEqual(result, expected)
  })
  it ('should merge with three range-maps', function() {
    var map1 = [
      {range: [1, 3], value: 1},
      {range: [6, 8], value: 2}
    ]
    var map2 = [
      {range: [2, 4], value: 5},
      {range: [6, 7], value: 3}
    ]
    var map3 = [
      {range: [2, 2], value: 8},
      {range: [9, 10], value: 3}
    ]
    var expected = {
      conflict: true,
      result: [
        [
          {range: [1, 3], value: 1},
          {range: [4, 4], value: 5},
          {range: [6, 8], value: 2},
          {range: [9, 10], value: 3},
        ], [
          {range: [1, 1], value: 1},
          {range: [2, 4], value: 5},
          {range: [6, 7], value: 3},
          {range: [8, 8], value: 2},
          {range: [9, 10], value: 3}
        ], [
          {range: [1, 1], value: 1},
          {range: [2, 2], value: 8},
          {range: [4, 4], value: 5},
          {range: [8, 8], value: 2},
          {range: [9, 10], value: 3}
        ]
      ]
    }
    var result = merge([map1, map2, map3])
    assert.deepEqual(result, expected)
  })
})