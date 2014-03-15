
var simpleSlider = function(elem){
    this._init(elem)
}

simpleSlider.prototype._init = function(elem) {
    this.elem = elem;
    this.items = elem.getElementsByTagName('li');
    for (var i = this.items.length - 1; i >= 0; i--) {
        addClass(this.items[i], 'prev')
    };
    this._setActive(this.items[0])
    this._initEvents()
};

simpleSlider.prototype._initEvents = function() {
    var startEvents = ['mousedown'];
    var endEvents = ['mouseup'];
    var elem = this.elem;
    var self = this

    var draggable = {
        active: this.active,
        prev: this._getPrev(),
        next: this._getNext()
    }

    var items = ['active', 'prev', 'next'];

    function fnDrag(e){
        elem.style.cursor = 'move';
        self.cx = getMouse(e).x
        self._inDrag = true;
        items.forEach(function(name){
            draggable[name].cx = draggable[name].offsetLeft
        })
    }
    function fnMove(e){
        if(!self._inDrag) return
        var dx = getMouse(e).x - self.cx;
        self.active.style.left = self.active.cx + dx + 'px';
        items.forEach(function(name){
            draggable[name].style.left = draggable[name].cx + dx + 'px'
        })
    }
    function fnUp(e){
        var mouse = getMouse(e)
        self._inDrag = false;
        elem.style.cursor = 'default';
        var nx = self.active.offsetLeft;
        if(nx < 0) self.next()
        if(nx > 0) self.prev()
    }

    elem.addEventListener('mousedown', fnDrag)
    elem.addEventListener('mousemove', fnMove)
    elem.addEventListener('mouseup', fnUp)
};

simpleSlider.prototype._clearPosition = function(item) { //clear left style of element after dragging
    item.style.removeProperty('left')
};

simpleSlider.prototype._getNext = function() {
    return this.active.nextElementSibling || this.items[0]
};

simpleSlider.prototype._getPrev = function() {
    return this.active.previousElementSibling || this.items[ this.items.length - 1 ]
};

simpleSlider.prototype._setActive = function(item) {
    this._clearPosition(item)
    addClass(item, 'active')
    removeClass(item, 'prev');
    removeClass(item, 'next');
    if( this.active ) removeClass(this.active, 'active')
    this.active = item
    this._setNext( this._getNext() )
    this._setPrev( this._getPrev() )
};

simpleSlider.prototype._setNext = function(item) {
    this._clearPosition(item)
    removeClass(item, 'prev');
    addClass(item, 'next');
};

simpleSlider.prototype._setPrev = function(item) {
    this._clearPosition(item)
    removeClass(item, 'next');
    addClass(item, 'prev');
};

simpleSlider.prototype.next = function() {
    console.log('next')
    var next = this._getNext();
    addClass(this.active, 'prev')
    this._setActive(next)
};

simpleSlider.prototype.prev = function() {
    console.log('prev')
    var prev = this._getPrev();
    addClass(prev, 'next')  
    this._setActive(prev)
};

window.onload = function(){
    var ul = document.getElementsByTagName('ul')[0]
    var pp = new simpleSlider(ul) 

    document.getElementById('prev').onclick = function(){pp.next()}
    document.getElementById('next').onclick = function(){pp.prev()}
}




















