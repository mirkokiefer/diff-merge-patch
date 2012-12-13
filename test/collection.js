
var assert = require('assert')
var diff = require('../lib/collection')

describe('collection diff', function() {
  it('should find all added and deleted values', function() {
    var before = [1,2,3,3,4]
    var after = [4,1,2,5]

    var expectedDiff = {
      deleted: [3, 3],
      added: [5]
    }
    var result = diff(before, after)
    assert.deepEqual(result, expectedDiff)
  })
})