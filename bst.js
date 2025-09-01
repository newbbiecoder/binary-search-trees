class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

function insertRec(value, root) {
  if(root === null) {
    return new Node(value);
  }

  if(root.data > value) {
    root.left = insertRec(value, root.left);
  }
  else if(root.data < value) {
    root.right = insertRec(value, root.right);
  }

  return root;
}

function buildTree(arr, start, end) {
    arr.sort(function(a,b){return a - b});

    let set = new Set(arr);
    let newArr = [...set];

    if(start > end) {return null};

    let mid = Math.floor((start + end) / 2);

    let root = new Node(newArr[mid]);

    root.left = buildTree(newArr, start, mid - 1);
    root.right = buildTree(newArr, mid + 1, end);

    return root;
}

function getSuccesor(curr) {
  curr = curr.right;

  while(curr !== null && curr.left !== null) {
    curr = curr.left;
  }

  return curr;
}

function getHeight(node) {
    if(node === null) return -1;

    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};


class Tree {
    constructor(arr) {
        this.arr = arr;
        this.root = buildTree(arr, 0, this.arr.length - 1);
    }

    insert(value) {
      this.root = insertRec(value, this.root)
    }

    delete(value, root = this.root) {
      if(root === null){
        return root;
      }

      if(root.data > value) {
        root.left = this.delete(value, root.left);
      }
      else if(root.data < value) {
        root.right = this.delete(value, root.right);
      }
      else {
        // For a node having 0 or 1 child
        if(root.left === null) {
          return root.right;
        }

        if(root.right === null) {
          return root.left;
        }

        // For a node having 2 childs
        let succ = getSuccesor(root);
        root.data = succ.data;
        root.right = this.delete(succ.data, root.right);
      }
      return root;
    }

    find(value, root = this.root) {
      if(root.data === value) {
        return root;
      }

      if(root.data > value) {
        root = this.find(value, root.left);
      }
      else if(root.data < value) {
        root = this.find(value, root.right);
      }

      return root;
    }

    getTree() {
      return this.root;
    }

    levelOrderForEach(callback) {
      if(typeof callback !== 'function' ) {
        throw new Error("Callback function is required");
      }

      let queue = [];

      if(this.root) queue.push(this.root);

      while(queue.length > 0) {
        let current = queue.shift();

        callback(current);

        if(current.left !== null) queue.push(current.left);
        if(current.right !== null) queue.push(current.right);
      }
    }

    preOrderForEach(callback, root = this.root) {
      if(typeof callback !== 'function') {
        throw new Error("Callback function is required");
      }
      if(root === null) return;

      callback(root)
      this.preOrderForEach(callback, root.left);
      this.preOrderForEach(callback, root.right);

    }

    inOrderForEach(callback, root = this.root) {
      if(typeof callback !== 'function') {
        throw new Error("Callback function is required");
      }
      if(root === null) return;
    
      this.inOrderForEach(callback, root.left);
      callback(root);
      this.inOrderForEach(callback, root.right);
    }

    postOrderForEach(callback, root = this.root) {
      if(typeof callback !== 'function') {
        throw new Error("Callback function is required");
      }
      if(root === null) return;

      this.postOrderForEach(callback, root.left);
      this.postOrderForEach(callback, root.right);
      callback(root);
    }


    height(value, root = this.root) {
      if(root === null) return -1;

      if(root.data === value) {
        return getHeight(root);
      }

      if(value > root.data) {
        return this.height(value, root.right);
      }
      else {
        return this.height(value, root.left);
      }
    }

    depth(value, root = this.root, depthCount = 0) {

      if(root === null) return null;
      if(root.data === value) return depthCount;

      if(value > root.data) {
        return this.depth(value, root.right, depthCount + 1)
      }
      else {
        return this.depth(value, root.left, depthCount + 1);
      }
    }

    isBalanced(root = this.root) {
      if(root === null) return true;

      let diff = Math.abs(getHeight(root.left) - getHeight(root.right));

      if(diff > 1) return false;

      return this.isBalanced(root.left) && this.isBalanced(root.right);
    }

    rebalance() {
      let newArr = [];

      this.inOrderForEach(node => newArr.push(node.data));

      this.root = buildTree(newArr, 0, newArr.length - 1);
    }
    
}

function generateRandomNumbers(min, max) {
  let arr = [];

  for(let i = 0; i < max; i++) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    arr.push(randomNum);
  }

  arr.sort(function(a,b){return a - b});

  let set = new Set(arr);
  let newArr = [...set]
  return newArr;
}

// Generate random numbers and display it
let arr = generateRandomNumbers(1,100);
console.log(arr);

// Create a tree and prettyPrint it
let tree = new Tree(arr);
prettyPrint(tree.getTree());

// Check if tree is balanced
console.log(tree.isBalanced())

// PreOrder Values
let preOrderValues = [];
tree.levelOrderForEach(node => preOrderValues.push(node.data));
console.log(preOrderValues);

// InOrder Values
let inOrderValues = [];
tree.inOrderForEach(node => inOrderValues.push(node.data));
console.log(inOrderValues);

// PostOrder Values
let postOrderValues = [];
tree.postOrderForEach(node => postOrderValues.push(node.data));
console.log(postOrderValues);

// Inserting random values
tree.insert(111);
tree.insert(143);
tree.insert(169);
// Prettyprint the tree
prettyPrint(tree.getTree());
// Check if the tree is balanced after adding new values (returns false)
console.log(tree.isBalanced());
// Balanced the tree
tree.rebalance();
// Prettyprint the tree
prettyPrint(tree.getTree());
// Check if the tree is balanced after balancing it (returns true)
console.log(tree.isBalanced());

// Find, height and depth functions
console.log(tree.find(143));
console.log(tree.height(22));
console.log(tree.depth(4));