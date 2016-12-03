(function(global, $) {

	var HOME_TOP = 0, 
		ABOUT_US_TOP, SERVICES_TOP, EMPLOYEE_TOP, REPUTATION_TOP, CONTACT_US_TOP;

	function scrollTo() {
		var scrollTop = '0px',
			ref = $(this).attr('data-ref');

		if(ref && ref !== 'home' && $('#' + ref).length === 1) {
			scrollTop = $('#' + ref).offset().top + 'px';
		}
		$('html,body').animate({scrollTop: scrollTop}, 500);
	}

	function onScroll() {
		highlightScrollTool();
		showSquare();
		showServices();
		changeParallax();
	}

	function highlightScrollTool(ref) {
		var ref = 'home',
		toolItems = $('.scroll-tool li'),
		scrollTop = $(this).scrollTop();

		if( scrollTop > parseInt(CONTACT_US_TOP) ) {
			ref = 'contact_us';
		} else if( scrollTop > parseInt(REPUTATION_TOP) ) {
			ref = 'reputation';
		} else if( scrollTop > parseInt(EMPLOYEE_TOP) ) {
			ref = 'employee';
		} else if( scrollTop > parseInt(SERVICES_TOP) ) {
			ref = 'services';
		} else if( scrollTop > parseInt(ABOUT_US_TOP) ) {
			ref = 'about_us';
		}

		for(var i = 0; i < toolItems.length; i++) {
			var toolItem = toolItems[i];
			var circle = $(toolItem).children();
			var hasSelected = circle.hasClass('selected');
			if($(toolItem).attr('data-ref') === ref) {
				if( !hasSelected ) {
					circle.addClass('selected');
				}
			} else {
				if( hasSelected ) {
					circle.removeClass('selected');
				}
			}
		}
	}

	function showSquare() {
		var scrollTop = $(this).scrollTop(),
		clientHeight = document.documentElement.clientHeight;

		$('.square.will-mount').each(function() {
			if( scrollTop + clientHeight > $(this).offset().top + 680/*margin top,init top*/ ) {
				$(this).removeClass('will-mount');
			}
		});
	}

	function showServices() {
		var scrollTop = $(this).scrollTop(),
		clientHeight = document.documentElement.clientHeight;

		$('.services-item.will-mount').each(function() {
			if( scrollTop + clientHeight > $(this).offset().top + 200/*dom height*/ ) {
				$(this).removeClass('will-mount');
			}
		});
	}

	function changeParallax() {
		var scrollTop = $(this).scrollTop(),
		clientHeight = document.documentElement.clientHeight,
		parallax = $('.parallax'),
		parallaxHeight = parallax.height(),
		parallaxOffsetTop = parallax.offset().top,
		imageHeight = parallax.children('.layer').height(),

		startTop = parallaxOffsetTop - clientHeight,
		endTop = parallaxOffsetTop + parallaxHeight;
		parallaxToTop = scrollTop + clientHeight - parallaxOffsetTop;
		if( startTop < scrollTop && scrollTop < endTop ) {
			// console.log((scrollTop - startTop));
			var imageOffset = (imageHeight / 2 + clientHeight - imageHeight) * 
								(scrollTop - startTop) /
								(1.75*(endTop - startTop + clientHeight));
			// if(imageOffset > imageHeight - parallaxHeight) {
			// 	imageOffset = imageHeight - parallaxHeight;
			// }
			parallax.children('.layer').css('bottom', imageOffset)
		}

	}

	function switchGallery() {
		var galleryContent = $('.gallery-content');
		var selectedItem = galleryContent.children('.selected');
		var nextItem = selectedItem.next();
		selectedItem.removeClass('selected');
		if(nextItem && nextItem.length > 0) {
			nextItem.addClass('selected');
		} else {
			galleryContent.children(':first-child').addClass('selected');
		}
	}

	$(global.document).ready(function() {
		ABOUT_US_TOP = $('#about_us').offset().top;
		SERVICES_TOP = $('#services').offset().top;
		EMPLOYEE_TOP = $('#employee').offset().top;
		REPUTATION_TOP = $('#reputation').offset().top;
		CONTACT_US_TOP = $('#contact_us').offset().top;

		$('.scroll-tool li').click(scrollTo);
		$('.menu .menu-item').click(scrollTo);

		$(global).scroll(onScroll);

		setInterval(switchGallery, 5000);

		// $('.parallax').parallax();
	});

})(window, $);