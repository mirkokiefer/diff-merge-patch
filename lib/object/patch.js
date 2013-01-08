
var _ = require('underscore')

var patch = function(object, diff) {
  if (diff.conflict) throw new Error("resolve conflicts")
  var result = _.clone(object)
  _.each(diff.diff, function(value, key) {
    if (value === null) {
      delete result[key]
    } else {
      result[key] = value
    }
  })
  return result
}

module.exports = patch