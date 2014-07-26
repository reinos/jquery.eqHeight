# jquery.eqHeight [![Build Status](https://api.travis-ci.org/reinos/jquery.eqHeight.png?branch=master)](https://travis-ci.org/reinos/jquery.eqHeight)

**jquery.eqHeight** is a jQuery plugin that stretches fluid columns to equal height. It is designed to be used in responsive web design.

With eqHeight applied, floating columns in the same row container are always stretched to the height of the tallest one.
For better visual experience on mobile devices, eqHeight adjusts column heights as window resizes.
Furthurmore, eqHeight resets columns to their default height values when columns are stacked together on small displays.

eqHeight currently supports all Responsive websites. 

## How to Use

### Download eqHeight

Download `jquery.eqheight.js` from [Github](https://github.com/reinos/jquery.eqHeight).

### Put eqHeight in your page

Please note that you have to include eqHeight after jQuery.

```html
<script src="http://code.jquery.com/jquery.min.js"></script>

<!-- put eqHeight after jQuery -->
<script src="jquery.eqheight.js"></script>
```

### Use eqHeight in your page

Using eqHeight is simple.
You have to specify a CSS3 selector for row containers, and *optionally* a CSS3 selector for columns **inside those row containers**.
eqHeight selects the top level children of row containers as columns by default.

Say your HTML looks like this:

```html
<div class="row" style="display: block; clear: both;">
    <div class="column" style="display: block; float: left; width: 200px;">
        <p>Line 1</p>
        <p>Line 2</p>
        <p>Line 3</p>
        <p>Line 4</p>
    </div>
    <div class="column" style="display: block; float: left; width: 200px;">
        <p>Line 1</p>
        <p>Line 2</p>
        <p>Line 3</p>
        <p>Line 4</p>
        <p>Line 5</p>
    </div>
    <div class="column" style="display: block; float: left; width: 200px;">
        <p>Line 1</p>
    </div>
    <div class="column" style="display: block; float: left; width: 200px;">
        <p>Line 1</p>
        <p>Line 2</p>
        <p>Line 3</p>
    </div>
</div>
```

A simple eqHeight setup for the above HTML would be:

```html
<script type="text/javascript">
$(document).ready(function() {
    $(".row").eqHeight(".column");
});
</script>
```

You can also use
```javascript
$(".row").eqHeight();
```
in this case because `&lt;div class="column"&gt;` elements are top level children of `&lt;div class="row"&gt;` elements.

#### Options

##### accountForPadding
Be aware of padding

```javascript
$(".row").eqHeight(".column", {
    accountForPadding: true
});
```

##### columnSelector
The selector to match the elements to eqHeight

```javascript
$(".row").eqHeight({
    columnSelector: ".column"
});
```

##### onReady
The onReady callback that will fired right after the plugin is ready with all eqHeights

```javascript
$(".row").eqHeight({
    onReady: function(){}
});
```

##### onResize
The onResize callback that will fired on resize

```javascript
$(".row").eqHeight({
    onResize: function(){}
});
```

##### break_point
You can set minimum width under which the plug-in will be ignored with the `break_point` option.

This is useful for responsive designs, in which floating element should be the same height side by side, but for smaller screens the elements are stacked and should have auto height.

```javascript
$(".row").eqHeight(".column", {
    break_point: 568
});
```
