# Multi Slider Bar

### A multi slider bar react component

## Usage

1. Include React:

	```html
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.1/react-with-addons.js"></script>
	```

2. Use grunt-react or commandline to generate multislider.js from multislider.jsx



3. Include component's code:

	```html
	<link rel="stylesheet" href="dist/multislider.css">
	```

	```html
	<script src="dist/multi-slider.js"></script>
	```

4. Call the plugin:

	```javascript
	React.render(
	  React.createElement(MultiSlider, {buckets:[{key:'class1',value: 50}, {key: 'class2', value: 50}]}),
	  document.getElementById('element')
	);
	```
	Above options will result in a multi-slider with two buckets of 50%.


5. Provide styles for your buckets
	If you'd like to provide custom colors for your buckets,
	you can provide custom styles for your buckets using the keys as css class selectors. Following css example will result in a red and a blue bucket.

	```css
	.class1{
		background-color: red;
	}
	.class2{
		background-color: blue;
	}
	```

## Component properties

#### buckets

Required array of bucket objects with key and value.

Specifies the number of buckets with keys and default values.

## Customising CSS

Following css classes are necessary for the component to function correctly

```css

.multibar-slider

.multibar-slider .bucket-collection

.multibar-slider .bucket

.multibar-slider .bucket span

.multibar-slider .bucket .handle

.multibar-slider .bucket:last-child .handle

.multibar-slider .dragging .bucket.active

.multibar-slider .dragging .bucket:not(.active)

.multibar-slider .dragging .bucket.active .handle
```

## License

[MIT License](http://harunhasdal.mit-license.org/) © Harun Hasdal
