
var simpleSlider = function( elem ){
    this._init(elem)
}


simpleSlider.prototype._init = function( elem ) {
    this.elem = elem;
    this.elemUl = elem.getElementsByClassName('simpleSlider-container')[0]
    this.div = this.elem.offsetWidth * 0.2;
    this._initItems()
    this._initDrag();
};


simpleSlider.prototype._initItems = function() {
    this.items = this.elemUl.getElementsByTagName( 'li' );
    this._setActive( this.active || this.items[0] )
    this._initThumb();
}

simpleSlider.prototype._initThumb = function() {
    var self = this;
    if(!this.thumbElem){
        this.thumbElem = document.createElement( 'ul' );
        this.thumbElem.className = 'simpleSlider-thumb';
    } else{
        this.thumbElem.innerHTML = ''
    }
    var angle = 0, liVal = this.items.length, step = 360 / liVal;
    while (angle < 360){
        var li = document.createElement( 'li' );
        var rotate = 'rotateZ(' + angle + 'deg)';
        li.style['-webkit-transform'] = rotate;
        li.style['transform'] = rotate;
        li.addEventListener( 'click', function(e){
            var index = self._getIndex( self.thumbItems, this ), itemslen = self.items.length
            for (var i = 0; i < itemslen; i++) {
                var item = self.items[i];
                if( self._getIndex( self.items,  item) == index + 1) break
                self._setActive( item )
            };
        });
        this.thumbElem.appendChild( li );
        angle += step
    }
    this.elem.appendChild( this.thumbElem );
    this.thumbItems = this.thumbElem.getElementsByTagName( 'li' );
    this._setThumb( this.thumbItems[0] )
};


simpleSlider.prototype._initDrag = function() {
    var self = this, names = ['active', '_prev', '_next'];

    function fnDrag( e ){
        self.elem.style.cursor = 'move';
        self._inDrag = true;
        self.cx = getMouse( e ).x
        names.forEach( function( name ){self[name].cx = self[name].offsetLeft })
    }

    function fnMove( e ){
        if( !self._inDrag ) return
        var dx = getMouse( e ).x - self.cx;
        names.forEach( function( name ){self[name].style.left = self[name].cx + dx + 'px'} )
    }

    function fnUp( e ){
        if( self.cx == undefined ) return
        var dx = getMouse(e).x - self.cx;
        self._inDrag = false;
        self.elem.style.cursor = 'default';
        names.forEach( function( name ){delete self[name].cx } )
        delete self.cx
        self._clearPosition()
        if( dx < self.div*-1 )self.prev()
        else if( dx > self.div ) self.next()
    }

    self.elem.addEventListener( 'mousedown', fnDrag )
    self.elem.addEventListener( 'mousemove', fnMove )
    self.elem.addEventListener( 'mouseup', fnUp )
    self.elem.addEventListener( 'mouseleave', fnUp )
};


simpleSlider.prototype._clearPosition = function() { //clear left style of element after dragging
    for (var i = this.items.length - 1; i >= 0; i--) {
        this.items[i].style.removeProperty('left')
    };
};


simpleSlider.prototype._getNext = function( array, node ) {
    var array = array || this.items, node = node || this.active;
    return node.nextElementSibling || array[0]
};


simpleSlider.prototype._getPrev = function( array, node ) {
    var array = array || this.items, node = node || this.active;
    return node.previousElementSibling || array[ array.length - 1 ]
};


simpleSlider.prototype._getIndex = function( array, node ) {
    for (var i = array.length - 1; i >= 0; i--) {
        if( node.isSameNode( array[i] ) ) return i
    };
};


simpleSlider.prototype._setThumb = function(item) {
    var item = item || this._getThumb();
    if( item == undefined ) return
    if( this.thumbActive ) removeClass( this.thumbActive, 'active' )
    this.thumbActive = item;
    addClass( item, 'active' )
};


simpleSlider.prototype._getThumb = function() {
    var index = this._getIndex( this.items, this.active );
    if( index == undefined || this.thumbItems == undefined) return
    return this.thumbItems[index];
};


simpleSlider.prototype._setActive = function(item) {
    addClass( item, 'active' );
    for (var i = this.items.length - 1; i >= 0; i--) {
        removeClass( this.items[i], 'prev' );
        removeClass( this.items[i], 'next' );
    };
    if( this.active && !this.active.isSameNode(item) ) removeClass( this.active, 'active' );
    this.active = item;
    this._next = this._getNext();
    this._prev = this._getPrev();
    addClass( this._next, 'next' )
    addClass( this._prev, 'prev' )
    this._setThumb()
};


simpleSlider.prototype.prev = function() {
    var prev = this._getPrev();
    addClass( prev, 'next' )
    this._setActive( prev )
};


simpleSlider.prototype.next = function() {
    var next = this._getNext();
    addClass( this.active, 'prev' )
    this._setActive( next )
};

simpleSlider.prototype.update = function(elems) { //items - some  array or nodelist or node or string, which will be wrap into li and added to slider
    var self = this;

    function _append(el){
        var li = document.createElement( 'li' );
        if( typeof(el) == 'object' ) li.appendChild( el );
        else li.innerHTML = el;
        self.elemUl.appendChild( li );
    }

    if( elems instanceof Array || elems instanceof NodeList ){
        for (var i = elems.length - 1; i >= 0; i--) {
            _append(elems[i])
        };
    } else {_append(elems) }
    this._initItems();
}