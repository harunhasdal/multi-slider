/*
 *  multi-slider - v0.1.0
 *  A multi-slider bar jQuery plugin.
 *  http://components.rmalabs.com/multi-slider
 *
 *  Made by Harun Hasdal
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

	// Create the defaults once
	var pluginName = "multiSlider",
		defaults = {
		};

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
			console.log("initialised " + pluginName);
		},
		addDragHandlers: function (domTree) {
			domTree.find('.handle').mousedown(function (downEvent) {
				var handleEl = downEvent.target;
				var bar = $(handleEl.parentNode.parentNode);
				var currentBucket = $(handleEl.parentNode);
				var nextBucket = currentBucket.next();

				var maxHeight = bar.outerHeight();
				var currentPercentage = currentBucket.outerHeight() / maxHeight;
				var nextPercentage = nextBucket.outerHeight() / maxHeight;

				domTree.mousemove(function (moveEvent) {
					bar.addClass('dragging');
					currentBucket.addClass('active');

					var diffPercentage = (moveEvent.pageY - downEvent.pageY) / maxHeight;

					var newPercentage = ((currentPercentage + diffPercentage) * 100).toFixed(1) + '%';
					currentBucket.css('height', newPercentage).find('span').html(newPercentage);

					var newNextPercentage = ((nextPercentage - diffPercentage) * 100).toFixed(1) + '%';
					nextBucket.css('height', newNextPercentage).find('span').html(newNextPercentage);

				});

				domTree.mouseup(function () {
					domTree.unbind("mousemove");
					domTree.unbind("mouseup");
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

