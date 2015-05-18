// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

	// Create the defaults once
	var pluginName = "multiSlider",
		defaults = {
		};
	var touchEnabled = 'ontouchstart' in window;
	var events = ['mousedown', 'mousemove', 'mouseup'];
	if(touchEnabled){
		events = ['touchstart','touchmove', 'touchend'];
	}
	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function () {
			var domTree = $('<div class="bucket-collection"></div>');
			for (var i in this.settings.buckets) {
				domTree.append(
					$('<div></div>')
						.addClass(this.settings.buckets[i].key).addClass('bucket')
						.append('<span>' + this.settings.buckets[i].value + '%' + '</span>')
						.css('height', this.settings.buckets[i].value + '%')
						.append('<div class="handle"></div>')
				);
			}
			$(this.element).addClass('multibar-slider').append(domTree);
			this.addDragHandlers(domTree);
			console.log("initialised " + pluginName + ' touch: ' + touchEnabled);
		},
		addDragHandlers: function (domTree) {
			domTree.find('.handle').on(events[0],function (event) {
				var startEvent = event;
				if(touchEnabled){
					startEvent = event.originalEvent.touches[0];
				}
				var handleEl = startEvent.target;
				var bar = $(handleEl.parentNode.parentNode);
				var currentBucket = $(handleEl.parentNode);
				var nextBucket = currentBucket.next();

				var maxHeight = bar.outerHeight();
				var currentPercentage = currentBucket.outerHeight() / maxHeight;
				var nextPercentage = nextBucket.outerHeight() / maxHeight;

				$(document.body).on(events[1],function (event) {
					var moveEvent = event;

					if(touchEnabled){
						event.preventDefault();
						event.stopPropagation();
						moveEvent = event.originalEvent.touches[0];
					}
					bar.addClass('dragging');
					currentBucket.addClass('active');

					var diffPercentage = (moveEvent.pageY - startEvent.pageY) / maxHeight;

					var newPercentage = ((currentPercentage + diffPercentage) * 100).toFixed(1) + '%';
					currentBucket.css('height', newPercentage).find('span').html(newPercentage);

					var newNextPercentage = ((nextPercentage - diffPercentage) * 100).toFixed(1) + '%';
					nextBucket.css('height', newNextPercentage).find('span').html(newNextPercentage);

				});

				$(document.body).on(events[2],function () {
					$(document.body).unbind(events[1]);
					$(document.body).unbind(events[2]);
					bar.removeClass('dragging');
					currentBucket.removeClass('active');
				});
			});
		}
	});

	// A really lightweight plugin wrapper, preventing against multiple instantiations
	$.fn[ pluginName ] = function ( options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});
	};

})( jQuery, window, document );

