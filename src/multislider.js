// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

	// Create the defaults once
	var pluginName = "multiSlider",
		defaults = {
			propertyName: "value"
		};

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function () {
			// call them like so: this.doSomething(this.element, this.settings).
			console.log("xD");
		},
		doSomething: function () {

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
