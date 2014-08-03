// Test Suite for Binary Tree
describe("Binary Tree Basic Functionality Test Suite", function(){

	var BinaryTree = require('../src/binary_tree.js');
	var BinaryNode = require('../src/binary_node.js');
	var numbers = [1, -4, 5, 10, -345];
	var names = ["Maude", "Lillian", "Gertrude", "Rose", "Edna", "Pearl"];
	var objects = numbers.map(function(n){ return { value: n }; });
	var people = names.map(function(n){ return { value: n }; });
	var keyFunction = function(d){ return d.value; };
	var comparisonFunction = function(a, b){ return b > a; };

	it("can instantiate an empty Binary Tree object", function(){
		var btree = new BinaryTree();
		expect(btree).toBeTruthy();
		expect(btree.root).toBe(null);
		expect(btree.walk()).toEqual([]);
	});

	it("can instantiate an empty Binary Node object", function(){
		var btree = new BinaryTree();
		var node = new BinaryNode( btree, 6 );
		expect(node).toBeTruthy();
		expect(node.parent).toBe(null);
		expect(node.left).toBe(null);
		expect(node.right).toBe(null);
		expect(node.tree).toBe(btree);
		expect(node.data).toBe(6);
		expect(node.toString()).toEqual("BinaryTreeNode(key: 6, data: 6)")
		expect(btree.size).toBe(0);
	});

	it("can create a BinaryTree with a list of numbers", function(){
		var btree = new BinaryTree(numbers);
		expect(btree.walk()).toEqual(numbers.sort(function(a,b){
			return (a - b);
		}));
		expect(btree.min()).toEqual(-345);
		expect(btree.max()).toEqual(10);
		expect(btree.size).toEqual(numbers.length);
	});

	it("can set and use a custom key accessor function", function(){
		var btree = new BinaryTree(objects, null, keyFunction);
		expect(btree.walk()).toEqual(objects.sort(function(a, b){
			return (keyFunction(a) - keyFunction(b));
		}));
	});

	it("can set and use a custom comparison function", function(){
		var btree = new BinaryTree(people, comparisonFunction, keyFunction);
		var sortedPeople = people.sort(function(a, b){
			return comparisonFunction( keyFunction(a), keyFunction(b) );
		});
		expect(btree.walk()).toEqual(sortedPeople);
	});

	it("can find an item that matches a key", function(){
		var btree = new BinaryTree(objects, null, keyFunction);
		var target = -4;
		var result = btree.findKey( target );
		expect(keyFunction(result)).toEqual(target);
		target = 10;
		result = btree.findKey( target );
		expect(keyFunction(result)).toEqual(target);
		expect(btree.findKey( 20 )).toBeNull();
		expect(btree.findKey( 0 )).toBeNull();
	});

	it("can delete an item with a given key", function(){
		var btree = new BinaryTree(objects, null, keyFunction);
		var target = -4;
		var result = btree.findKey( target );
		expect(keyFunction(result)).toEqual(target);
		// shouldn't return anything
		expect(btree.removeKey(target)).toBeUndefined();
		// now the key should be missing
		expect(btree.findKey(target)).toBeNull();
		// try to remove something not in the tree
		expect(btree.removeKey(50)).toBeUndefined();
	});

	it("can delete lots of things", function(){
		var values = [];
		var n = 1000;
		for( var i = 0; i < n; i++ ){
			values.push( (Math.random() - 0.5) * 100 );
		}
		var btree = new BinaryTree(values);
		for( var j = 0; j < n; j++ ){
			btree.removeKey( values[j] );
		}
		expect(btree.walk()).toEqual([]);
	});
});
