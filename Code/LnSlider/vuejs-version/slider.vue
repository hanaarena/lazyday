<template>
  <div class="wrapper">
    <ul id="slider">
      <slot></slot>
    </ul>
    <span class="prev" id="prev" v-show="control"></span>
    <span class="next" id="next" v-show="control"></span>
  </div>
</template>
<script>
  export default {
    props: {
      control: {
        type: Boolean,
        default: true
      },
      auto: {
        type: Boolean,
        default: false
      },
      effect: {
        type: String,
        default: 'fade'
      },
      dot: {
        type: Boolean,
        default: true
      },
      dotHover: {
        type: Boolean,
        default: true
      },
      dotFloat: {
        type: String,
        default: 'center'
      }
    },
    data () {
      return {
        nInterval: null,
        currentPosition: 0
      }
    },
    ready () {
      if (this.control) {
        const prev = this.container.querySelector('.prev')
        const next = this.container.querySelector('.next')

        prev.addEventListener('click', (e) => {
          e.preventDefault()
          this.prev()
        })
        next.addEventListener('click', (e) => {
          e.preventDefault()
          this.next()
        })
      }

      if (this.auto) {
        this.autoplay()
      }

      if (this.dot) {
        this.addDots()
      }

      if (this.dotHover && this.dot) {
        const eles = this.$el.querySelector('.dot').children

        for (let i = 0, len = eles.length; i < len; i++) {
          eles[i].addEventListener('mouseover', (e) => {
            e.preventDefault()

            if (this.auto) {
              clearInterval(this.nInterval)
              this.autoplay()
            }

            this.currentPosition = e.target.getAttribute('data-id') - 1

            if (this.effect === 'fade') {
              for (let n = 0, lens = this.items.length; n < lens; n++) {
                if (n === this.currentPosition) { continue}
                this.fadeOut(n)
              }

              this.fadeIn(this.currentPosition)
            } else {
              this.slideTo(this.currentPosition, this.effect)
            }
          })
        }
      }

      for (let i = 0, len = this.items.length; i < len; i++) {
        this.items[i].className += this.effect
      }
    },
    computed: {
      container () {
        return this.$el
      },
      slider () {
        return this.container.children[0]
      },
      items () {
        return this.slider.children
      },
      itemsWidth () {
        return this.items[0].offsetWidth
      }
    },
    methods: {
      prev () {
        if (this.auto) {
          clearInterval(this.nInterval)
          this.autoplay()
        }

        if (this.currentPosition === 0) {
          this.currentPosition = this.items.length - 1
          this.slideTo(this.items.length - 1, this.effect, true, true)
        } else {
          this.currentPosition--
          this.slideTo(this.currentPosition, this.effect, true)
        }
      },
      next () {
        if (this.auto) {
          clearInterval(this.nInterval)
          this.autoplay()
        }

        if (this.currentPosition === this.items.length - 1) {
          this.currentPosition = 0
          this.slideTo(0, this.effect, false, true)
        } else {
          this.currentPosition++
          this.slideTo(this.currentPosition, this.effect)
        }
      },
      slideTo (pos, effect, isPrev, isLast) {
        if (effect === 'fade') {
          let _pos = isLast ? this.items.length - 1 : (isPrev ? pos + 1 : pos - 1)

          this.fadeOut(_pos)
          this.fadeIn(pos)
        } else {
          console.info('position: ' + this.currentPosition)

          let targetPos = this.getTargetPos(pos)
          console.info('Target position: ' + targetPos)

          this.slider.style.right = targetPos + 'px'
        }

        if (this.dot) {
          let removeCur = document.querySelectorAll('.cur')
          for (let i of removeCur) {
            i.className = i.className.replace(new RegExp('cur'), '')
          }
          let eles = this.$el.querySelectorAll('.dot')[0].children
          eles[pos].className += 'cur'
        }
      },
      getTargetPos (pos) {
        let targetPos = this.itemsWidth * pos

        return targetPos
      },
      autoplay () {
        this.nInterval = setInterval(() => {
          this.currentPosition++

          if (this.currentPosition === this.items.length) {
            this.currentPosition = 0
            this.slideTo(0, this.effect, false, true)
          } else {
            this.slideTo(this.currentPosition, this.effect)
          }
        }, 1000)
      },
      fadeIn (index) {
        const element = this.items[index]
        element.style.opacity = 0

        let last = +new Date()
        const tick = () => {
          element.style.opacity = +element.style.opacity + (new Date() - last) / 400
          last = +new Date()

          if (+element.style.opacity < 1) {
            setTimeout(tick, 16)
          }
        }

        tick()
      },
      fadeOut (index) {
        const element = this.items[index]
        element.style.opacity = 1

        let last = +new Date()
        const tick = () => {
          element.style.opacity = +element.style.opacity - (new Date() - last) / 400
          last = +new Date()

          if (+element.style.opacity > 0) {
            setTimeout(tick, 16)
          }
        }

        tick()
      },
      addDots () {
        const dotContainer = document.createElement('div')
        const dotFloat = this.dotFloat
        dotContainer.className = 'dot'

        switch (dotFloat) {
          case 'left':
            dotContainer.className += ' float-left'
            break
          case 'right':
            dotContainer.className += ' float-right'
            break
          default:
            break
        }

        for (let i = 0, len = this.items.length; i < len; i++) {
          let spanEle = document.createElement('span')
          spanEle.setAttribute('data-id', i + 1)
          i === 0 && (spanEle.className = 'cur')
          dotContainer.appendChild(spanEle)
        }

        this.container.appendChild(dotContainer)
      }
    }
  }
</script>
<style lang="less">
  .wrapper {
    position: relative;
    width: 650px;
    height: 450px;
    margin: 0 auto;
    overflow: hidden;

    .dot {
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: 10px;

      &.float-left {
        text-align: left;
      }

      &.float-right {
        text-align: right;
      }

      span {
        display: inline-block;
        width: 10px;
        height: 10px;
        overflow: hidden;
        margin-right: 10px;
        border-radius: 20px;
        background: #4a4a4a;
        cursor: pointer;
        opacity: .6;

        &:hover {
          background-color: #4a4a4a;
          opacity: .9;
        }

        &.cur {
          background-color: #4a4a4a;
          opacity: .9;
        }
      }
    }
  }

  .slide {
    position: relative;
    float: left;
  }

  .fade {
    position: fixed;
    opacity: 0;

    &:first-child {
      opacity: 1;
    }
  }

  #slider {
    position: relative;
    width: 1000%;
    right: 0;
    list-style: none;
    overflow: hidden;
    margin: 0;
    padding: 0;
    transition: all .6s ease;

    li {
      width: 650px;

      div {
        width: 650px;
        height: 400px;
        border: 1px solid #4a4a4a;
      }
    }
  }

  .prev, .next {
    position: absolute;
    top: 120px;
    height: 50px;
    width: 30px;
    opacity: 0.6;

    &:hover {
      opacity: .9;
    }
  }

  #prev {
    background: #000 no-repeat center;
    left: 0;
  }

  #next {
    background: #000 no-repeat center;
    right: 0;
  }
</style>