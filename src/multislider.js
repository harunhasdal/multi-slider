;(function ( angular, window, document, undefined ) {

	"use strict";

	angular.module('rmalabs-components', []).directive('ngMultiSlider', ['$timeout', function($timeout) {

		return {
			restrict: 'E',
			transclude: true,
			scope: {
				buckets: '=buckets'
			},
			link: function(scope, element){

				var addDragHandlers = function(){

					var handles = element[0].querySelector('.bucket-collection').querySelectorAll('.bucket .handle');

					Array.prototype.forEach.call(handles, function(el){

						el.addEventListener('mousedown', function(downEvent) {

							var handleEl = downEvent.target;
							var bar = handleEl.parentElement.parentElement;
							var currentBucket = handleEl.parentElement;
							var nextBucket = currentBucket.nextElementSibling;

							var currentBucketValueEl = currentBucket.querySelector('span');
							var nextBucketValueEl = nextBucket.querySelector('span');
							var maxHeight = bar.offsetHeight;
							var currentPercentage = currentBucket.offsetHeight / maxHeight;
							var nextPercentage = nextBucket.offsetHeight / maxHeight;

							var moveEventHandler = function(moveEvent) {
								bar.classList.add('dragging');
								currentBucket.classList.add('active');

								var diffPercentage = (moveEvent.pageY - downEvent.pageY) / maxHeight;
								var newPercentage = scope.toPercent((currentPercentage + diffPercentage) * 100);
								currentBucket.style.height = newPercentage;
								currentBucketValueEl.textContent = newPercentage;

								var newNextPercentage = scope.toPercent((nextPercentage - diffPercentage) * 100);
								nextBucket.style.height = newNextPercentage;
								nextBucketValueEl.textContent = newNextPercentage;
							};

							var upEventHandler = function() {
								window.removeEventListener('mousemove', moveEventHandler);
								window.removeEventListener('mouseup', upEventHandler);
								bar.classList.remove('dragging');
								currentBucket.classList.remove('active');
							};

							window.addEventListener('mousemove', moveEventHandler);

							window.addEventListener('mouseup', upEventHandler);
						});
					});
				};

				$timeout(function(){addDragHandlers();}, 0);
			},
			template: '<div class="multibar-slider"><div class="bucket-collection"><div class="bucket" ng-class="bucket.key" style="height:{{toPercent(bucket.value)}}" ng-repeat="bucket in buckets"><span>{{toPercent(bucket.value)}}</span><div class="handle"></div></div></div></div>',
			replace: true,
			controller: function($scope){
				$scope.toPercent = function(val){
					return Number(val).toFixed(1) + '%';
				};
			}
		};
	}]);

})( angular, window, document );

