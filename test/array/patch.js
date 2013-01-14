
var assert = require('assert')
var patch = require('../../lib/index').array.patch

var testData = require('./test-data')

describe('array patching', function() {
  testData.forEach(function(each, i) {
    each.diffs.forEach(function(diff, j) {
      it('should patch an array using a diff at ' + i + '.' + j, function() {
        var result = patch(each.before, diff)
        assert.deepEqual(result, each.after[j])
      })
    })
  })
})