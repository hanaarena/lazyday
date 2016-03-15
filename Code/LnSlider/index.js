(function (window, document) {
  'use strict';

  // Contructor
  function LnSlider(ele, opt) {
    this.options = opt;
    this.container = document.querySelector(ele);
    this.slider = this.container.children[0];
    this.items = this.slider.children;
    this.itemWidth = this.items[0].offsetWidth;
    this.currentPostion = 0;

    // Use for cancels repeated action which was set up using setInterval.
    this.nInterval;

    if (opt.prev && opt.next) {
      var that = this;

      opt.prev = document.querySelector(opt.prev);
      opt.next = document.querySelector(opt.next);

      opt.next.style.display = opt.prev.style.display = 'block';

      opt.prev.addEventListener('click', function (e) {
        e.preventDefault();
        that.prev();
      });
      opt.next.addEventListener('click', function (e) {
        e.preventDefault();
        that.next();
      });
    } else if (opt.prev || opt.next) {
      throw "Should both include prev & next Nav control elements!"
    }

    if (opt.autoplay) {
      this.autoplay();
    }
  }

  LnSlider.prototype.prev = function () {
    if (this.options.autoplay) {
      clearInterval(this.nInterval);
      this.autoplay();
    }

    if (this.currentPostion == 0) {
      this.currentPostion = this.items.length - 1;
      this.slideTo(this.items.length - 1);
    } else {
      this.currentPostion--;
      this.slideTo(this.currentPostion);
    }
  };

  LnSlider.prototype.next = function () {
    if (this.options.autoplay) {
      clearInterval(this.nInterval);
      this.autoplay();
    }

    if (this.currentPostion == this.items.length - 1) {
      this.currentPostion = 0;
      this.slideTo(0);
    } else {
      this.currentPostion++;
      this.slideTo(this.currentPostion);
    }
  }

  LnSlider.prototype.slideTo = function (pos) {
    console.info('positon: ' + this.currentPostion);

    var targetPos = this.getTargetPos(pos);
    console.info('targetPos: ' + targetPos);

    this.slider.style.right = targetPos + 'px';
  }

  LnSlider.prototype.getTargetPos = function (pos) {
    var targetPos;
    targetPos = this.itemWidth * pos;

    return targetPos;
  }

  LnSlider.prototype.autoplay = function () {
    var that = this;
    this.nInterval = setInterval(function() {
      that.currentPostion++;
      if (that.currentPostion == that.items.length) {
        that.currentPostion = 0;
      }
      that.slideTo(that.currentPostion);
    }, 1000);
  }

  window.LnSlider = LnSlider;
}(window, document));
