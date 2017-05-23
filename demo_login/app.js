(function(w, d) {

	var animationed = true;
	var currentIdx = 0;
	var animationTime;

	var ACTIVE_CLASS_NAME = 'active';
	var CHILD_ANIMATION_TIME = 1000;
	var DEACTIVE_ANIMATION_DURATION = 1000;

	var ANIMATION_TYPE = {
		UP: 0,
		DOWN: 1,
	}

	function getContainers() {
		return Array.prototype.slice.call(document.querySelectorAll('.container'));
	}

	function getChildren(el) {
		return Array.prototype.slice.call(el.querySelectorAll('.child'));
	}

	function getAnimationIndex(el) {
		return el.dataset['index'] * 1;
	}

	function sortChildrenByIndex(el) {
		var childrenByIdx = [];
		getChildren(el).map(function (child) {
			var animationIndex = getAnimationIndex(child) - 1;
			if( !childrenByIdx[animationIndex] ) {
				childrenByIdx[animationIndex] = [];
			}
			childrenByIdx[animationIndex].push(child);
		});
		return childrenByIdx;
	}

	function getClassNames(el) {
		return el.className.split(' ');
	}

	function addClassName(el, className) {
		var newClassNames = getClassNames(el);
		if( newClassNames.indexOf(className) === -1 ) {
			newClassNames.push(className);
			el.className = newClassNames.join(' ');
		}
	}

	function removeClassName(el, className) {		
		var newClassNames = getClassNames(el);
		if( newClassNames.indexOf(className) > -1 ) {
			newClassNames.splice( newClassNames.indexOf(className), 1 );
			el.className = newClassNames.join(' ');
		}
	}

	function scrollListener(e) {
		if( animationed ) {	
			if( e.wheelDelta < 0 ) {
				scrollDown();
			} else {
				scrollUp();
			}
		}
	}

	function scrollUp() {
		var containers = getContainers();
		if( currentIdx > 0) {

			animationed = false;
			setTimeout(function() {
				animationed = true;
			}, animationTime[currentIdx]);

			toggleContainer(ANIMATION_TYPE.DOWN);
		}
	}
	function scrollDown() {
		var containers = getContainers();
		if( currentIdx < containers.length - 1) {

			animationed = false;
			setTimeout(function() {
				animationed = true;
			}, animationTime[currentIdx]);

			toggleContainer(ANIMATION_TYPE.UP);
		}
	}

	function toggleContainer(type) {
		var containers = getContainers();

		deactive(containers[currentIdx], type);
		if( type === ANIMATION_TYPE.UP) {
			active(containers[++currentIdx], type);	
		} else {
			active(containers[--currentIdx], type);	
		}
	}

	function deactive(el, type) {

		removeClassName(el, ACTIVE_CLASS_NAME);
		el.style.zIndex = 1;
		el.style.opacity = 0;
		if( type === ANIMATION_TYPE.UP ) {
			el.style.transformOrigin = 'top';
			el.style.transform = 'perspective(1000px) rotateX(-90deg) scale3d(0.8, 0.8, 1)';
		} else {
			el.style.transformOrigin = 'bottom';
			el.style.transform = 'perspective(1000px) rotateX(90deg) scale3d(0.8, 0.8, 1)';
		}

		setTimeout(function() {
			el.style.zIndex = 2;
			el.style.opacity = 1;
			el.style.transition = 'none';
			el.style.transformOrigin = 'center';
			if( type === ANIMATION_TYPE.UP ) {
				el.style.transform = 'translate3d(0, -100%, 0)';
			} else {
				el.style.transform = 'translate3d(0, 100%, 0)';
			}

			getChildren(el).map(function(child) {
				if( child.dataset.to ) {
					addClassName(child, 'to-' + child.dataset.to);
				}
			});

		}, DEACTIVE_ANIMATION_DURATION)
	}
	function active(el, type) {		

		el.style.zIndex = 2;
		el.style.transition = 'all ' + (DEACTIVE_ANIMATION_DURATION / 1000) + 's';
		el.style.transform = 'translate3d(0, 0, 0)';
		addClassName(el, ACTIVE_CLASS_NAME);

		var childrenByIndex = sortChildrenByIndex(el);

		setTimeout(function() {
			el.style.zIndex = 1;

			childrenByIndex.map( function(children, idx) {
				setTimeout(function() {
					children.map(function(child) {
						if( child.dataset.to ) {
							removeClassName(child, 'to-' + child.dataset.to);
						}
					});
				}, idx * CHILD_ANIMATION_TIME * 0.8 );
			} );

		}, DEACTIVE_ANIMATION_DURATION);
	}

	function init() {
		var containers = getContainers();
		containers.map(initTransition);
		animationTime = containers.map(calcAnimationTime);
	}

	function initTransition(el) {
		if( el.dataset.to ) {
			addClassName(el, 'to-' + el.dataset.to);
		}
		el.style.transition = 'all ' + (DEACTIVE_ANIMATION_DURATION / 1000) + 's';
		getChildren(el).map(initTransition);
	}

	function calcAnimationTime(container) {
		return Math.max.apply(Math, getChildren(container).map(getAnimationIndex) ) * CHILD_ANIMATION_TIME * 0.8 + DEACTIVE_ANIMATION_DURATION;
	}

	init();
	active(getContainers()[currentIdx], ANIMATION_TYPE.UP);

	if(d.addEventListener){
		d.addEventListener('DOMMouseScroll', scrollListener, false);
	}
	w.onmousewheel = d.onmousewheel = scrollListener;

})(window, document);