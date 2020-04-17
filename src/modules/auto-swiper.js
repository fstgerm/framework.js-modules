/**
 * @author Deux Huit Huit
 *
 * Auto swiper module
 *
 * <div class="js-auto-swiper">
 *   <div class="js-auto-swiper-ctn">
 *     <div class="js-auto-swiper-wrapper">
 *       <div class="js-auto-swiper-slide"></div> (repeat)
 *      </div>
 *    </div>
 *    <div class="js-auto-swiper-scrollbar"></div> (optional)
 *    <div class="js-auto-swiper-pagination"></div> (optional)
 *    <div class="js-auto-swiper-navigation-previous"></div> (optional)
 *    <div class="js-auto-swiper-navigation-next"></div> (optional)
 * </div>
 *
 * http://idangero.us/swiper/api
 *
 * @requires https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.1/js/swiper.min.js
 * @requires src/com/swiper.js
 */
(function ($, undefined) {

	'use strict';

	var page = $('.page');
	var site = $('#site');

	var sels = {
		element: '.js-auto-swiper',
		ctn: '.js-auto-swiper-ctn',
		wrapper: '.js-auto-swiper-wrapper',
		slide: '.js-auto-swiper-slide',
		scrollbar: '.js-auto-swiper-scrollbar',
		navigationPrev: '.js-auto-swiper-navigation-previous',
		navigationNext: '.js-auto-swiper-navigation-next',
		pagination: '.js-auto-swiper-pagination',
		preventClick: '.js-auto-swiper-prevent-click'
	};

	var attrs = {
		thumbs: {
			ref: 'data-swiper-thumbs-ref'
		}
	};

	var DATA_KEY = 'swpr';

	var initAll = function () {
		var swipers = page.find(sels.element).sort(function (a, b) {
			return $(b).attr(attrs.thumbs.ref) ? -1 : 1;
		});

		swipers.each(function () {
			var element = $(this);
			var swiper = element.data(DATA_KEY);

			if (!swiper) {
				var comp = App.components.create('swiper', sels);
				comp.init(element);
				element.data(DATA_KEY, comp);
			}
		});
	};

	var pageEnter = function (key, data) {
		page = $(data.page.key());
		initAll();
	};

	var pageLeave = function (key, data) {
		page = $();
	};

	var onArticleEntering = function () {
		initAll();
	};

	var onPreventClickClick = function(event) {
		var element = $(this).parents(sels.element);

		if (!element.data(DATA_KEY).allowClick) {
			window.pd(event, true);
		}
	};

	var init = function() {
		site.on(App.device.events.click, sels.preventClick, onPreventClickClick);
	};

	var actions = function () {
		return {
			page: {
				enter: pageEnter,
				leaving: pageLeave
			},
			articleChanger: {
				entering: onArticleEntering
			}
		};
	};

	App.modules.exports('auto-swiper', {
		init: init,
		actions: actions
	});

})(jQuery);
