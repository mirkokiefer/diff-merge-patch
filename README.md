#diff-merge-patch
For sets, ordered lists and dictionaries this library gives you the following functions:

- diff(before, after) - returns you all changes in new since old
- merge(diffs) - merges multiple diffs on the same base object identifying all conflicts
- patch(old, diff) - patches an object using a (merged) diff

##Sets
Sets are represented as JavasScript Arrays:

``` js
var before = [1, 2, 3, 4]
var after1 = [1, 2, 4, 5, 6]
var after2 = [1, 2, 3, 4, 5, 7]
```

###diff
Set diff returns you all inserted and deleted elements:

``` js
var diff = require('diff-patch-merge').set.diff

var diff1 = diff(before, after1)
// returns:
{diff: [{delete: 3}, {insert: 5}, {insert: 6}]}

var diff2 = diff(before, after2)
// returns:
{diff: [{insert: 5}, {insert: 7}]}

```

###merge
You can merge multiple diffs that are based on the same old object.
It combines all diffs into a new diff annotating each change with the source diff:


``` js
var merge = require('diff-patch-merge').set.merge

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

###patch
You can apply diffs as patches to an old set (results of merge() are diffs too):

``` js
var patch = require('diff-patch-merge').set.patch

var patched = patch(old, mergedDiff)
// returns:
[1, 2, 4, 5, 6, 7]
```

##Ordered Lists
Ordered lists are represented as JavaScript Arrays as well. As opposed to sets diff/merge/patch for ordered lists considers the order of elements.

##Ordered Sets
Ordered Sets are similar to Ordered Lists except that all elements are globally unique.
This allows diff/merge/patch to consider position changes of elements. In ordered lists position changes can not be recognized and are only seen as a delete and insert of the same element.

Ordered Sets are represented as JavaScript arrays:

``` js
var before = [1, 2, 3, 4, 5],
var after1 = [2, 6, 1, 5, 4, 3]
var after2 = [2, 4, 1, 7, 3, 5]
```

###diff

``` js
var diff = require('diff-merge-patch').orderedSet.diff

var diff1 = diff(before, after1)
// returns:
{
  diff: [
    [3, [{insert: 6}, {move: 0}]],
    [4, [{move: 3}, {move: 2}]]
  ]
}

var diff2 = diff(before, after2)
// returns:
{
  diff: [
    [3, [{move: 0}, {insert: 7}, {move: 2}]]
  ]
}
```

###merge
Merging of Ordered List diffs can lead to conflicts:

``` js
var merge = require('diff-merge-patch').orderedSet.merge

var mergedDiff = merge([diff1, diff2])
// returns:
{
  diff: [
    [3, [{insert: 6, source: [0]}, {move: 0, source: [0, 1]}, {insert: 7, source: [1]}, {move: 2, conflict: 1, source: [1]}]],
    [4, [{move: 3, source: [0]}, {move: 2, conflict: 1, source: [0]}]]
  ],
  conflict: 1
}
```

Each corresponding conflict receives the same conflict-ID.
To use a diff including conflicts to patch the old ordered set you first have to resolve them.
The library comes with a simple conflict resolution strategy which you can invoke like this:

``` js
var resolvedDiff = mergedDiff.resolveConflicts()
// returns:
{
  diff: [
    [3, [{insert: 6, source: [0]}, {move: 0, source: [0, 1]}, {insert: 7, source: [1]}]],
    [4, [{move: 3, source: [0]}, {move: 2, source: [0]}]]
  ]
}
```
The algorithm simply picks the conflicting update that comes from the first diff (source: [0]).
Depending on your application you may want to implement different resolution strategies.

###patch
Diffs can be used to patch the original ordered list:

``` js
var patch = require('diff-merge-patch').orderedSet.patch

var patched = patch(before, resolvedDiff)
// returns:
[2, 6, 1, 7, 5, 4, 3]
```

##Dictionaries
