
var assert = require('assert')
var diff = require('diffit').hashs
var merge = require('../../lib/merge/index').hashs
var Result = merge.Result

describe('hash merging', function() {
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

  it('should do a 3-way merge', function() {

    var expected = {
      diff: {
        1: [5, 9],
        3: [8, null],
        4: 5,
        5: 6
      },
      conflict: [1, 3]
    }
    var result = merge([diff(before, after1), diff(before, after2)])
    assert.deepEqual(result, expected)
  })
  it('should test an n-way merge', function() {
    var after3 = {
      1: 1,
      2: 3,
      4: 6,
      7: 9
    }
    var expected = {
      diff: {
        1: [5, 9],
        2: 3,
        3: [8, null, null],
        4: [5, 6],
        5: 6,
        7: 9
      },
      conflict: [1, 3, 4]
    }
    var diffs = [after1, after2, after3].map(function(each) { return diff(before, each) })
    var result = merge(diffs)
    assert.deepEqual(result, expected)
  })
  it('should test commutative conflict resolution', function() {
    var result1 = new Result({
      diff: {
        1: [5, 9],
        2: 3,
        3: [null, 8, null],
        4: [6, 5],
        5: 6,
        7: null
      },
      conflict: [1, 3, 4]
    })
    var result2 = new Result({
      diff: {
        1: [5, 9],
        2: 3,
        3: [8, null, null],
        4: [5, 6],
        5: 6,
        7: null
      },
      conflict: [1, 3, 4]
    })
    var expected = {
      diff: {
        1: 5,
        2: 3,
        3: 8,
        4: 5,
        5: 6,
        7: null
      }
    }
    var resolvedResult1 = result1.resolveConflicts()
    var resolvedResult2 = result2.resolveConflicts()
    assert.deepEqual(resolvedResult1, expected)
    assert.deepEqual(resolvedResult1, resolvedResult2)
  })
})
