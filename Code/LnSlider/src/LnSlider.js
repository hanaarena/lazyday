(function (window, document) {
  'use strict';

  function LnSlider(ele, opt) {
    this.options = opt;
    this.container = document.querySelector(ele);
    this.slider = this.container.children[0];
    this.items = this.slider.children;
    this.itemWidth = this.items[0].offsetWidth;
    this.currentPosition = 0;
    this.previousPosition = 0;
    this.effect = opt.effect == 'fade' ? 'fade' : 'slide';

    // Use for cancels repeated action which was set up using setInterval.
    this.nInterval;

    // Set slider effect for each slide
    for (var i = 0, len = this.items.length; i < len; i++) {
      this.items[i].className += opt.effect ? opt.effect : 'slide';
    }

    if (opt.prev && opt.next) {
      var that = this;

      opt.prev = document.querySelector(opt.prev);
      opt.next = document.querySelector(opt.next);

      opt.next.style.display = opt.prev.style.display = 'block';

      opt.prev.addEventListener('click', function (e) {
        e.preventDefault();
        // Handle fast nav control click: offset-right is between `-item-width`~0
        if (parseInt(that.items[that.previousPosition].style.right) < 0 && parseInt(that.items[that.previousPosition].style.right) > -that.itemWidth) {
          return;
        } else {
          that.prev();
        }
      });
      opt.next.addEventListener('click', function (e) {
        e.preventDefault();
        // Handle fast nav control click: offset-right is between 0~`item-width`
        if (parseInt(that.items[that.currentPosition].style.right) < 0 && parseInt(that.items[that.previousPosition].style.right) > -that.itemWidth) {
          return;        
        } else {
          that.next();
        }
      });
    } else if (opt.prev || opt.next) {
      throw new Error('Should both include prev & next Nav control elements!');
    }

    if (opt.autoplay) {
      this.autoplay();
    }

    if (opt.dot) {
      this.addDots();
    }

    if (opt.effect === 'slide' && !opt.dot) {
      // Move the last item to first position to prevent when user click `prev` at begin
      helper.moveToFirst(this.items);
    }

    if (opt.dot && opt.dotClick) {
      var elems = document.querySelector('.dot').children;

      for (var i = 0, len = elems.length; i < len; i++) {
        this.previousPosition = this.currentPosition;

        if (opt.effect !== 'fade') this.items[i].style.right = '-' + this.itemWidth + 'px';

        var that = this;

        elems[i].addEventListener('click', function (e) {
          e.preventDefault();

          // Handle fast nav control click: offset-right is between 0~`item-width`
          if (parseInt(that.items[that.previousPosition].style.right) < 0  || parseInt(that.items[that.currentPosition].style.right) < 0 && parseInt(that.items[that.previousPosition].style.right) > -that.itemWidth) {
            return;
          }

          if (that.currentPosition === e.target.getAttribute('data-id') - 1) {
            return;
          } else {
            that.currentPosition = e.target.getAttribute('data-id') - 1;
          }

          if (that.options.autoplay) {
            clearInterval(that.nInterval);
            that.autoplay();
          }

          if (that.effect == 'fade') {
            for (var n = 0, lens = that.items.length; n < lens; n++) {
              if (n == that.currentPosition) { continue;}
              that.fadeOut(n);
            }

            that.fadeIn(that.currentPosition);
          } else {
            that.slideTo(that.currentPosition, that.effect);
          }
        });
      }

      if (opt.effect === 'slide') {
        this.items[0].style.right = 0;
      }
    }
  }

  var helper = {
    removeClass: function (className) {
      var elems = document.querySelectorAll('.'+className);
      [].forEach.call(elems, function (elem) {
        // Link: http://stackoverflow.com/a/494046/1909011
        elem.className = elem.className.replace(new RegExp(className), '');
      });
    },
    moveToFirst: function (elem) {
      // Move the last item to the first & set the default offset-right for first item also remove the original
      elem[0].insertAdjacentHTML('beforebegin', elem[elem.length - 1].outerHTML);
      elem[elem.length - 1].remove();
      elem[0].parentElement.style.right = parseInt(elem[0].offsetWidth) + 'px';
    },
    moveToLast: function (elem) {
      // Move the first item to the last & reset the offset-right to 0 cause the slide effect animate is done
      elem[elem.length - 1].insertAdjacentHTML('afterend', elem[0].outerHTML);
      elem[0].remove();
      elem[0].style.right = elem[elem.length - 1].style.right = 0;
    }
  }

  LnSlider.prototype.prev = function () {
    if (this.options.autoplay) {
      clearInterval(this.nInterval);
      this.autoplay();
    }

    if (this.currentPosition == 0) {
      this.currentPosition = this.items.length - 1;
      this.slideTo(this.items.length - 1, this.effect, true, true);
    } else {
      this.currentPosition--;
      this.slideTo(this.currentPosition, this.effect, true);
    }
  };

  LnSlider.prototype.next = function () {
    if (this.options.autoplay) {
      clearInterval(this.nInterval);
      this.autoplay();
    }

    if (this.currentPosition == this.items.length - 1) {
      this.currentPosition = 0;
      this.slideTo(0, this.effect, false, true);
    } else {
      this.currentPosition++;
      this.slideTo(this.currentPosition, this.effect);
    }
  }

  /**
   * Slide to target position with spec effect
   *
   * @param {Number} pos - target position
   * @param {String} effect
   * @param {Boolean} [isPrev=false] - spec for prev operation
   * @param {Boolean} [isLast=false] - when it's last position
   */
  LnSlider.prototype.slideTo = function (pos, effect, isPrev, isLast) {
    if (effect === 'fade') {
      // Condition for prev/next click when at last position
      var _pos = isLast ? this.items.length - 1 : (isPrev ? pos + 1 : pos -1);

      this.fadeOut(_pos);
      this.fadeIn(pos);
    } else {
      /** 
       *  When complete slide to the target element, we should reset the animation(
       *  mean setInterval here),and reset the target & previous position style.
       *  so we can get the effect like `infinite loop`.
       */
      for (var i = 0, len = this.items.length; i < len; i++) {
        this.items[i].className = this.options.effect ? this.options.effect : 'slide';
      }

      // Detect whether slide to right or left: `1` is for `right`(true), `0` is for `left`(false)
      var direction = this.currentPosition > this.previousPosition ? 1 : 0;

      /**
       * When slide from first to last(prev) or from last to first(next), shold change the slide stack z-index or it will be covered,
       * and when the animation end, it will reset to default
       */
      if (isPrev && isLast) {
        direction = 0;
        this.items[0].style.zIndex = 3;
        this.items[this.items.length - 1].style.right = 0;
      } else if (isLast) {
        direction = 1;
        this.items[this.currentPosition].style.zIndex = 3;
      };

      var that = this;
      var stepLength = direction ? 5.2345 : -5.2345;
      var itemWidth = direction ? -this.itemWidth : 0;
      var sliding = null;
      // Handle prev control nav: let the previous slide `display` at first so will have an effect like slide to right
      direction ? '' : this.items[this.currentPosition].style.right = 0

      sliding = setInterval(function () {
        itemWidth += stepLength;
        that.items[direction ? that.currentPosition : that.previousPosition].style.right = itemWidth + 'px';

        if (itemWidth > 0) {
          that.items[that.previousPosition].style.right = -that.itemWidth + 'px';
          that.items[that.currentPosition].style.right = 0;
          that.previousPosition = that.currentPosition;

          // Reset the items[0] z-index,or it will at stack's top 
          if (isLast) that.items[that.currentPosition].style.zIndex = '';

          clearInterval(sliding);
        } else if (itemWidth < -that.itemWidth) {
          that.items[that.previousPosition].style.right = -that.itemWidth + 'px';
          that.previousPosition = that.currentPosition;

          // Reset the items[0] z-index,or it will at stack's top 
          if (isPrev && isLast) that.items[0].style.zIndex = '';

          clearInterval(sliding);
        }
      }, 1);
    }

    if (this.options.dot) {
      helper.removeClass('cur');
      var elems = document.querySelector('.dot').children;
      elems[pos].className += 'cur';
    }
  }

  LnSlider.prototype.autoplay = function () {
    var that = this;
    this.nInterval = setInterval(function() {
      that.currentPosition++;
      if (that.currentPosition == that.items.length) {
        that.currentPosition = 0;
        that.slideTo(0, that.effect, false, true);
      } else {
        that.slideTo(that.currentPosition, that.effect);
      }
    }, 1000);
  }

  /**
   * Next position to fade in
   *
   * @param {Number} index - target position
   */
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

  /**
   * Current position to fade out
   *
   * @param {Number} index - current position
   */
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
