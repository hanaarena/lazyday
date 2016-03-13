(function (window, document) {
	'use strict';

	// Contructor
	function LnSlider(ele, opt) {
		this.options = opt;
		this.container = document.querySelector(ele);
		this.containerWidth = this.container.offsetWidth;
		this.slider = this.container.children[0];
		this.items = this.slider.children;
		this.itemWidth = this.items[0].offsetWidth;
		this.currentPostion = 0;

		if (opt.prev && opt.next) {
			var that = this;

			opt.prev = document.querySelector(opt.prev);
			opt.next = document.querySelector(opt.next);
			opt.prev.addEventListener('click', function (e) {
				e.preventDefault();
				that.prev();
			})
			opt.next.addEventListener('click', function (e) {
				e.preventDefault();
				that.next();
			})
		}
	}

	LnSlider.prototype.prev = function () {
		if (this.currentPostion == 0) {
			this.slideTo(this.items.length - 1);
		} else {
			this.slideTo(this.currentPostion - 1);
		}
	};

	LnSlider.prototype.next = function () {
		if (this.currentPostion == this.items.length - 1) {
			this.slideTo(0);
		} else {
			this.slideTo(this.currentPostion + 1);
		}
	}

	LnSlider.prototype.slideTo = function (pos) {
		console.info('positon: ' + pos);
		
		var targetPos = this.getTargetPos(pos);
		console.info('targetPos: ' + targetPos);
		var direction = this.currentPostion > pos ? 1 : -1;

		this.slider.style.right = targetPos + 'px';
	}

	LnSlider.prototype.getTargetPos = function (pos) {
		var currentPos, targetPos;
		currentPos = this.slider.style.right;
		if (currentPos) currentPos = parseInt(currentPos);
		console.info('currentPos: ' + currentPos);

		targetPos = currentPos + this.itemWidth * pos;

		return targetPos;
	}

	window.LnSlider = LnSlider;
}(window, document));

