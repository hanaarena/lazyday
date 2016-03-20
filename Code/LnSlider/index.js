(function (window, document) {
  'use strict';

  function LnSlider(ele, opt) {
    this.options = opt;
    this.container = document.querySelector(ele);
    this.slider = this.container.children[0];
    this.items = this.slider.children;
    this.itemWidth = this.items[0].offsetWidth;
    this.currentPostion = 0;
    this.effect = opt.effect == 'fade' ? 'fade' : 'slide';

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
      throw 'Should both include prev & next Nav control elements!';
    }

    if (opt.autoplay) {
      this.autoplay();
    }

    if (opt.dot) {
      this.addDots();
    }

    if (opt.dotHover) {
      var eles = document.querySelector('.dot').children;

      for (var i = 0, len = eles.length; i < len; i++) {
        var that = this;
        eles[i].addEventListener('mouseover', function (e) {
          e.preventDefault();

          if (that.options.autoplay) {
            clearInterval(that.nInterval);
            that.autoplay();
          }

          that.currentPostion = e.target.getAttribute('data-id') - 1;

          if (that.effect == 'fade') {
            for (var n = 0, lens = that.items.length; n < lens; n++) {
              if (n == that.currentPostion) { continue;}
              that.fadeOut(n)
            }

            that.fadeIn(that.currentPostion);
          } else {
            that.slideTo(that.currentPostion, that.effect);
          }
        });
      }
    }

    // Set slider effect for each slide
    for (var i = 0, len = this.items.length; i < len; i++) {
      this.items[i].className += opt.effect ? opt.effect : 'slide';
    }
  }

  var helper = {
    removeClass: function (className) {
      var eles = document.querySelectorAll('.'+className);
      [].forEach.call(eles, function (el) {
        // Link: http://stackoverflow.com/a/494046/1909011
        el.className = el.className.replace(new RegExp(className), '');
      });
    }
  }

  LnSlider.prototype.prev = function () {
    if (this.options.autoplay) {
      clearInterval(this.nInterval);
      this.autoplay();
    }

    if (this.currentPostion == 0) {
      this.currentPostion = this.items.length - 1;
      this.slideTo(this.items.length - 1, this.effect, true, true);
    } else {
      this.currentPostion--;
      this.slideTo(this.currentPostion, this.effect, true);
    }
  };

  LnSlider.prototype.next = function () {
    if (this.options.autoplay) {
      clearInterval(this.nInterval);
      this.autoplay();
    }

    if (this.currentPostion == this.items.length - 1) {
      this.currentPostion = 0;
      this.slideTo(0, this.effect, false, true);
    } else {
      this.currentPostion++;
      this.slideTo(this.currentPostion, this.effect);
    }
  }

  LnSlider.prototype.slideTo = function (pos, effect, isPrev, isLast) {
    if (effect == 'fade') {
      // Condition for prev/next click when at last position
      var _pos = isLast ? this.items.length - 1 : (isPrev ? pos + 1 : pos -1);

      this.fadeOut(_pos);
      this.fadeIn(pos);
    } else {
      console.info('position: ' + this.currentPostion);

      var targetPos = this.getTargetPos(pos);
      console.info('target position: ' + targetPos);

      this.slider.style.right = targetPos + 'px';
    }

    if (this.options.dot) {
      helper.removeClass('cur');
      var eles = document.querySelector('.dot').children;
      eles[pos].className += 'cur';
    }
  }

  // Get target position to set the `right` value
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
        that.slideTo(0, that.effect, false, true);
      } else {
        that.slideTo(that.currentPostion, that.effect);
      }
    }, 1000);
  }

  // Next element to fade in
  LnSlider.prototype.fadeIn = function (index) {
    var element = this.items[index];
    element.style.opacity = 0;

    var last = +new Date();
    var tick = function () {
      element.style.opacity = +element.style.opacity + (new Date() - last) / 400;
      last = +new Date();

      if (+element.style.opacity < 1) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
      }
    };

    tick();
  }

  // Current element to fade out
  LnSlider.prototype.fadeOut = function (index) {
    var element = this.items[index];
    element.style.opacity = 1;

    var last = +new Date();
    var tick = function () {
      element.style.opacity = +element.style.opacity - (new Date() - last) / 400;
      last = +new Date();

      if (+element.style.opacity > 0) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
      }
    }

    tick();
  }

  LnSlider.prototype.addDots = function () {
    var dotContainer = document.createElement('div');
    var dotFloat = this.options.dotFloat ? this.options.dotFloat : 'center';
    dotContainer.className = 'dot';

    // Set dot list float: left | center | right
    switch (dotFloat) {
      case 'left':
        dotContainer.className += ' float-left';
        break;
      case 'right':
        dotContainer.className += ' float-right';
        break;
      default:
        break;
    }

    // Generate dot element list
    for (var i = 0, len = this.items.length; i < len; i++) {
      var spanEle = document.createElement('span');
      spanEle.setAttribute('data-id', i+1);
      i === 0 && (spanEle.className = 'cur');
      dotContainer.appendChild(spanEle);
    }

    this.container.appendChild(dotContainer);
  }

  window.LnSlider = LnSlider;
}(window, document));
