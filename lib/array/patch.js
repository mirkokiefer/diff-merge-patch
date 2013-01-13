
var _ = require('underscore')

var patch = function(before, diff) {
  if (diff.conflict) throw new Error("resolve conflicts")
  
  var result = before.map(function(each) { return [each] })
  var prefix = []
  var insertValue = function(value, index) {
    index == -1 ? prefix.push(value) : result[index].push(value)
  }

  diff.diff.forEach(function(each) {
    var newIndex = each[0], updates = each[1]
    updates.forEach(function(update) {
      if (newIndex == null) {
        result[update.move][0] = null
      } else if (update.insert != undefined) {
        insertValue(update.insert, newIndex)
      } else if (update.move != undefined) {
        insertValue(before[update.move], newIndex)
        result[update.move][0] = null
      }
    })
  })
  return prefix.concat(_.without(_.flatten(result), null))
}

module.exports = patch