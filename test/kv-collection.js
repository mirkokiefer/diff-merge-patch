
var assert = require('assert')
var diff = require('../lib/index').keyValueCollections

var before = [
  {key: 1, value: 1},
  {key: 2, value: 2},
  {key: 3, value: 3},
  {key: 4, value: 4}
]

var after1 = [
  {key: 5, value: 6},
  {key: 3, value: 8},
  {key: 2, value: 2},
  {key: 4, value: 4},
  {key: 1, value: 5}
]
var after2 = [
  {key: 2, value: 2},
  {key: 1, value: 9},
  {key: 4, value: 5}
]

var expectedDiff1 = {
  added: [{key: 5, value: 6}],
  modified: [{key: 1, value: 5}, {key: 3, value: 8}],
  deleted: []
}
var expectedDiff2 = {
  added: [],
  modified: [{key: 1, value: 9}, {key: 4, value: 5}],
  deleted: [3]
}

describe('key-value collection diff', function() {
  it('should find all added/deleted keys + value changes', function() {
    var result1 = diff(before, after1)
    assert.deepEqual(result1, expectedDiff1)

    var result2 = diff(before, after2)
    assert.deepEqual(result2, expectedDiff2)
  })
})
