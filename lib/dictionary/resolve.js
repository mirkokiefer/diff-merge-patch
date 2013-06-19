
var _ = require('underscore')

var resolve = function(diff, winner) {
  if (!diff.conflict) return diff

  var result = _.clone(diff.diff)
  diff.conflict.forEach(function(each) {
    result[each] = result[each][winner]
  })

  return {diff: result}
}

module.exports = resolve