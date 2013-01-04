
var assert = require('assert')
var patch = require('../lib/index').collection

describe('collection patching', function() {
  it('should apply a diff', function() {
    var before = [1, 2, 3, 3, 4, 8]
    var after = [1,2,4,8,5,6,6]

    var diff = {
      insert: [5, 6, 6],
      delete: [2, 3]
    }
    var result = patch(before, diff)
    assert.deepEqual(result, after)

    var before = [1,2,3,3,4]
    var after = [1,2,3,4,5]
    var diff = { insert: [ 5 ], delete: [ 3 ] }
    var result = patch(before, diff)
    assert.deepEqual(result, after)

    var before = [1,2,3,3,4]
    var after = [1,2,3]
    var diff = { insert: [], delete: [ 3, 4 ] }
    var result = patch(before, diff)
    assert.deepEqual(result, after)
  })
})