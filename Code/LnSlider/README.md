## Feature

-  Loop
-  Basic Nav
-  Show/Hide nav
-  Autoplay
-  Slide effect mode
-  Dot
-  Modularity([Vue component](https://github.com/hanaarena/lazyday/tree/dev/Code/LnSlider/vuejs-version))

## Usage

#### First

````
sudo npm install

npm run gulp `or` npm run webpack
```

After run above,it will generate file at `dist` folder as packaging way you choose.

#### Second

Include the js file in html `script` tag,for example:

````javascript
<script type="text/javascript" src="../dist/bundle.js"></script>
<script type="text/javascript">
  var slide = new LnSlider('.wrapper', { 
    prev: '.prev',
    next: '.next',
    autoplay: true,
    effect: 'slide'
  });
</script>
````

see more in `example` folder.

## API

**prev**  **_[Class name]_**

Previous navigation control. _should use with `next`_

**next**  **_[Class name]_**

Next navigation control. _should use with `prev`_

**autoplay**  **_[Boolean]_**

Auto play slide

**effect**  **_[slide | fade]_**

Slide effect

**dot**  **_[Boolean]_**

Show slide dot

**dotClick**  **_[Boolean]_**

Slide dot clickable

**dotFloat**  **_[left | center | right]_**

Slide dot float