
var simpleSlider = function( elem ){
    this._init(elem)
}


simpleSlider.prototype._init = function( elem ) {
    this.elem = elem;
    this.div = this.elem.offsetWidth * 0.2;
    this.items = elem.getElementsByClassName('simpleSlider-container')[0].getElementsByTagName( 'li' );
    this._setActive( this.items[0] )
    this._initDrag();
    this._initPreview();
};


simpleSlider.prototype._initPreview = function() {
    var self = this;
    function _createItem () {
        var item = document.createElement( 'li' );
        return item
    }
    this.previewElem = document.createElement( 'ul' );
    this.previewElem.className = 'simpleSlider-preview';
    var angle = 0, liVal = this.items.length, step = 360 / liVal;
    while (angle < 360){
        var li = _createItem();
        var rotate = 'rotateZ(' + angle + 'deg)';
        li.style['-webkit-transform'] = rotate;
        li.style['transform'] = rotate;
        li.addEventListener( 'click', function(e){
            var index = self._getIndex( self.previewItems, this ), itemslen = self.items.length
            for (var i = 0; i < itemslen; i++) {
                var item = self.items[i];
                if( self._getIndex( self.items,  item) == index + 1) break
                self._setActive( item )
            };
        });
        this.previewElem.appendChild( li );
        angle += step
    }
    this.elem.appendChild( this.previewElem );
    this.previewItems = this.previewElem.getElementsByTagName( 'li' );
    this._setPreview( this.previewItems[0] )
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


simpleSlider.prototype._setPreview = function(item) {
    var item = item || this._getPreview();
    if( item == undefined ) return
    if( this.previewActive ) removeClass( this.previewActive, 'active' )
    this.previewActive = item;
    addClass( item, 'active' )
};


simpleSlider.prototype._getPreview = function() {
    var index = this._getIndex( this.items, this.active );
    if( index == undefined || this.previewItems == undefined) return
    return this.previewItems[index];
};


simpleSlider.prototype._setActive = function(item) {    
    addClass( item, 'active' );
    for (var i = this.items.length - 1; i >= 0; i--) {
        removeClass( this.items[i], 'prev' );
        removeClass( this.items[i], 'next' );
    };
    if( this.active ) removeClass( this.active, 'active' );
    this.active = item;
    this._next = this._getNext();
    this._prev = this._getPrev();
    addClass( this._next, 'next' )
    addClass( this._prev, 'prev' )
    this._setPreview()
};


simpleSlider.prototype.prev = function() {
    console.log('prev')
    var prev = this._getPrev();
    addClass( prev, 'next' )
    this._setActive( prev )
};


simpleSlider.prototype.next = function() {
    console.log('next')
    var next = this._getNext();
    addClass( this.active, 'prev' )
    this._setActive( next )
};

var slider;
window.onload = function(){
    var elem = document.getElementsByClassName( 'simpleSlider' )[0]
    slider = new simpleSlider( elem ) 

    document.getElementById( 'next' ).onclick = function(){ slider.next() }
    document.getElementById( 'prev' ).onclick = function(){ slider.prev() }
}
