<template>
  <slider :control="true" :dot="true" :auto="true" dot-float="center">
    <slide v-for="item in items">
      <li>
        <div>{{ $index }}</div>
      </li>
    </slide>
  </slider>
</template>

<script>
  import slider from './slider'
  import slide from './slide'

  export default {
    data: function () {
      return {
        items: ['one', 1, 2]
      }
    },
    components: {
      'slider': slider,
      'slide': slide
    }
  }
</script>