// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( window, document, undefined ) {

	"use strict";

	function MultiSlider( element, options ) {
		this.element = element;
		this.settings = options;
		this.init();
	}

	function createElement(tagName, attrs, content){
		var el = document.createElement(tagName);
		if(attrs){
			for(var key in attrs){
				el.setAttribute(key, attrs[key]);
			}
		}
		if(content){
			el.textContent = content;
		}
		return el;
	}

	function forEachNode(nodeList, fn){
		Array.prototype.forEach.call(nodeList, fn);
	}

	MultiSlider.prototype.init = function () {

		var domTree = createElement('div',{'class':'bucket-collection'});

		this.settings.buckets.forEach(function(bucket){
			var bucketEl = domTree.appendChild(createElement('div', {'class': bucket.key + ' bucket'}));
			bucketEl.style.height = bucket.value + '%';
			bucketEl.appendChild(createElement('span',{},bucket.value + '%'));
			bucketEl.appendChild(createElement('div',{'class':'handle'}));
		});
		this.element.classList.add('multibar-slider');
		this.element.appendChild(domTree);

		this.addDragHandlers(domTree);
	};


	MultiSlider.prototype.addDragHandlers = function (domTree) {
		forEachNode(domTree.querySelectorAll('.handle'), function(el){
			el.addEventListener('mousedown', function(downEvent) {
				var handleEl = downEvent.target;
				var bar = handleEl.parentNode.parentNode;
				var currentBucket = handleEl.parentNode;
				var nextBucket = currentBucket.nextSibling;
				var currentBucketValueEl = currentBucket.querySelector('span');
				var nextBucketValueEl = nextBucket.querySelector('span');
				var maxHeight = bar.offsetHeight;
				var currentPercentage = currentBucket.offsetHeight / maxHeight;
				var nextPercentage = nextBucket.offsetHeight / maxHeight;

				var moveEventHandler = function(moveEvent) {
					bar.classList.add('dragging');
					currentBucket.classList.add('active');

					var diffPercentage = (moveEvent.pageY - downEvent.pageY) / maxHeight;

					var newPercentage = ((currentPercentage + diffPercentage) * 100).toFixed(1) + '%';
					currentBucket.style.height = newPercentage;
					currentBucketValueEl.textContent = newPercentage;

					var newNextPercentage = ((nextPercentage - diffPercentage) * 100).toFixed(1) + '%';
					nextBucket.style.height = newNextPercentage;
					nextBucketValueEl.textContent = newNextPercentage;
				};

				var upEventHandler = function() {
					domTree.removeEventListener('mousemove', moveEventHandler);
					domTree.removeEventListener('mouseup', upEventHandler);
					bar.classList.remove('dragging');
					currentBucket.classList.remove('active');
				};

				domTree.addEventListener('mousemove', moveEventHandler);

				domTree.addEventListener('mouseup', upEventHandler);
			});
		});
	};

	window.MultiSlider = MultiSlider;

})( window, document );

