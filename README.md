# Drag.js
A JavaScript library for enabling easy peasy Drag n Drop functionality.

[Landing Page: https://serene-mountain-79920.herokuapp.com/examples.html](https://serene-mountain-79920.herokuapp.com/examples.html)

[Documentation: https://serene-mountain-79920.herokuapp.com/documentation.html](https://serene-mountain-79920.herokuapp.com/documentation.html)

# Getting Started

To use the Drag.js API, the first thing to do is to add the script to your document, and then create a new Dragjs object.
```
<script src="drag.js"></script>
<script>
let dragjs = new Dragjs();
</script>
```

The default stylesheet can also be included
```
<link rel="stylesheet" href="drag.css" type="text/css"> 
```


To create a dropzone, we'll need a parent element. Assuming that parentId is the ID of some element on the page, creating dropzones is as easy as:
```
let options = {}
let newDropzone = dragjs.createDropzone(parentId, options)
```

Creating a new item under this new dropzone is just as easy
```
let newItem = dragjs.createItem(newDropzone.id, options)
```

You can create multiple items and dropzones with the multiCreateItem and multiCreateDropzone functions
```
let args = {[newDropzone.id]: [{innerHTML: 'This is an item'}, {innerHTML: 'This is another item'}]}
dragjs.multiCreateItem(args)
```
For more information on options and the behavior of these functions, please refer to the [documentation](https://serene-mountain-79920.herokuapp.com/documentation.html)
