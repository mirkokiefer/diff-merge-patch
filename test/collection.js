
var assert = require('assert')
var diff = require('../lib/index').collections

describe('collection diff', function() {
  it('should find all added and deleted values', function() {
    var before = [1, 2, 3, 3, 4, 8]
    var after = [4, 1, 2, 5, 6, 6, 8]

    var expectedDiff = {
      added: [5, 6, 6],
      deleted: [3, 3]
    }
    var result = diff(before, after)
    assert.deepEqual(result, expectedDiff)

    var before = [1,2,3,3,4]
    var after = [4,1,2,3,5]
    var expected = { added: [ 5 ], deleted: [ 3 ] }
    var result = diff(before, after)
    assert.deepEqual(result, expected)

    var before = [1,2,3,3,4]
    var after = [1,2,3]
    var expected = { added: [], deleted: [ 3, 4 ] }
    var result = diff(before, after)
    assert.deepEqual(result, expected)
  })
})