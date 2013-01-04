
var _ = require('underscore')

var patch = function(hash, diff) {
  var result = _.clone(hash)
  result = _.extend(result, diff.insert)
  result = _.extend(result, diff.update)
  diff.delete.forEach(function(each) {
    delete result[each]
  })
  return result
}

module.exports = patch