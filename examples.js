"use strict"; 

function exampleOne() {
	let dragjs = new Dragjs();
	let originId = dragjs.createDropzone('example1', {
		classes: "origin"
	}).id;
	let dropzoneId = dragjs.createDropzone('example1', {
		classes: 'dropzone'
	}).id;
	dragjs.createItem(originId, {
		innerHTML: 'Drag.js is a JavaScript library that aims to bring drag mechanics to all developers.',
		classes: 'item'
	});
	dragjs.createItem(originId, {
		innerHTML: 'It provides an interface for developers to create drag-and-drop areas in their webapps.',
		classes: 'item'
	});
	dragjs.createItem(originId, {
		innerHTML: 'Give it a try with these boxes!',
		classes: 'item'
	});
	dragjs.createItem(dropzoneId, {
		innerHTML: 'Creating dropzones is as easy as:',
		classes: 'item'
	});
	dragjs.createItem(dropzoneId, {
		innerHTML: 'dragjs.createDropzone(parentId)',
		classes: 'item'
	});
	dragjs.createItem(dropzoneId, {
		innerHTML: 'Items are just as easy:',
		classes: 'item'
	});
	dragjs.createItem(dropzoneId, {
		innerHTML: 'dragjs.createItem(parentId)',
		classes: 'item'
	});

}

function exampleTwo() {
	let dragjs = new Dragjs();
	let origin2Id = dragjs.createDropzone('example2row1', {
		classes: 'origin'
	}).id;
	let dropzone2Id = dragjs.createDropzone('example2row1', {
		classes: 'dropzone'
	}).id;
	let origin3Id = dragjs.createDropzone('example2row2', {
		classes: 'origin',
	}).id;
	let dropzone3Id = dragjs.createDropzone('example2row2', {
		classes: 'dropzone',
	}).id;
	dragjs.createItem(origin2Id, {
		innerHTML: 'Drag.js allows you to create an arbitrary amount of dropzones',
		classes: 'item'
	});
	dragjs.createItem(dropzone2Id, {
		innerHTML: 'As well as an arbitrary amount of items.',
		classes: 'item'
	});
	dragjs.createItem(origin3Id, {
		innerHTML: 'You can even include images. <img draggable="false" src="https://picsum.photos/300/200" />',
		classes: 'item'
	})
	dragjs.createItem(dropzone3Id, {
		innerHTML: 'Drag.js will appropriately resize and scale as necessary',
		classes: 'item'
	});

}

function exampleThree() {
	let dragjs = new Dragjs();
	let zone1Id = dragjs.createDropzone('example3row1', {
		classes: 'origin'
	})
	dragjs.createItem(zone1Id, {
		innerHTML: 'Each Drag.js object is encapsulated.',
		classes: 'item'
	});
	dragjs = new Dragjs();
	let zone2Id = dragjs.createDropzone('example3row1', {
		classes: 'dropzone'
	});

	dragjs.createItem(zone2Id, {
		innerHTML: 'Try moving items between these two dropzones.',
		classes: 'item'
	});
	dragjs.createItem(zone2Id, {
		innerHTML: 'It will not work as the dropzones have different groupings.',
		classes: 'item'
	})
	
	dragjs = new Dragjs();
	let multiDropzoneArgs = {'example3row3': [{classes: 'dropzone'}, {classes: 'origin'}]}
	dragjs = new Dragjs();
	let returnVals = dragjs.multiCreateDropzones(multiDropzoneArgs);
	let dropzone = returnVals['example3row3'][0].id;
	let origin = returnVals['example3row3'][1].id;
	let multiItemArgs = {};
	multiItemArgs[dropzone] = [{innerHTML: 'Creating many objects at once is also supported', classes: 'item'}]
	multiItemArgs[origin] = [{innerHTML: 'Just use multiCreateDropzones() or multiCreateItems(). Click "View Code" above to see an example', classes: 'item'}]
	returnVals = dragjs.multiCreateItems(multiItemArgs);
}

function exampleFour() {
	let dragjs = new Dragjs();
	let zone1Id = dragjs.createDropzone('example4row1', {
		classes: 'origin'
	}).id;
	let zone2Id = dragjs.createDropzone(zone1Id, {
		classes: 'dropzone nested',
		isItem: true,
	}).id;
	let zone3Id = dragjs.createDropzone('example4row1', {
		classes: 'dropzone'
	}).id;
	dragjs.createItem(zone1Id, {
		innerHTML: 'Give it a try!',
		classes: 'item'
	});
	dragjs.createItem(zone2Id, {
		innerHTML: 'This red outline is actually a dropzone within a dropzone.',
		classes: 'item'
	});
	dragjs.createItem(zone2Id, {
		innerHTML: 'The dropzone is an item as well! You can move the whole red dropzone by dragging.',
		classes: 'item'
	})
}

function exampleFive() {
	let dragjs = new Dragjs();
	let zone1Id = dragjs.createDropzone('example5row1', {
		classes: 'origin'
	}).id;
	let zone2Id = dragjs.createDropzone('example5row1', {
		classes: 'dropzone'
	}).id;
	dragjs.createItem(zone1Id, {
		innerHTML: 'This item can even be positioned anywhere, rather than snapping to the grid.',
		classes: 'item',
		snapToGrid: false
	});

}

function exampleSix() {
	let dragjs = new Dragjs();
	let itemCreatorOptions = {
		classes: 'item'
	}
	let args = {
		'example6row1': [{classes: 'origin', itemCreator: true}, {classes: 'dropzone'}]
	}
	let returnVals = dragjs.multiCreateDropzones(args);
	let zone1Id = returnVals['example6row1'][0];
	let zone2Id = returnVals['example6row1'][1];
	dragjs.createItem(zone1Id, {
		classes: 'item',
		innerHTML: "You are able to add an Item Creator item to any dropzone"
	})
	dragjs.createItem(zone2Id, {
		innerHTML: "<--- Enter some text into this box and hit Enter, and watch as a new item is created!",
		classes: 'item'
	})
	dragjs.createItem(zone2Id, {
		innerHTML: "You can try moving that textbox into this dropzone instead, and it will adapt to create new items in here",
		classes: 'item'
	})
}

$(document).ready(function() {
	exampleOne();
	exampleTwo();
	exampleThree();
	exampleFour();
	exampleFive();
	exampleSix();
	// The code below is taken from https://www.w3schools.com/howto/howto_js_collapsible.asp
	var coll = document.getElementsByClassName("collapsible");
	var i;

	for (i = 0; i < coll.length; i++) {
	  coll[i].addEventListener("click", function() {
	    this.classList.toggle("active");
	    var content = this.nextElementSibling;
	    if (content.style.maxHeight){
	      content.style.maxHeight = null;
	    } else {
	      content.style.maxHeight = content.scrollHeight + "px";
	    }
	  });
	}

});


