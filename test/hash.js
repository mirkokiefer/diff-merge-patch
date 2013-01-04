
var assert = require('assert')
var patch = require('../lib/index').hash

describe('hash patching', function() {
  it('should apply a diff as a patch', function() {
    var before = {
      1: 1,
      2: 2,
      3: 3,
      4: 4
    }

    var diff1 = {
      insert: {5: 6},
      update: {1: 5, 3: 8},
      delete: []
    }

    var expected1 = {
      5: 6,
      3: 8,
      2: 2,
      4: 4,
      1: 5
    }

    var result = patch(before, diff1)
    assert.deepEqual(result, expected1)

    var diff2 = {
      insert: {},
      update: {1: 9, 4: 5},
      delete: [3]
    }

    var expected2 = {
      2: 2,
      1: 9,
      4: 5
    }

    var result = patch(before, diff2)
    assert.deepEqual(result, expected2)
  })
})