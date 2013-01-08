
var assert = require('assert')
var patch = require('../../lib/patch/index').orderedCollection

describe('ordered-collection patching', function() {
  it('should apply a diff', function() {
    var before = [1, 2, 3, 4]
    var after = [2, 1, 5]
    var diff = {
      delete: [ [ 2, 2 ] ],
      move: [ [ 3, [0, 1] ] ],
      insert: [ [ 3, [5] ] ]
    }
    var result = patch(before, diff)
    assert.deepEqual(result, after)
  })
  it('should apply a diff with inserts at front', function() {
    var before = [1, 2, 3, 4]
    var after = [4, 5, 1, 2, 3]
    var diff = {
      move: [ [ -1, [3, 1] ] ],
      insert: [[-1, [5]]]
    }
    var result = patch(before, diff)
    assert.deepEqual(result, after)
  })
})