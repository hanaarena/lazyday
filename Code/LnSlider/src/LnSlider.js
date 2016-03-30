(function (window, document) {
  'use strict';

  function LnSlider(ele, opt) {
    this.options = opt;
    this.container = document.querySelector(ele);
    this.slider = this.container.children[0];
    this.items = this.slider.children;
    this.itemWidth = this.items[0].offsetWidth;
    this.currentPosition = 0;
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
        // Handle fast nav control click: offset-right is between `-item-width`~0
        if (parseInt(that.items[0].style.right) < 0 && parseInt(that.items[0].style.right) > -that.itemWidth) {
          that.items[0].style.right = that.items[1].style.right = '0';
        } else {
          that.prev();
        }
      });
      opt.next.addEventListener('click', function (e) {
        e.preventDefault();
        // Handle fast nav control click: offset-right is between 0~`item-width`
        if (parseInt(that.items[2].style.right) > 0 && parseInt(that.items[2].style.right) < that.itemWidth) {
          that.items[1].style.right = that.items[2].style.right = '0';
        } else {
          that.next();
        }
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

    if (opt.effect === 'slide') {
      // Move the last item to first position to prevent when user click `prev` at begin
      helper.moveToFirst(this.items);
    }

    if (opt.dotHover) {
      var elems = document.querySelector('.dot').children;

      for (var i = 0, len = elems.length; i < len; i++) {
        var that = this;
        elems[i].addEventListener('mouseover', function (e) {
          e.preventDefault();

          if (that.options.autoplay) {
            clearInterval(that.nInterval);
            that.autoplay();
          }

          that.currentPosition = e.target.getAttribute('data-id') - 1;

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
    }

    // Set slider effect for each slide
    for (var i = 0, len = this.items.length; i < len; i++) {
      this.items[i].className += opt.effect ? opt.effect : 'slide';
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
    }else {
      console.info('position: ' + this.currentPosition);
      /** When complete slide to the target element, we should reset the animation,and
       *  set the slider's spec item(index 1 & 2) offset-right to item's width.
       *  finally,remove the first element to the last(don't forget remove the original)
       *  so we can get the effect like `infinite loop`.
       */
      var that = this;
      var stepLength = 5.2345;
      var itemWidth = 0;
      var sliding = null;
      if (isPrev) {
        sliding = setInterval(function () {
          itemWidth -= stepLength;
          /**
           *  Previous control is index `0 and 1` slide from right to left
           */
          that.items[0].style.right = that.items[1].style.right = itemWidth + 'px';

          if (itemWidth < -that.itemWidth) {
            that.items[0].style.right = that.items[1].style.right = 0;
            clearInterval(sliding);
            helper.moveToFirst(that.items);
          }
        }, 1);
      } else {
        sliding = setInterval(function () {
          itemWidth += stepLength;
          /**
           *  Next control is index `0 and 1` slide from left to right
           */
          that.items[1].style.right = that.items[2].style.right  = itemWidth + 'px';

          if (itemWidth > that.itemWidth) {
            that.items[1].style.right = that.itemWidth + 'px';
            that.items[2].style.right = 0;
            clearInterval(sliding);
            helper.moveToLast(that.items);
          }
        }, 1);
      }
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
