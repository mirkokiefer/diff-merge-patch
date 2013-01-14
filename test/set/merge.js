
var assert = require('assert')
var merge = require('../../lib/index').set.merge
var testData = require('./test-data')

describe('collection merging', function() {
  it('should do a 3-way merge', function() {
    testData.forEach(function(each) {
      var result = merge(each.diffs)
      assert.deepEqual(result, each.diffsMerged)
    })
  })
})