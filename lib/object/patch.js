
var _ = require('underscore')

var patch = function(object, diff) {
  if (diff.conflict) throw new Error("resolve conflicts")
  var result = _.clone(object)
  _.each(diff.diff, function(entry, key) {
    if (entry.value === null) {
      delete result[key]
    } else {
      result[key] = entry.value
    }
  })
  return result
}

module.exports = patch