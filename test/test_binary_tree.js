// Test Suite for Binary Tree
describe("Binary Tree Basic Functionality Test Suite", function(){

	var BinaryTree = require('../src/binary_tree.js');
	var BinaryNode = require('../src/binary_node.js');

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
	});

	it("can create a BinaryTree with a list of numbers", function(){
		var numbers = [1, -4, 5, 10, -345];
		var btree = new BinaryTree(numbers);
		expect(btree.walk()).toEqual(numbers.sort(function(a,b){
			return (a - b);
		}));
		expect(btree.min()).toEqual(-345);
		expect(btree.max()).toEqual(10);
	});

	it("can set and use a custom key accessor function", function(){
		var objects,
			numbers,
			keyFunction,
			btree;
		numbers = [1, -4, 5, 10, -345];
		objects = [];
		numbers.forEach(function(n){
			objects.push({
				value: n
			});
		});
		keyFunction = function(d){
			return d.value;
		};
		btree = new BinaryTree(objects, keyFunction);
		expect(btree.walk()).toEqual(objects.sort(function(a, b){
			return (keyFunction(a) - keyFunction(b));
		}));
	});

	it("can find an item that matches a key", function(){
		var objects,
			numbers,
			keyFunction,
			btree;
		numbers = [1, -4, 5, 10, -345];
		objects = [];
		numbers.forEach(function(n){
			objects.push({
				value: n
			});
		});
		keyFunction = function(d){
			return d.value;
		};
		btree = new BinaryTree(objects, keyFunction);
		var target = -4;
		var result = btree.find( target );
		expect(keyFunction(result)).toEqual(target);
		target = 10;
		result = btree.find( target );
		expect(keyFunction(result)).toEqual(target);
	});
});
