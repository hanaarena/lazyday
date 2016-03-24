## About

This a slider component build with Vue.js

## Usage

Import component into your main app entry

````
import slider from './slider'
import slide from './slide'
````

Also don't forget to define in `components`:

````
export default {
  ...
  components: {
    'slider': slider,
    'slide': slide
  },
  ...
}
````

Last step,use in `template`:

````
<slider :control="true" :dot="true" :auto="true" dot-float="center">
  <slide v-for="item in items">
  <li><div>{{$index}}</div></li>
  </slide>
</slider>
````