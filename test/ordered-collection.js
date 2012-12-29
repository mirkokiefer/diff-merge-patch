
var assert = require('assert')

var orderedColDiff = require('../lib/index').orderedCollections
var invert = orderedColDiff.invert
var types = orderedColDiff.types
var diff = orderedColDiff({unique:true})

describe('ordered collection diff', function() {
  it('should find the position diff', function() {
    var before = [1, 2, 3, 4]
    var after = [2, 1, 5]
    var expected = {
      cut: [ [ 0, 1 ] ],
      equal: [ [ 1, 1 ] ],
      delete: [ [ 2, 2 ] ],
      paste: [ [ 3, [0] ] ],
      insert: [ [ 3, [5] ] ]
    }
    var result = diff(before, after)
    assert.deepEqual(result, expected)
  })
  it('should find more diffs...', function() {
    var before = [1, 2, 3, 4, 5]
    var after1 = [1, 6, 2, 3, 5, 4]
    var expected = {
      equal: [[0,1],[1,2],[4,1]],
      insert: [[0,[6]]],
      cut: [[3,1]],
      paste: [[4,[3]]]
    }
    var result = diff(before, after1)
    assert.deepEqual(result, expected)

    var after2 = [1, 2, 3, 4, 7, 5]
    var result = diff(before, after2)
    var expected = {
      equal: [ [ 0, 4 ], [ 4, 1 ] ],
      insert: [ [ 3, [7] ] ]
    }
    assert.deepEqual(result, expected)

    var before = [1,2,3]
    var after = [5,4,3]
    var expected = {
      delete: [ [ 0, 2 ] ],
      insert: [ [ 1, [5, 4] ] ],
      equal: [ [ 2, 1 ] ]
    }
    var result = diff(before, after)
    assert.deepEqual(result, expected)

    var expected = {
      equal: [ [ 0, 4 ], [ 4, 1 ] ],
      insert: [ [ 3, [7] ] ]
    }
    var result = diff([1, 2, 3, 4, 5], [1, 2, 3, 4, 7, 5])
    assert.deepEqual(result, expected)

    var expected = {
      equal: [ [ 0, 3 ], [ 3, 2 ] ],
      paste: [ [ 2, [5] ] ],
      cut: [ [ 5, 1 ] ]
    }
    var result = diff([1, 2, 3, 4, 5, 6], [1, 2, 3, 6, 4, 5])
    assert.deepEqual(result, expected)

    var result = diff([1, 2, 3, 4, 5, 6], [4, 5, 6, 1, 2, 3])
    var expected = {
      equal: [ [ 3, 3 ] ],
      cut: [ [ 0, 3 ] ],
      paste: [ [ 5, [0, 1, 2] ] ]
    }
    assert.deepEqual(result, expected)
  })
})

