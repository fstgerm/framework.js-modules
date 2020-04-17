/**
 * @author Deux Huit Huit
 *
 * Swiper component
 *
 * http://idangero.us/swiper/api
 *
 * @uses jQuery.fn.data()
 * @requires https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.1/js/swiper.min.js
 */

(function ($, win, undefined) {

	'use strict';

	App.components.exports('swiper', function (s) {
		var scope = $();

		var sels = $.extend({
			element: '.js-swiper',
			ctn: '.js-swiper-ctn',
			wrapper: '.js-swiper-wrapper',
			slide: '.js-swiper-slide',
			scrollbar: '.js-swiper-scrollbar',
			navigationPrev: '.js-swiper-navigation-previous',
			navigationNext: '.js-swiper-navigation-next',
			pagination: '.js-swiper-pagination',
			preventClick: '.js-swiper-prevent-click'
		}, s);

		var nestedConfigs = [
			'navigation',
			'scrollbar',
			'pagination',
			'thumbs',
			'autoplay',
			'keyboard'
		];

		var defaultConfig = {
			observeParents: true,
			observer: true,
			roundLengths: true
		};

		var DATA_KEY = 'swpr';

		var swiper = function () {
			return !!window.Swiper;
		};

		var filterByPrefix = function (obj, prefix) {
			return _.pick(obj, function (value, key) {
				return key.startsWith(prefix);
			});
		};

		var clearPrefix = function (obj, prefix) {
			var keys = Object.keys(obj);

			keys.forEach(function (key) {
				if (key.startsWith(prefix)) {
					var newKey = key.substring(prefix.length);
					newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);
					obj[newKey] = obj[key];
					delete obj[key];
				}
			});

			return obj;
		};

		var getConfig = function (element, prefix) {
			var config = clearPrefix(filterByPrefix(element.data(), prefix), prefix);

			nestedConfigs.forEach(function (key) {
				var data = filterByPrefix(config, key);
				config = _.omit(config, _.keys(data));
				var obj = clearPrefix(data, key);

				if (_.size(obj)) {
					config[key] = obj;
				}
			});

			return config;
		};

		var init = function (element) {
			scope = element;

			App.loaded(swiper, function () {
				var ctn = element.find(sels.ctn);
				var config = getConfig(scope, 'swiper');

				config = $.extend(true, {
					wrapperClass: sels.wrapper.substring(1),
					slideClass: sels.slide.substring(1),
					pagination: {
						el: element.find(sels.pagination),
						clickable: true
					},
					navigation: {
						nextEl: element.find(sels.navigationNext),
						prevEl: element.find(sels.navigationPrev)
					},
					scrollbar: {
						el: element.find(sels.scrollbar)
					}
				}, defaultConfig, config);

				if (!!config.thumbs && !!config.thumbs.ref) {
					config.thumbs.swiper = $(config.thumbs.ref).data(DATA_KEY);
				}

				var component = new window.Swiper(ctn, config);

				component.on({
					sliderMove: function() {
						component.allowClick = false;
					},
					transitionEnd: function() {
						component.allowClick = true;
					}
				});

				scope.data(DATA_KEY, component);
			});
		};

		var reset = function () {
			var obj = scope.data(DATA_KEY);
			return obj.slideTo(0, 0, false);
		};

		return {
			init: init,
			reset: reset
		};
	});

})(jQuery, jQuery(window));
