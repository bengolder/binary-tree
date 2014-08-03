var BinaryNode = require('./binary_node.js');

var compareBasic = function( a, b ){
	// this is a basic comparison function that mimics numeric comparison (a - b)
	// if a is bigger than b, it returns true (1)
	// if a is equal to b, it also returns true (1)
	// if a is less than b, it returns false (0)
	return a >= b;
};

function BinaryTree( data, comparatorFunction, key ){
	this.root = null;
	this.size = 0;


	// the accessor function receives the data and returns the value to be used
	// as a sorting key.
	if( key === undefined ){
		this._get = function(n){ return n.data; };
	} else {
		this._get = function(n){
			return key(n.data);
		};
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
}

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
		if( node.left === null ){
			this._transplant( node, node.right );
		} else if( node.right === null ){
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
		this.size--;
	},

	_transplant: function( outgoing, incoming ){
		// switch out one node for another.
		if( outgoing.parent === null ){
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
		if( parent === null ){
			this.root = node;
		} else if( this._compare(node, parent) ){
			parent.left = node;
		} else {
			parent.right = node;
		}
		this.size++;
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
	},

	_step: function( node, direction ){
		if( node[direction] !== null ){
			return this._min( node[direction] );
		} 
		var next = node.parent;
		while( next !== null && node == next[direction] ){
			node = next;
			next = next.parent;
		}
		return next;
	},

	next: function( node ){
		return this._step( node, 'right' );
	},

	prev: function( node ){
		return this._step( node, 'left' );
	}

};

module.exports = BinaryTree;
