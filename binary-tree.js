(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BinaryNode = require('./binary_node.js');

var compareBasic = function( a, b ){
	// this is a basic comparison function that mimics numeric comparison (a - b)
	// if a is bigger than b, it returns true (1)
	// if a is equal to b, it also returns true (1)
	// if a is less than b, it returns false (0)
	return a >= b;
}

function BinaryTree( data, comparatorFunction, key ){
	this.root = null;

	// the accessor function receives the data and returns the value to be used
	// as a sorting key.
	if( key == undefined ){
		this._get = function(n){ return n.data; };
	} else {
		this._get = function(n){
			return key(n.data);
		}
	}

	comparatorFunction = comparatorFunction || compareBasic;
	this._compare = function( n, m ){
		// there should only be two possible directions.
		// to go left we want less than, for right greater than / equal to
		var result = comparatorFunction( this._get(n), this._get(m) );
		// comparatorFunctions can return either numbers or truthy / falsey
		// they are fed in their data (default) or whatever is returned 
		// by the key
		if( !result || result < 0 ){
			return true; // go left
		} else {
			return false; // go right
		}
	};

	if( data ){
		this.insertMany( data );
	}
};

BinaryTree.prototype = {

	_dataOrNull: function( node ){
		if( node ){ 
			return node.data;
		} else { 
			return null; 
		}
	},

	_min: function( node ){
		while( node.left !== null ){
			node = node.left;
		}
		return node;
	},
	min: function(){
		return this._dataOrNull( this._min(this.root) );
	},

	_max: function( node ){
		while( node.right !== null ){
			node = node.right;
		}
		return node;
	},
	max: function(){
		return this._dataOrNull( this._max(this.root) );
	},

	removeKey: function( keyValue ){
		// remove an item from the tree
		var node = this._find( keyValue );
		// this function doesn't care if the value doesn't exist
		// similar to the behavior of Javascript's `delete` operator
		if( node ){
			this._delete( this._find( keyValue ) );
		}
	},

	_delete: function( node ){
		if( node.left == null ){
			this._transplant( node, node.right );
		} else if( node.right == null ){
			this._transplant( node, node.left );
		} else {
			var successor = this._min( node.right );
			if( successor.parent !== node ){
				this._transplant( successor, successor.right );
				successor.right = node.right;
				successor.right.parent = successor;
			}
			this._transplant( node, successor );
			successor.left = node.left;
			successor.left.parent = successor;
		}
	},

	_transplant: function( outgoing, incoming ){
		// switch out one node for another.
		if( outgoing.parent == null ){
			this.root = incoming;
		} else if( outgoing == outgoing.parent.left ){
			outgoing.parent.left = incoming;
		} else {
			outgoing.parent.right = incoming;
		}
		if( incoming !== null ){
			incoming.parent = outgoing.parent;
		}
	},

	_walk: function( node ){
		if( node ){
			this._walk( node.left );
			this._nodelist.push( node.data );
			this._walk( node.right );
		}
	},

	walk: function(){
		if( !this.root ){
			return [];
		}
		this._nodelist = [];
		this._walk(this.root);
		var nodes = this._nodelist;
		delete this._nodelist;
		return nodes;
	},

	insert: function( item ){
		var node,
		    parent = null,
		    cursor = this.root;
		node = new BinaryNode( this, item );

		while( cursor !== null ){
			parent = cursor;
			if( this._compare(node, parent) ){
				cursor = cursor.left;
			} else {
				cursor = cursor.right;
			}
		}
		node.parent = parent;
		if( parent == null ){
			this.root = node;
		} else if( this._compare(node, parent) ){
			parent.left = node;
		} else {
			parent.right = node;
		}
		return this;
	},

	insertMany: function( items ){
		var me = this;
		items.forEach(function(item){
			me.insert(item);
		});
		return this;
	},

	_find: function( key ){
		var node = this.root;
		while( node !== null && key !== this._get(node) ){
			if( key < this._get(node) ){
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return node;
	},
	findKey: function( keyValue ){
		return this._dataOrNull( this._find( keyValue ) );
	}
};

module.exports = BinaryTree;

},{"./binary_node.js":2}],2:[function(require,module,exports){
function BinaryNode( tree, data ){
	this.tree = tree;
	this.data = data;
	this.parent = null;
	this.left = null;
	this.right = null;
};

BinaryNode.prototype.toString = function nodeToString(){
	return "BinaryTreeNode(key: " + this.tree._get(this) + ", data: " + this.data.toString() + ")";
};

module.exports = BinaryNode;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9iZ29sZGVyL3Byb2plY3RzL2pzZ2lzL2J0cmVlL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9iaW5hcnlfdHJlZS5qcyIsIi9Vc2Vycy9iZ29sZGVyL3Byb2plY3RzL2pzZ2lzL2J0cmVlL3NyYy9iaW5hcnlfbm9kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEJpbmFyeU5vZGUgPSByZXF1aXJlKCcuL2JpbmFyeV9ub2RlLmpzJyk7XG5cbnZhciBjb21wYXJlQmFzaWMgPSBmdW5jdGlvbiggYSwgYiApe1xuXHQvLyB0aGlzIGlzIGEgYmFzaWMgY29tcGFyaXNvbiBmdW5jdGlvbiB0aGF0IG1pbWljcyBudW1lcmljIGNvbXBhcmlzb24gKGEgLSBiKVxuXHQvLyBpZiBhIGlzIGJpZ2dlciB0aGFuIGIsIGl0IHJldHVybnMgdHJ1ZSAoMSlcblx0Ly8gaWYgYSBpcyBlcXVhbCB0byBiLCBpdCBhbHNvIHJldHVybnMgdHJ1ZSAoMSlcblx0Ly8gaWYgYSBpcyBsZXNzIHRoYW4gYiwgaXQgcmV0dXJucyBmYWxzZSAoMClcblx0cmV0dXJuIGEgPj0gYjtcbn1cblxuZnVuY3Rpb24gQmluYXJ5VHJlZSggZGF0YSwgY29tcGFyYXRvckZ1bmN0aW9uLCBrZXkgKXtcblx0dGhpcy5yb290ID0gbnVsbDtcblxuXHQvLyB0aGUgYWNjZXNzb3IgZnVuY3Rpb24gcmVjZWl2ZXMgdGhlIGRhdGEgYW5kIHJldHVybnMgdGhlIHZhbHVlIHRvIGJlIHVzZWRcblx0Ly8gYXMgYSBzb3J0aW5nIGtleS5cblx0aWYoIGtleSA9PSB1bmRlZmluZWQgKXtcblx0XHR0aGlzLl9nZXQgPSBmdW5jdGlvbihuKXsgcmV0dXJuIG4uZGF0YTsgfTtcblx0fSBlbHNlIHtcblx0XHR0aGlzLl9nZXQgPSBmdW5jdGlvbihuKXtcblx0XHRcdHJldHVybiBrZXkobi5kYXRhKTtcblx0XHR9XG5cdH1cblxuXHRjb21wYXJhdG9yRnVuY3Rpb24gPSBjb21wYXJhdG9yRnVuY3Rpb24gfHwgY29tcGFyZUJhc2ljO1xuXHR0aGlzLl9jb21wYXJlID0gZnVuY3Rpb24oIG4sIG0gKXtcblx0XHQvLyB0aGVyZSBzaG91bGQgb25seSBiZSB0d28gcG9zc2libGUgZGlyZWN0aW9ucy5cblx0XHQvLyB0byBnbyBsZWZ0IHdlIHdhbnQgbGVzcyB0aGFuLCBmb3IgcmlnaHQgZ3JlYXRlciB0aGFuIC8gZXF1YWwgdG9cblx0XHR2YXIgcmVzdWx0ID0gY29tcGFyYXRvckZ1bmN0aW9uKCB0aGlzLl9nZXQobiksIHRoaXMuX2dldChtKSApO1xuXHRcdC8vIGNvbXBhcmF0b3JGdW5jdGlvbnMgY2FuIHJldHVybiBlaXRoZXIgbnVtYmVycyBvciB0cnV0aHkgLyBmYWxzZXlcblx0XHQvLyB0aGV5IGFyZSBmZWQgaW4gdGhlaXIgZGF0YSAoZGVmYXVsdCkgb3Igd2hhdGV2ZXIgaXMgcmV0dXJuZWQgXG5cdFx0Ly8gYnkgdGhlIGtleVxuXHRcdGlmKCAhcmVzdWx0IHx8IHJlc3VsdCA8IDAgKXtcblx0XHRcdHJldHVybiB0cnVlOyAvLyBnbyBsZWZ0XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxzZTsgLy8gZ28gcmlnaHRcblx0XHR9XG5cdH07XG5cblx0aWYoIGRhdGEgKXtcblx0XHR0aGlzLmluc2VydE1hbnkoIGRhdGEgKTtcblx0fVxufTtcblxuQmluYXJ5VHJlZS5wcm90b3R5cGUgPSB7XG5cblx0X2RhdGFPck51bGw6IGZ1bmN0aW9uKCBub2RlICl7XG5cdFx0aWYoIG5vZGUgKXsgXG5cdFx0XHRyZXR1cm4gbm9kZS5kYXRhO1xuXHRcdH0gZWxzZSB7IFxuXHRcdFx0cmV0dXJuIG51bGw7IFxuXHRcdH1cblx0fSxcblxuXHRfbWluOiBmdW5jdGlvbiggbm9kZSApe1xuXHRcdHdoaWxlKCBub2RlLmxlZnQgIT09IG51bGwgKXtcblx0XHRcdG5vZGUgPSBub2RlLmxlZnQ7XG5cdFx0fVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRtaW46IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGFPck51bGwoIHRoaXMuX21pbih0aGlzLnJvb3QpICk7XG5cdH0sXG5cblx0X21heDogZnVuY3Rpb24oIG5vZGUgKXtcblx0XHR3aGlsZSggbm9kZS5yaWdodCAhPT0gbnVsbCApe1xuXHRcdFx0bm9kZSA9IG5vZGUucmlnaHQ7XG5cdFx0fVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRtYXg6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGFPck51bGwoIHRoaXMuX21heCh0aGlzLnJvb3QpICk7XG5cdH0sXG5cblx0cmVtb3ZlS2V5OiBmdW5jdGlvbigga2V5VmFsdWUgKXtcblx0XHQvLyByZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSB0cmVlXG5cdFx0dmFyIG5vZGUgPSB0aGlzLl9maW5kKCBrZXlWYWx1ZSApO1xuXHRcdC8vIHRoaXMgZnVuY3Rpb24gZG9lc24ndCBjYXJlIGlmIHRoZSB2YWx1ZSBkb2Vzbid0IGV4aXN0XG5cdFx0Ly8gc2ltaWxhciB0byB0aGUgYmVoYXZpb3Igb2YgSmF2YXNjcmlwdCdzIGBkZWxldGVgIG9wZXJhdG9yXG5cdFx0aWYoIG5vZGUgKXtcblx0XHRcdHRoaXMuX2RlbGV0ZSggdGhpcy5fZmluZCgga2V5VmFsdWUgKSApO1xuXHRcdH1cblx0fSxcblxuXHRfZGVsZXRlOiBmdW5jdGlvbiggbm9kZSApe1xuXHRcdGlmKCBub2RlLmxlZnQgPT0gbnVsbCApe1xuXHRcdFx0dGhpcy5fdHJhbnNwbGFudCggbm9kZSwgbm9kZS5yaWdodCApO1xuXHRcdH0gZWxzZSBpZiggbm9kZS5yaWdodCA9PSBudWxsICl7XG5cdFx0XHR0aGlzLl90cmFuc3BsYW50KCBub2RlLCBub2RlLmxlZnQgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHN1Y2Nlc3NvciA9IHRoaXMuX21pbiggbm9kZS5yaWdodCApO1xuXHRcdFx0aWYoIHN1Y2Nlc3Nvci5wYXJlbnQgIT09IG5vZGUgKXtcblx0XHRcdFx0dGhpcy5fdHJhbnNwbGFudCggc3VjY2Vzc29yLCBzdWNjZXNzb3IucmlnaHQgKTtcblx0XHRcdFx0c3VjY2Vzc29yLnJpZ2h0ID0gbm9kZS5yaWdodDtcblx0XHRcdFx0c3VjY2Vzc29yLnJpZ2h0LnBhcmVudCA9IHN1Y2Nlc3Nvcjtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3RyYW5zcGxhbnQoIG5vZGUsIHN1Y2Nlc3NvciApO1xuXHRcdFx0c3VjY2Vzc29yLmxlZnQgPSBub2RlLmxlZnQ7XG5cdFx0XHRzdWNjZXNzb3IubGVmdC5wYXJlbnQgPSBzdWNjZXNzb3I7XG5cdFx0fVxuXHR9LFxuXG5cdF90cmFuc3BsYW50OiBmdW5jdGlvbiggb3V0Z29pbmcsIGluY29taW5nICl7XG5cdFx0Ly8gc3dpdGNoIG91dCBvbmUgbm9kZSBmb3IgYW5vdGhlci5cblx0XHRpZiggb3V0Z29pbmcucGFyZW50ID09IG51bGwgKXtcblx0XHRcdHRoaXMucm9vdCA9IGluY29taW5nO1xuXHRcdH0gZWxzZSBpZiggb3V0Z29pbmcgPT0gb3V0Z29pbmcucGFyZW50LmxlZnQgKXtcblx0XHRcdG91dGdvaW5nLnBhcmVudC5sZWZ0ID0gaW5jb21pbmc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG91dGdvaW5nLnBhcmVudC5yaWdodCA9IGluY29taW5nO1xuXHRcdH1cblx0XHRpZiggaW5jb21pbmcgIT09IG51bGwgKXtcblx0XHRcdGluY29taW5nLnBhcmVudCA9IG91dGdvaW5nLnBhcmVudDtcblx0XHR9XG5cdH0sXG5cblx0X3dhbGs6IGZ1bmN0aW9uKCBub2RlICl7XG5cdFx0aWYoIG5vZGUgKXtcblx0XHRcdHRoaXMuX3dhbGsoIG5vZGUubGVmdCApO1xuXHRcdFx0dGhpcy5fbm9kZWxpc3QucHVzaCggbm9kZS5kYXRhICk7XG5cdFx0XHR0aGlzLl93YWxrKCBub2RlLnJpZ2h0ICk7XG5cdFx0fVxuXHR9LFxuXG5cdHdhbGs6IGZ1bmN0aW9uKCl7XG5cdFx0aWYoICF0aGlzLnJvb3QgKXtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdFx0dGhpcy5fbm9kZWxpc3QgPSBbXTtcblx0XHR0aGlzLl93YWxrKHRoaXMucm9vdCk7XG5cdFx0dmFyIG5vZGVzID0gdGhpcy5fbm9kZWxpc3Q7XG5cdFx0ZGVsZXRlIHRoaXMuX25vZGVsaXN0O1xuXHRcdHJldHVybiBub2Rlcztcblx0fSxcblxuXHRpbnNlcnQ6IGZ1bmN0aW9uKCBpdGVtICl7XG5cdFx0dmFyIG5vZGUsXG5cdFx0ICAgIHBhcmVudCA9IG51bGwsXG5cdFx0ICAgIGN1cnNvciA9IHRoaXMucm9vdDtcblx0XHRub2RlID0gbmV3IEJpbmFyeU5vZGUoIHRoaXMsIGl0ZW0gKTtcblxuXHRcdHdoaWxlKCBjdXJzb3IgIT09IG51bGwgKXtcblx0XHRcdHBhcmVudCA9IGN1cnNvcjtcblx0XHRcdGlmKCB0aGlzLl9jb21wYXJlKG5vZGUsIHBhcmVudCkgKXtcblx0XHRcdFx0Y3Vyc29yID0gY3Vyc29yLmxlZnQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdXJzb3IgPSBjdXJzb3IucmlnaHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG5vZGUucGFyZW50ID0gcGFyZW50O1xuXHRcdGlmKCBwYXJlbnQgPT0gbnVsbCApe1xuXHRcdFx0dGhpcy5yb290ID0gbm9kZTtcblx0XHR9IGVsc2UgaWYoIHRoaXMuX2NvbXBhcmUobm9kZSwgcGFyZW50KSApe1xuXHRcdFx0cGFyZW50LmxlZnQgPSBub2RlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJlbnQucmlnaHQgPSBub2RlO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRpbnNlcnRNYW55OiBmdW5jdGlvbiggaXRlbXMgKXtcblx0XHR2YXIgbWUgPSB0aGlzO1xuXHRcdGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XG5cdFx0XHRtZS5pbnNlcnQoaXRlbSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0X2ZpbmQ6IGZ1bmN0aW9uKCBrZXkgKXtcblx0XHR2YXIgbm9kZSA9IHRoaXMucm9vdDtcblx0XHR3aGlsZSggbm9kZSAhPT0gbnVsbCAmJiBrZXkgIT09IHRoaXMuX2dldChub2RlKSApe1xuXHRcdFx0aWYoIGtleSA8IHRoaXMuX2dldChub2RlKSApe1xuXHRcdFx0XHRub2RlID0gbm9kZS5sZWZ0O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bm9kZSA9IG5vZGUucmlnaHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBub2RlO1xuXHR9LFxuXHRmaW5kS2V5OiBmdW5jdGlvbigga2V5VmFsdWUgKXtcblx0XHRyZXR1cm4gdGhpcy5fZGF0YU9yTnVsbCggdGhpcy5fZmluZCgga2V5VmFsdWUgKSApO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJpbmFyeVRyZWU7XG4iLCJmdW5jdGlvbiBCaW5hcnlOb2RlKCB0cmVlLCBkYXRhICl7XG5cdHRoaXMudHJlZSA9IHRyZWU7XG5cdHRoaXMuZGF0YSA9IGRhdGE7XG5cdHRoaXMucGFyZW50ID0gbnVsbDtcblx0dGhpcy5sZWZ0ID0gbnVsbDtcblx0dGhpcy5yaWdodCA9IG51bGw7XG59O1xuXG5CaW5hcnlOb2RlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIG5vZGVUb1N0cmluZygpe1xuXHRyZXR1cm4gXCJCaW5hcnlUcmVlTm9kZShrZXk6IFwiICsgdGhpcy50cmVlLl9nZXQodGhpcykgKyBcIiwgZGF0YTogXCIgKyB0aGlzLmRhdGEudG9TdHJpbmcoKSArIFwiKVwiO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCaW5hcnlOb2RlO1xuIl19
