
var simpleSlider = function(elem){
    this._init(elem)
}

simpleSlider.prototype._init = function(elem) {
    this.elem = elem;
    this.div = /*this.elem.offsetWidth*/150 * 0.2
    this.items = elem.getElementsByTagName('li');
    /*for (var i = this.items.length - 1; i >= 0; i--) {
        addClass(this.items[i], 'prev')
    };*/
    this._setActive(this.items[0])
    this._initEvents()
};

simpleSlider.prototype._initEvents = function() {
    var elem = this.elem;
    var self = this

    var names = ['active', '_prev', '_next'];

    function fnDrag(e){
        self.elem.style.cursor = 'move';
        self._inDrag = true;
        self.cx = getMouse(e).x
        names.forEach(function(name){self[name].cx = self[name].offsetLeft })
    }
    function fnMove(e){
        if(!self._inDrag) return
        var dx = getMouse(e).x - self.cx;
        names.forEach(function(name){self[name].style.left = self[name].cx + dx + 'px'})
    }
    function fnUp(e){
        if(self.cx == undefined) return
        var dx = getMouse(e).x - self.cx;
        self._inDrag = false;
        elem.style.cursor = 'default';
        names.forEach(function(name){delete self[name].cx })
        delete self.cx
        self._clearPosition()
        if(dx < self.div*-1){
            self.prev()
        } else {
            if(dx > self.div) self.next()
        }
    }

    elem.addEventListener('mousedown', fnDrag)
    elem.addEventListener('mousemove', fnMove)
    elem.addEventListener('mouseup', fnUp)
    elem.addEventListener('mouseleave', fnUp)
};

simpleSlider.prototype._clearPosition = function() { //clear left style of element after dragging
    for (var i = this.items.length - 1; i >= 0; i--) {
        this.items[i].style.removeProperty('left')
    };
};

simpleSlider.prototype._getNext = function() {
    return this.active.nextElementSibling || this.items[0]
};

simpleSlider.prototype._getPrev = function() {
    return this.active.previousElementSibling || this.items[ this.items.length - 1 ]
};

simpleSlider.prototype._setActive = function(item) {    
    addClass(item, 'active')
    for (var i = this.items.length - 1; i >= 0; i--) {
        removeClass(this.items[i], 'prev');
        removeClass(this.items[i], 'next');
    };
    if( this.active ) removeClass(this.active, 'active')
    this.active = item
    this._next = this._getNext()
    this._prev = this._getPrev()
    addClass( this._next, 'next' )
    addClass( this._prev, 'prev' )
};


simpleSlider.prototype.next = function() {
    console.log('next')
    var prev = this._getPrev();
    addClass(prev, 'next')  
    this._setActive(prev)
};

simpleSlider.prototype.prev = function() {
    console.log('prev')
    var next = this._getNext();
    addClass(this.active, 'prev')
    this._setActive(next)
};

window.onload = function(){
    var ul = document.getElementsByTagName('ul')[0]
    var pp = new simpleSlider(ul) 

    document.getElementById('prev').onclick = function(){pp.next()}
    document.getElementById('next').onclick = function(){pp.prev()}
}




















