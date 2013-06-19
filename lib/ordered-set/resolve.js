
var _ = require('underscore')

var resolve = function(diff, winner) {
  var resolved = []
  diff.diff.forEach(function(each) {
    var updates = []
    each[1].forEach(function(update) {
      if (update.conflict) {
        if (update.source[0] == winner) {
          update = _.clone(update)
          delete update.conflict
          updates.push(update)
        }
      } else {
        updates.push(update)
      }
    })
    if (updates.length) resolved.push([each[0], updates])
  })
  return {diff: resolved}
}

module.exports = resolve