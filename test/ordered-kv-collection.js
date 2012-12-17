
var assert = require('assert')
var diff = require('../lib/index').orderedKeyValueCollections

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
    update: [{key: 1, value: 5}, {key: 3, value: 8}],
    add: [{key: 5, value: 6}],
    delete: []
  },
  keys: [{cut: 2}, {insert: [5]}, {equal: 1}, {paste: [1]}, {equal: 1}, {paste: [0]}]
}
var diff2Expected = {
  values: {
    update: [{key: 1, value: 9}, {key: 4, value: 5}],
    add: [],
    delete: [3]
  },
  keys: [{cut: 1}, {equal: 1}, {delete: 1}, {paste: [0]}, {equal: 1}]
}

describe('ordered key-value diff', function() {
  it('should find the diffs including value changes', function() {
    var diff1 = diff(origin, modified1)
    assert.deepEqual(diff1, diff1Expected)

    var diff2 = diff(origin, modified2)
    assert.deepEqual(diff2, diff2Expected)
  })
})

