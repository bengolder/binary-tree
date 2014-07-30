# js-btree

[![Build Status](https://travis-ci.org/bengolder/js-btree.svg?branch=master)](https://travis-ci.org/bengolder/js-btree) [![Coverage Status](https://coveralls.io/repos/bengolder/js-btree/badge.png?branch=master)](https://coveralls.io/r/bengolder/js-btree?branch=master)

A Binary Tree object implemented in JavaScript.

This is currently not a public package. I'm using this as a personal project
to learn more about algorithms and JavaScript unit testing. 

If you'd like to use a public npm package containing Binary Trees and Red Black
trees, you can see [someone else's existing project here](https://github.com/vadimg/js_bintrees).

If you're interested, please feel free to fork this or drop me a line.

### Installation

1. Clone the repo.

        git clone git@github.com:bengolder/js-btree

2. Install development dependencies.

        cd js-bintree
        npm install

3. run `gulp`

        gulp # runs tests, creates bundled file

### API

To create a new binary tree, import using `browserify` or node.js `require()`

    var BinaryTree = require('btree.js');
    var tree = new BinaryTree();

### `.insert( item )`

Adds a new item to the tree.

### `.insertMany( items )`

Adds an array of items to the tree.

### `.min()`

Returns the leftmost item in the tree.

### `.max()`

Returns the rightmost item in the tree.

### `.walk()`

Returns an array containing all the items in the tree, in sorted order from
left to right.

### `.find( keyValue )`

Searches the tree for the item with a key matching the input `keyValue`
argument. Returns the item found or `null` if the item is not found.

