js-simpleSlider
===============

A simple js slider.
Can be navigated with navs buttons or with mouse events.

##Usage
```html
<div class="simpleSlider" id="slider">
    <ul class="simpleSlider-container">
        <li>...</li>
    </ul>
</div>

<nav>
    <button id="prev">Prev</button>
    <button id="next">Next</button>
</nav>
```

```js
    var el = document.getElementById( 'slider' )
    var slider = new simpleSlider( el )

    document.getElementById( 'prev' ).onclick = function(){ slider.next() }
    document.getElementById( 'next' ).onclick = function(){ slider.prev() }

```

##TODO

Add touch events