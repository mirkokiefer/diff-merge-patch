
var assert = require('assert')
var diff = require('diffit').collections
var merge = require('../lib/index').collections

describe('collection merging', function() {
  it('should do a 3-way merge', function() {
    var before = [1,2,3,3,4]
    var after1 = [4,1,2,5]
    var after2 = [1,2,3]

    var expected = [1, 2, 5]
    var result = merge(before, [diff(before, after1), diff(before, after2)])
    assert.deepEqual(result, expected)

    var before = [1,2,3,3,4]
    var after1 = [4,1,2,3,5]
    var after2 = [1,2,3]

    var expected = [1, 2, 3, 5]
    var result = merge(before, [diff(before, after1), diff(before, after2)])
    assert.deepEqual(result, expected)
  })
})