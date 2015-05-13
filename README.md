# Multi Slider Bar

### A multi slider bar jquery plugin



## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<link rel="stylesheet" href="dist/multislider.css">
	```

	```html
	<script src="dist/multi-slider.min.js"></script>
	```

3. Call the plugin:

	```javascript
	$("#element").multiSlider({
		buckets:[{key:'class1',value: 50}, {key: 'class2', value: 50}]
	});
	```
	Above options will result in a multi-slider with two buckets of 50%.


4. Provide styles for your buckets
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

## Options

#### Options.buckets

Required

Specifies the number of buckets with keys and default values.

## Customising CSS

Following css classes are necessary for the component to function correctly

```css

.multibar-slider

.multibar-slider-list

.multibar-slider-list .bucket

.multibar-slider .bucket span

.multibar-slider .bucket .handle

.multibar-slider .bucket:last-child .handle

.multibar-slider .dragging .bucket.active

.multibar-slider .dragging .bucket:not(.active)

.multibar-slider .dragging .bucket.active .handle
```

## License

[MIT License](http://harunhasdal.mit-license.org/) © Harun Hasdal
