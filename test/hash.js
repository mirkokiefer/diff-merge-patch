
var assert = require('assert')
var diff = require('diffit').hashs
var merge = require('../lib/index').hashs

describe('hash merging', function() {
  it('should do a 3-way merge', function() {
    var before = {
      1: 1,
      2: 2,
      3: 3,
      4: 4
    }

    var after1 = {
      5: 6,
      3: 8,
      2: 2,
      4: 4,
      1: 5
    }

    var after2 = {
      2: 2,
      1: 9,
      4: 5
    }

    var expected = {
      hash: {
        1: [5, 9],
        2: 2,
        3: [8, null],
        4: 5,
        5: 6
      },
      conflicts: [1, 3]
    }
    var result = merge(before, [diff(before, after1), diff(before, after2)])
    assert.deepEqual(result, expected)
  })
})