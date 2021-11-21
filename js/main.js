jQuery(document).ready(function ($) {
	var number = 0;
	var lastnumber = 0;
	var newlength = 0;
	var last = false;
	//cache DOM elements
	var projectsContainer = $('.cd-projects-container'),
		projectsPreviewWrapper = projectsContainer.find('.cd-projects-previews'),
		projectPreviews = projectsPreviewWrapper.children('li'),
		projects = projectsContainer.find('.cd-projects'),
		navigationTrigger = $('.cd-nav-trigger'),
		navigation = $('.cd-primary-nav'),
		//if browser doesn't support CSS transitions...
		transitionsNotSupported = ($('.no-csstransitions').length > 0);
	var menu = $('.menu')
	var animating = false,
		//will be used to extract random numbers for projects slide up/slide down effect
		numRandoms = projects.find('li').length,
		uniqueRandoms2 = [],
		uniqueRandoms = [];

	//open project
	projectsPreviewWrapper.on('click', 'a', function (event) {

		event.preventDefault();
		if (animating == false) {
			animating = true;
			navigationTrigger.add(projectsContainer).addClass('project-open');
			openProject($(this).parent('li'));
		}
	});

	navigationTrigger.on('click', function (event) {
		event.preventDefault();
		if (animating == false) {
			animating = true;
			if (navigationTrigger.hasClass('project-open')) {
				//close visible project
				navigationTrigger.add(projectsContainer).removeClass('project-open');
				closeProject();
			} else if (navigationTrigger.hasClass('nav-visible')) {
				number = $(this).attr('href').replace('#', '')
				lastnumber = 0
				newlength = 0
				projectPreviews.each(function () {
					if ($(this).children('a').attr('href') != '#' + number) {
						if (newlength == 0) { lastnumber += 1; }
						$(this).css({
							'flex': '0 0 0%'
						})
					} else {
						newlength++;
						lastnumber += 1;
						$(this).css({
							'flex': '1 0 0%'
						})
					}
				})
				menu.each(function () {
					$(this).css({
						'opacity': 1
					})
				})
				$('.btn-for-menu').css({
					'opacity': 1
				})
				//close main navigation
				navigationTrigger.removeClass('nav-visible');
				navigation.removeClass('nav-clickable nav-visible');
				if (transitionsNotSupported) projectPreviews.removeClass('slide-out');
				else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
			} else {
				menu.each(function () {
					$(this).css({
						'opacity': 0
					})
				})
				$('.btn-for-menu').css({
					'opacity': 0
				})
				//open main navigation
				navigationTrigger.addClass('nav-visible');
				navigation.addClass('nav-visible');
				// navigation.addClass('nav-clickable');
				if (transitionsNotSupported) projectPreviews.addClass('slide-out');
				else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, true);
			}
		}

		if (transitionsNotSupported) animating = false;
	});

	//scroll down to project info
	projectsContainer.on('click', '.scroll', function () {
		projectsContainer.animate({ 'scrollTop': $(window).height() }, 500);
	});

	//check if background-images have been loaded and show project previews
	projectPreviews.children('a').bgLoaded({
		afterLoaded: function () {
			showPreview(projectPreviews.eq(0));
		}
	});

	function showPreview(projectPreview) {
		if (projectPreview.length > 0) {
			setTimeout(function () {
				projectPreview.addClass('bg-loaded');
				showPreview(projectPreview.next());
			}, 150);
		}
	}

	function openProject(projectPreview) {
		var projectIndex = projectPreview.index();
		projects.children('li').eq(projectIndex).add(projectPreview).addClass('selected');

		if (transitionsNotSupported) {
			projectPreviews.addClass('slide-out').removeClass('selected');
			projects.children('li').eq(projectIndex).addClass('content-visible');
			animating = false;
		} else {
			slideToggleProjects(projectPreviews, projectIndex, 0, true);
		}
	}

	function closeProject() {
		projects.find('.selected').removeClass('selected').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
			$(this).removeClass('content-visible').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
			slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
		});

		//if browser doesn't support CSS transitions...
		if (transitionsNotSupported) {
			projectPreviews.removeClass('slide-out');
			projects.find('.content-visible').removeClass('content-visible');
			animating = false;
		}
	}

	function slideToggleProjects(projectsPreviewWrapper, projectIndex, index, bool) {
		if (index == 0) { createArrayRandom(); createArrayRandom2(); last = false }
		if (projectIndex != -1 && index == 0) index = 1;

		var randomProjectIndex = makeUniqueRandom();
		if (randomProjectIndex == projectIndex) randomProjectIndex = makeUniqueRandom();

		var randomProjectIndex2 = makeUniqueRandom2();
		if (0 !== uniqueRandoms2.length) {
			projectsPreviewWrapper.eq(randomProjectIndex2).toggleClass('slide-out', bool);
			setTimeout(function () {
				// animate next preview project
				slideToggleProjects(projectsPreviewWrapper, projectIndex, index + 1, bool);
			}, 150);
		} else if (0 == uniqueRandoms2.length) {
			// this is the last project preview to be animated 
			projectsPreviewWrapper.eq(randomProjectIndex2).toggleClass('slide-out', bool).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
				if (projectIndex != -1) {
					projects.children('li.selected').addClass('content-visible');
					projectsPreviewWrapper.eq(projectIndex).addClass('slide-out').removeClass('selected');
				} else if (navigation.hasClass('nav-visible') && bool) {
					navigation.addClass('nav-clickable');
				}
				projectsPreviewWrapper.eq(randomProjectIndex2).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				animating = false;
			});
		}
		// if (index < numRandoms - 1) {
		// 	projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool);
		// 	setTimeout(function () {
		// 		// animate next preview project
		// 		slideToggleProjects(projectsPreviewWrapper, projectIndex, index + 1, bool);
		// 	}, 150);
		// } else if (index == numRandoms - 1) {
		// 	// this is the last project preview to be animated 
		// 	projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
		// 		if (projectIndex != -1) {
		// 			projects.children('li.selected').addClass('content-visible');
		// 			projectsPreviewWrapper.eq(projectIndex).addClass('slide-out').removeClass('selected');
		// 		} else if (navigation.hasClass('nav-visible') && bool) {
		// 			navigation.addClass('nav-clickable');
		// 		}
		// 		projectsPreviewWrapper.eq(randomProjectIndex).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
		// 		animating = false;
		// 	});
		// }
	}

	//http://stackoverflow.com/questions/19351759/javascript-random-number-out-of-5-no-repeat-until-all-have-been-used
	function makeUniqueRandom() {
		var index = Math.floor(Math.random() * uniqueRandoms.length);
		var val = uniqueRandoms[index];
		// now remove that value from the array
		uniqueRandoms.splice(index, 1);
		return val;
	}

	function createArrayRandom() {
		//reset array
		uniqueRandoms.length = 0;
		for (var i = 0; i < numRandoms; i++) {
			uniqueRandoms.push(i);
		}
	}
	function makeUniqueRandom2() {
		var index = Math.floor(Math.random() * uniqueRandoms2.length);
		var val = uniqueRandoms2[index];
		// now remove that value from the array
		uniqueRandoms2.splice(index, 1);
		return val;
	}

	function createArrayRandom2() {
		//reset array
		uniqueRandoms2.length = 0;
		for (var i = 0; i < newlength; i++) {
			uniqueRandoms2.push(lastnumber - newlength + i);
		}
	}
	slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, true);
});

/*
* BG Loaded
* Copyright (c) 2014 Jonathan Catmull
* Licensed under the MIT license.
*/
(function ($) {
	$.fn.bgLoaded = function (custom) {
		var self = this;

		// Default plugin settings
		var defaults = {
			afterLoaded: function () {
				this.addClass('bg-loaded');
			}
		};

		// Merge default and user settings
		var settings = $.extend({}, defaults, custom);

		// Loop through element
		self.each(function () {
			var $this = $(this),
				bgImgs = $this.css('background-image').split(', ');
			$this.data('loaded-count', 0);
			$.each(bgImgs, function (key, value) {
				var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
				$('<img/>').attr('src', img).load(function () {
					$(this).remove(); // prevent memory leaks
					$this.data('loaded-count', $this.data('loaded-count') + 1);
					if ($this.data('loaded-count') >= bgImgs.length) {
						settings.afterLoaded.call($this);
					}
				});
			});

		});
	};
})(jQuery);