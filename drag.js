"use strict"; 


(function(global, document, $) {

const log = console.log;
/* Global variables */
var dragging = false;
var currDragged = null;
var currGrouping = null;
var currDataTransfer = null;
var currDraggedOver = null;
var currPosition = null;
var prevOpacity = 1;
var ghostElement = null;
var ids = [];

var offsetX = null;
var offsetY = null;

/* Classes */
class Dragjs {
	constructor() {
		this.currId = null;
		this.ids = [];
		this.groupId = generateRandomId();
	}
	
	newO() {
		return new Dragjs();
	}

	/* setGroupId(id): Sets the current object's group ID to id */
	setGroupId(id) {
		this.groupId = id;
	}
	
	/* createDropzone(): Creates a dropzone with a unique id. */
	createDropzone(parentId, options = {}) {
		let dropzoneDefaults = {
			grouping: this.groupId,
			tag: 'div',
			classes: 'dragOrigin',
			styles: '',
			isItem: false,
			snapToGrid: true,
			itemCreator: false,
			itemCreatorOptions: {},
			htmlAttributes: {}
		}

		options = assignDefaults(dropzoneDefaults, options);
		let parElement = null;
		if (typeof parentId == "string"){
			parElement = document.getElementById(parentId);
		} else if (typeof parentId == "object" && parentId) {
			parElement = parentId;
		} 	
		let childId = generateRandomId();
		let childElement = document.createElement(options.tag);
		
		childElement.setAttribute('id', childId);
		if (options.styles)
			childElement.setAttribute('style', options.styles);
		if (options.classes)
			childElement.setAttribute('class', options.classes);
		if (options.isItem) {
			childElement.setAttribute('draggable', 'true');
			childElement.addEventListener('dragstart', dropFuncs.onDragStart);
			childElement.setAttribute('snapToGrid', options.snapToGrid);
		}


		childElement.setAttribute('grouping', options.grouping);
		childElement.setAttribute('dragtype', 'dropzone');
		childElement.addEventListener('dragover', dropFuncs.onDragOver);
		childElement.addEventListener('drop', dropFuncs.onDrop);
		childElement.addEventListener('dragleave', dropFuncs.onDragLeave);
		for (const attribute in options.htmlAttributes) {
			childElement.setAttribute(attribute, options.htmlAttributes[attribute])
		}

		if (parElement) {
			parElement.appendChild(childElement);
		}
		if (options.itemCreator) {
			let itemCreatorOptions = options.itemCreatorOptions
			if (!itemCreatorOptions.classes) {
				itemCreatorOptions.classes = 'item';
			}
			itemCreatorOptions.isCreator = true;
			let itemCreator = this.createItem(childId, itemCreatorOptions);
			document.getElementById(itemCreator.id).addEventListener('keydown', (event) => {
				newItemHandler(event, this.groupId, childElement.id);
			})
		}

		return childElement;
	}
	/* multiCreateDropzones(args): Creates multiple dropzones with options specified by args */
	multiCreateDropzones(args) {
		let returnVals = {}
		for (const parentId in args) {
			args[parentId].forEach((options) => {
				if (!returnVals[parentId]) {
					returnVals[parentId] = [this.createDropzone(parentId, options)]
				} else {
					returnVals[parentId].push(this.createDropzone(parentId, options));
				}				
			})
		}
		return returnVals;
	}

	/* createItem(): Creates an item within the parent dropzone. */
	createItem(parentId, options = {}) {
		let itemDefaults = {
			grouping: this.groupId,
			tag: 'span',
			classes: 'dragItem',
			styles: '',
			innerHTML: '',
			snapToGrid: true,
			isCreator: false,
			htmlAttributes: {}
		}
		options = assignDefaults(itemDefaults, options);
		let parElement = null;
		if (typeof parentId == "string"){
			parElement = document.getElementById(parentId);
		} else if (typeof parentId == "object" && parentId) {
			parElement = parentId;
		} 	
		
		let childId = generateRandomId();
		let childElement = document.createElement(options.tag);
		childElement.setAttribute('id', childId);
		if (options.styles)
			childElement.setAttribute('style', options.styles);
		if (options.classes)
			childElement.setAttribute('class', options.classes);

		childElement.style.transition = 'transform 1s';
		childElement.setAttribute('snapToGrid', options.snapToGrid);
		childElement.setAttribute('grouping', options.grouping);
		childElement.setAttribute('dragtype', 'item');
		childElement.setAttribute('draggable', 'true');
		childElement.addEventListener('dragstart', dropFuncs.onDragStart);

		for (const attribute in options.htmlAttributes) {
			childElement.setAttribute(attribute, options.htmlAttributes[attribute])
		}
		
		let inner = document.createElement('div');
		inner.setAttribute('draggable', 'false');
		inner.style.paddingRight = '25px';
		if (options.isCreator) {
			childElement.innerHTML = '<input type="text" style="width: 100%" />';
		} else {
			inner.innerHTML = options.innerHTML;
		}
		childElement.appendChild(inner);
		if (parElement) {
			parElement.appendChild(childElement);
		}

		return childElement;
	}

	/* multiCreateItems(args): Creates multiple items with options specified by args */
	multiCreateItems(args) {
		let returnVals = []
		for (const parentId in args) {
			args[parentId].forEach((options) => {
				if (!returnVals[parentId]) {
					returnVals[parentId] = [this.createItem(parentId, options)]
				} else {
					returnVals[parentId].push(this.createItem(parentId, options));
				}				
			})
		}
	}
	
}

/*
	Handles when Enter is pressed in itemCreators.
 */
function newItemHandler(event, grouping, parentId) {
	if (event.which == 13 && event.target.value != '') {
		let obj = new Dragjs();
		obj.createItem(event.target.parentElement.parentElement.id, 
			{innerHTML: event.target.value, grouping: grouping, classes: 'item'});
		event.target.value = '';
	}
}

/* Functionality */

function assignDefaults(defaults, options) {
	return Object.assign(defaults, options);
}

function generateRandomId() {
	let id = '_' + Math.random().toString(36).substr(2, 9)
	ids.push(id);
	return id;
}


/*
	Checks the element for droppability, and recursively checks its parent elements if not droppable. 
	Returns the nearest droppable element in the hierarchy or false if no elements are droppable.
	X and Y can be specified to find elements at a specific point, or they can be ommitted to simply check the element's hierarchy
 */
function dropFinder(element, x = null, y = null) {
	if (!x && !y) {
		return dropFinderNoPoint(element);
	}

	let pointElements = document.elementsFromPoint(x, y);
	for (let i = 0; i < pointElements.length; i++) {
		let elem = pointElements[i];
		if (elem.tag == 'html') {
			return null;
		}
		let droppable = true;
		let dragtype = elem.attributes.dragtype ? elem.attributes.dragtype.nodeValue : null;
		let grouping = elem.attributes.grouping ? elem.attributes.grouping.nodeValue : null;

		if (!dragtype || dragtype != 'dropzone') {
			continue;
		}
		if (!grouping || grouping != currGrouping) {
			continue;
		}
		if (elem == ghostElement || elem == currDragged) {
			continue;
		}
		return elem;
	}
	return null;

}

/* Helper function to find a drop point given only an element */
function dropFinderNoPoint(elem) {
	try {
		if (elem.tag == 'html') {
			return null;
		}

		let droppable = true;
		let dragtype = elem.attributes.dragtype ? elem.attributes.dragtype.nodeValue : null;
		let grouping = elem.attributes.grouping ? elem.attributes.grouping.nodeValue : null;

		if (!dragtype || dragtype != 'dropzone') {
			droppable = false;
		}
		if (!grouping || grouping != currGrouping) {
			droppable = false;
		}
		if (elem == ghostElement || elem == currDragged) {
			log('elem is currdragged');
			return dropFinder(elem.parentElement);
		}
		
		if (droppable) {
			return elem
		}
		else {
			if (elem.parentElement) {
				return dropFinder(elem.parentElement);
			}
			else {
				return null;
			}
		}
	} catch (e) {
		return null;
	}
}

/* Finds a draggable element in elem's path */
function dragFinder(elem) {
	if (elem.attributes && elem.attributes.grouping) {
		return elem;
	} else {
		return dragFinder(elem.parentElement);
	}
}

/*
	Returns the node to insertBefore so that the new element is in the correct order, based on cursor position.
	Uses the midpoint of the hovered-over element to decide whether to place before or after the element.
 */
function findPositionalReference(parent, child, x, y) {
	let elem = null;
	let area = null;
	for (let i = 0; i < parent.children.length; i++) {
		elem = parent.children[i];

		area = elem.getBoundingClientRect();
		if (elem != ghostElement && elem != child && area.top + area.height / 2 > y) {
			return elem;
		}
	}
	return null;
}


/*
	Resets the ghosted element that gets created when hovering with an item dragged.
 */
function resetGhostElement(clearPos = false) {
	if (ghostElement)
		ghostElement.remove();
	ghostElement = null;
	if (clearPos)
		currPosition = null;
}

/*
	Wrapper function for preventDefault
 */
function preventDefaults(event) {
	event.preventDefault();
}


/*
	Contains the DragEvent handlers used in dropzones and items.
 */
let dropFuncs = {
	/*
		Runs when the dragged item is dropped outside of a compatible area.
	 */
	onDropFail: (event) => {
		if (currDragged)
			currDragged.style.opacity = prevOpacity;
		resetGhostElement(clearPos = true);
		currDragged = null;
		currDataTransfer = null;
		currGrouping = null;
		currDraggedOver = null;
		offsetX = null;
		offsetY = null;
		prevOpacity = 1;
	},
	/*
		Runs when the dragged item is dragged over the outside of a compatible area
	 */
	onDragOverFail: (event) => {
		event.preventDefault();
	},
	/*
		Runs when a drag is initiated
	 */
	onDragStart: (event) => {
		event.stopPropagation();
		currDragged = event.target;
		if (!event.target.attributes ||
			!event.target.attributes.grouping) {
			currDragged = dragFinder(event.target);
		}
		currGrouping = currDragged.attributes.grouping.nodeValue;

		currDataTransfer = event.dataTransfer;
		prevOpacity = currDragged.style.opacity;
		currDragged.style.opacity = .25;
		if (currDragged.attributes.snapToGrid.nodeValue == 'false') {
			let style = window.getComputedStyle(event.target, null);
			offsetX = parseInt(style.getPropertyValue("left"), 10) - event.clientX
			offsetY = parseInt(style.getPropertyValue("top"), 10) - event.clientY;
			currDragged.style.position = 'relative';
		}
	},
	/*
		Runs when dragging over a Drag.js dropzone
	 */
	onDragOver: (event) => {
		event.preventDefault();
		event.stopPropagation();
		let dropzone = dropFinder(event.target, event.x, event.y);
		if (dropzone) {
			currDragged.style.opacity = 0.25;
			event.dataTransfer.dropEffect = 'move';

			let position = findPositionalReference(dropzone, currDragged, event.clientX, event.clientY);
			if (dropzone == currDraggedOver && position == currPosition) {
				return;
			}
			if (dropzone == ghostElement) {
				return;
			}
			currDraggedOver = dropzone;
			currPosition = position;

			resetGhostElement();
			ghostElement = currDragged.cloneNode(true);
			ghostElement.style.opacity = .25;
			if (currDragged.attributes.snapToGrid.nodeValue == 'false') {
				return;
			}
			dropzone.insertBefore(ghostElement, position);
			if (ghostElement.previousSibling === currDragged) {
				resetGhostElement();
			}
		}
		else {
			resetGhostElement(true);
			event.dataTransfer.dropEffect = 'none';	
		}
	},
	/*
		Runs when exiting a Drag.js dropzone
	 */
	onDragLeave: (event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
		if (event.relatedTarget == null) {
			currDragged.style.opacity = prevOpacity;
			prevOpacity = 1;
			resetGhostElement();
			return;
		}

		let dropzone = dropFinder(event.relatedTarget, event.clientX, event.clientY);
		if (dropzone == null) {
			currDragged.style.opacity = prevOpacity;
			prevOpacity = 1;
			resetGhostElement();
		}
	},
	/*
		Runs when a Drag.js object is dropped.
	 */
	onDrop: (event) => {
		event.preventDefault();
		if (!currDragged) {
			return;
		}
		let id = currDragged.id;
		let draggableElement = currDragged;
		let dropzone = dropFinder(event.currentTarget, event.x, event.y);
		currDragged.style.opacity = prevOpacity;
		if (dropzone) {
			if (currDragged.attributes.snapToGrid.nodeValue == 'false') {
				currDragged.style.position = 'relative';
				currDragged.style.left = (event.clientX + offsetX) + 'px';
				currDragged.style.top = (event.clientY + offsetY) + 'px';
			} else {
				let position = findPositionalReference(dropzone, draggableElement, event.clientX, event.clientY);
				if (position) {
					dropzone.insertBefore(draggableElement, position);
				} else {
					dropzone.appendChild(draggableElement);
				}
			}
		}
		resetGhostElement(true);
		currDragged = null;
		currDataTransfer = null;
		currGrouping = null;
		currDraggedOver = null;
		offsetX = null;
		offsetY = null;
		prevOpacity = 1;
	}
}

global.Dragjs = global.Dragjs || Dragjs;
})(window, window.document, $);