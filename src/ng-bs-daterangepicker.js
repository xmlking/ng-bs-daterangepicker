/**
 * @license ng-bs-daterangepicker v0.0.3
 * (c) 2013 Luis Farzati http://github.com/luisfarzati/ng-bs-daterangepicker
 * License: MIT
 */
(function (angular) {
'use strict';

angular.module('ngBootstrap', []).directive('input', function ($compile, $parse) {
	return {
		restrict: 'E',
		require: '?ngModel',
		link: function ($scope, $element, $attributes, ngModel) {
			if ($attributes.type !== 'daterange' || ngModel === null ) return;

			var options = {};
			options.format = $attributes.format || 'YYYY-MM-DD';
			options.separator = $attributes.separator || ' - ';
			options.minDate = $attributes.mindate && moment($attributes.mindate);
			options.maxDate = $attributes.maxdate && moment($attributes.maxdate);
			options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) { return index === 0 && parseInt(elem, 10) || elem; }) );
			options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);
			options.locale = $attributes.locale && $parse($attributes.locale)($scope);
			options.opens = $attributes.opens || "right";

			if ($attributes.timePicker == "true") {
				options.timePicker = true;
			}
			options.timePickerIncrement = $attributes.timePickerIncrement || 30;
			if ($attributes.timePicker12Hour == "false") {
				options.timePicker12Hour = false;
			}
			if ($attributes.singleDatePicker == "true") {
				options.singleDatePicker = true;
			}
			if ($attributes.dateLimit == "true") {
				options.dateLimit = true;
			}
			if ($attributes.showDropdowns == "true") {
				options.showDropdowns = true;
			}
			if ($attributes.showWeekNumbers == "true") {
				options.showWeekNumbers = true;
			}
			options.buttonClasses = $attributes.buttonClasses || ['btn', 'btn-small'];
			options.applyClass = $attributes.applyClass || 'btn-success';
			options.cancelClass = $attributes.cancelClass || 'btn-default';


			function format(date) {
				return date.format(options.format);
			}

			function formatted(dates) {
				return [format(dates.startDate), format(dates.endDate)].join(options.separator);
			}

			ngModel.$formatters.unshift(function (modelValue) {
				if (!modelValue) return '';
				return modelValue;
			});

			ngModel.$parsers.unshift(function (viewValue) {
				return viewValue;
			});

			ngModel.$render = function () {
				if (!ngModel.$viewValue || !ngModel.$viewValue.startDate) return;
				$element.val(formatted(ngModel.$viewValue));
			};

			$scope.$watch($attributes.ngModel, function (modelValue) {
				if (!modelValue || (!modelValue.startDate)) {
					ngModel.$setViewValue({ startDate: moment().startOf('day'), endDate: moment().startOf('day') });
					return;
				}
				$element.data('daterangepicker').setStartDate(modelValue.startDate);
				$element.data('daterangepicker').setEndDate(modelValue.endDate);
				$element.data('daterangepicker').updateView();
				$element.data('daterangepicker').updateCalendars();
				$element.data('daterangepicker').updateInputText();
			});

			$element.daterangepicker(options, function(start, end) {
				$scope.$apply(function () {
					ngModel.$setViewValue({ startDate: start, endDate: end });
					ngModel.$render();
				});
			});			
		}
	};
});

})(angular);