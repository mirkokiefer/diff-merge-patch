
var assert = require('assert')
var patch = require('../../lib/index').object.patch
var testData = require('./test-data')

describe('object patching', function() {
  it('should apply a diff as a patch', function() {
    testData.forEach(function(each) {
      each.diffs.forEach(function(eachDiff, i) {
        var result = patch(each.before, eachDiff)
        assert.deepEqual(result, each.after[i])
      })
    })
  })
})