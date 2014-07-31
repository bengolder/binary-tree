var BinaryNode = require('./binary_node.js');

var compareBasic = function( a, b ){
	return a > b;
}

function BinaryTree( data, comparatorFunction, accessorFunction ){
	this.root = null;

	// the accessor function receives the data and returns the value to be used
	// as a sorting key.
	if( accessorFunction == undefined ){
		this._get = function(n){ return n.data; };
	} else {
		this._get = function(n){
			return accessorFunction(n.data);
		}
	}

	comparatorFunction = comparatorFunction || compareBasic;
	this._compare = function( n, m ){
		// there should only be two possible directions.
		// to go left we want less than, for right greater than / equal to
		var result = comparatorFunction( this._get(n), this._get(m) );
		// comparatorFunctions can return either numbers or truthy / falsey
		// they are fed in their data (default) or whatever is returned 
		// by the accessorFunction
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

	min: function( node ){
		node = node || this.root;
		while( node.left !== null ){
			node = node.left;
		}
		return this._dataOrNull( node );
	},

	max: function( node ){
		node = node || this.root;
		while( node.right !== null ){
			node = node.right;
		}
		return this._dataOrNull( node );
	},

	removeKey: function( keyValue ){
		// remove an item from the tree
	},

	_transplant: function( inNode, outNode ){
		// switch out one node for another.
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

	findKey: function( keyValue ){
		var node = this.root;
		while( node !== null && keyValue !== this._get(node) ){
			if( keyValue < this._get(node) ){
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return this._dataOrNull( node );
	}
};

module.exports = BinaryTree;
