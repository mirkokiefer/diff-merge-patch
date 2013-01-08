
var assert = require('assert')
var patch = require('../../lib/index').collection.patch
var testData = require('./test-data')

describe('collection patching', function() {
  it('should apply a diff', function() {
    testData.forEach(function(each) {
      each.diffs.forEach(function(diff, i) {
        var result = patch(each.before, diff)
        assert.deepEqual(result, each.after[i])
      })
    })
  })
})