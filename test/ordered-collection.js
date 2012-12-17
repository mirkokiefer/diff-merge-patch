
var assert = require('assert')

var orderedColDiff = require('../lib/index').orderedCollections
var diff = orderedColDiff({unique:true})

describe('ordered collection diff', function() {
  it('should find the position diff', function() {
    var before = [1, 2, 3, 4]
    var after = [2, 1, 5]
    var diffExpected = [
      {cut: 1},
      {equal: 1},
      {delete: 2},
      {paste: [0]},
      {insert: [5]}
    ]
    var diffRes = diff(before, after)
    assert.deepEqual(diffRes, diffExpected)
  })
  it('should find more diffs...', function() {
    var before = [1, 2, 3, 4, 5]
    var after1 = [1, 6, 2, 3, 5, 4]
    var diffExpected1 = [
      {equal: 1},
      {insert: [6]},
      {equal: 2},
      {cut: 1},
      {equal: 1},
      {paste: [3]}
    ]
    var diffRes1 = diff(before, after1)
    assert.deepEqual(diffRes1, diffExpected1)

    var after2 = [1, 2, 3, 4, 7, 5]
    var diffExpected2 = [
      {equal: 4},
      {insert: [7]},
      {equal: 1}
    ]
    var diffRes2 = diff(before, after2)
    assert.deepEqual(diffRes2, diffExpected2)

    var before = [1,2,3]
    var after = [5,4,3]
    var expected = [{delete: 2}, {insert: [5, 4]}, {equal: 1}]
    var diffRes3 = diff(before, after)
    assert.deepEqual(diffRes3, expected)

    var result = diff([1, 2, 3, 4, 5], [1, 2, 3, 4, 7, 5])
    var expected = [{equal: 4}, {insert: [7]}, {equal: 1}]
    assert.deepEqual(result, expected)

    var result = diff([1, 2, 3, 4, 5, 6], [1, 2, 3, 6, 4, 5])
    var expected = [{equal: 3}, {paste: [5]}, {equal: 2}, {cut: 1}]
    assert.deepEqual(result, expected)
  })
})

