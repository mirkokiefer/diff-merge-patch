
var _ = require('underscore')

var patch = function(collection, diff) {
  var result = _.clone(collection)
  diff.delete.forEach(function(each) {
    result[each] = null
  })
  result = _.without(result, null)
  return result.concat(diff.insert)
}

module.exports = patch