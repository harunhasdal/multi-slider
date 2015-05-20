// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

	// Create the defaults once
	var pluginName = "multiSlider",
			defaults = {
			};

	var touchEnabled = 'ontouchstart' in window;

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element = $(element);
		this.settings = $.extend( {}, defaults, options );
		this.state = {};
		this.init();
	}

	function toPercent( value ) {
		return Number(value).toFixed(1) + '%';
	}

	$.extend(Plugin.prototype, {
		init: function () {
			var bucketList = $('<div class="bucket-collection"></div>');
			for (var i in this.settings.buckets) {
				bucketList.append(
					$('<div></div>')
						.addClass(this.settings.buckets[i].key).addClass('bucket')
						.append('<span>' + this.settings.buckets[i].value + '%' + '</span>')
						.css('height', this.settings.buckets[i].value + '%')
						.append('<div class="handle"></div>')
				);
			}
			if(touchEnabled){
				this.element.addClass('touch-enabled');
			}
			this.element.addClass('multibar-slider').append(bucketList);
			this.bucketList = bucketList;
			this.addDragHandlers();
		},
		setDraggingState: function(handleEl, startPoint){
				this.state.bucketEl = $(handleEl.parentElement);
				this.state.neigbourEl = this.state.bucketEl.next();
				this.state.totalHeight = this.element.outerHeight();
				this.state.bucketInitialHeight = this.state.bucketEl.outerHeight() / this.state.totalHeight;
				this.state.neighbourInitialHeight = this.state.neigbourEl.outerHeight() / this.state.totalHeight;
				this.state.startPoint = startPoint;
		},
		startDragging: function(){
			this.bucketList.addClass('dragging');
			this.state.bucketEl.addClass('active');
		},
		endDragging: function(){
			this.bucketList.removeClass('dragging');
			this.state.bucketEl.removeClass('active');
			this.state = {totalHeight: this.state.totalHeight};
		},
		executeDrag: function(point){
			var diff = (point.y - this.state.startPoint.y) / this.state.totalHeight;

			var value = toPercent((this.state.bucketInitialHeight + diff) * 100);
			this.state.bucketEl.css('height', value).find('span').html(value);

			var neighbourValue = toPercent((this.state.neighbourInitialHeight - diff) * 100);
			this.state.neigbourEl.css('height', neighbourValue).find('span').html(neighbourValue);
		},
		addDragHandlers: function () {
			var bodyEl = $(document.body);
			var handles = this.element.find('.handle');

			handles.on('mousedown',function (downEvent) {

				this.setDraggingState(downEvent.target, {y: downEvent.pageY});

				bodyEl.on('mousemove',function (moveEvent) {
					this.executeDrag({y: moveEvent.pageY});
				}.bind(this));

				bodyEl.on('mouseup',function () {
					bodyEl.unbind('mousemove');
					bodyEl.unbind('mouseup');
					this.endDragging();
				}.bind(this));

				this.startDragging();
			}.bind(this));

			if(touchEnabled){
				handles.on('touchstart', function(startEvent){

					var firstTouch = startEvent.originalEvent.touches[0];
					this.setDraggingState(firstTouch.target, {y: firstTouch.pageY});

					bodyEl.on('touchmove', function(moveEvent){
						moveEvent.preventDefault();
						moveEvent.stopPropagation();
						this.executeDrag({y: moveEvent.originalEvent.touches[0].pageY});
					}.bind(this));

					bodyEl.on('touchend', function(){
						bodyEl.unbind('touchmove');
						bodyEl.unbind('touchend');
						this.endDragging();
					}.bind(this));

					this.startDragging();
				}.bind(this));
			}
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

