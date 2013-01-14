#diff-merge-patch
For sets, ordered lists and dictionaries this library gives you the following functions:

- diff(old, new) - returns you all changes in new since old
- merge(diffs) - merges multiple diffs on the same base object identifying all conflicts
- patch(old, diff) - patches an object using a (merged) diff

##Sets
Sets are represented as JavasScript Arrays:

``` js
var old = [1, 2, 3, 4]
var new1 = [1, 2, 4, 5, 6]
var new2 = [1, 2, 3, 4, 5, 7]
```

###diff
Set diff returns you all inserted and deleted elements:

``` js
var diff = require('diff-patch-merge').set.diff
var result = diff(old, new1)
// returns:
{diff: [{delete: 3}, {insert: 5}, {insert: 6}]}
```

###merge
You can merge multiple diffs that are based on the same old object:

``` js
var merge = require('diff-patch-merge').set.merge

var diff1 = diff(old, new1)
var diff2 = diff(old, new2)

var mergedDiff = merge([diff1, diff2])
// returns:
{
  diff: [
    {delete: 3, source: [0]},
    {insert: 5, source: [0, 1]},
    {insert: 6, source: [0]},
    {insert: 7, source: [1]}
  ]
}
```

merge() combines all diffs into a new diff annotating each change with the source diff.

###patch
You can apply diffs as patches to an old set (results of merge() are diffs too):

``` js
var patch = require('diff-patch-merge').set.patch

var patched = patch(old, mergedDiff)
// returns:
[1, 2, 4, 5, 6, 7]
```

##Ordered Lists

##Dictionaries
