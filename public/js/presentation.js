/*page layout ################################################################*/
/*
 * Thanks to:
 * http://lab.hakim.se/reveal-js/
 * https://www.npmjs.com/package/screenfull
 */
var presentation_screen = function(){
    if ( !(this instanceof presentation_screen) ) {
          return new presentation_screen();
    }
    
    var me = this;
    
    me.options = {
        width: 960,
	height: 700,
        pageWidth: 0,
        pageHeight: 0,
        wrapper_selector: '.page_wrapper',
        content_selector: '.page',
        isMobileDevice: false,
        page: null,
        page_wrapper: null
    }
    
    me.events = [];
    me.on = function(event,callback){
      me.events.push(event.toLowerCase(), callback);
    };
    me.fire = function(){
      var args = [];
      for (var i=0; i<arguments.length; i++) args.push(arguments[i]);
      var event = args[0].toLowerCase();
      for (var i=0; i<=me.events.length; i+=2) {
        if(me.events[i]==event) me.events[i+1].apply(me,args.slice(1));
      }
    };

    
    me.init = function(){
        me.options.isMobileDevice = navigator.userAgent.match( /(iphone|ipod|ipad|android)/gi );
        me.options.page_wrapper =  document.querySelectorAll(me.options.wrapper_selector)[0];
        me.options.page =  me.options.page_wrapper.querySelectorAll(me.options.content_selector)[0];
        
        me.options.page.style.width = me.options.width + 'px';
        me.options.page.style.height = me.options.height + 'px';
                
        me.resize();
        
        window.addEventListener( 'resize', me.resize, false );
        
        me.fire("init_end");
    }
    
    me.resize = function(){
        me.options.pageWidth = me.options.page_wrapper.offsetWidth;
        me.options.pageHeight = me.options.page_wrapper.offsetHeight;
        layout();
    }
    
    var layout = function(){
        me.fire("layout_start");
        
        var scale = Math.min( me.options.pageWidth / me.options.width, me.options.pageHeight / me.options.height );
    
        var page = me.options.page;
        
        if( scale === 1 ) {
                page.style.zoom = '';
                page.style.left = '';
                page.style.top = '';
                page.style.bottom = '';
                page.style.right = '';
                transformElement( page, '' );
        }
        else {
                // Prefer zooming in desktop Chrome so that content remains crisp
                if( !me.options.isMobileDevice && /chrome/i.test( navigator.userAgent ) && typeof page.style.zoom !== 'undefined' ) {
                        page.style.zoom = scale;
                }
                // Apply scale transform as a fallback
                else {
                        page.style.left = '50%';
                        page.style.top = '50%';
                        page.style.bottom = 'auto';
                        page.style.right = 'auto';
                        transformElement( page, 'translate(-50%, -50%) scale('+ scale +')' );
                }
        }   
        
        me.fire("layout_end");
    }
    
    var transformElement = function(element, transform){
            element.style.WebkitTransform = transform;
            element.style.MozTransform = transform;
            element.style.msTransform = transform;
            element.style.OTransform = transform;
            element.style.transform = transform;
    }
}

var presentation_slides = function(){
    if ( !(this instanceof presentation_slides) ) {
          return new presentation_slides();
    }
    
    var me = this;
    
    me.options = {
        name: 'presentation',
        wrapper_selector: '.page_wrapper',
        content_selector: 'section',
        fullscreenEnabled: document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen,
        text: {
          page_number: "[current] von [count]"  
        },
        classes: {
            last: 'slide_last',
            current: 'slide_current',
            next: 'slide_next',
            bar: 'slide_bar',
            bt: 'bt',
            bt_next: 'bt_next',
            bt_prev: 'bt_prev',
            bt_full: 'bt_full',
            numbers: 'span_numbers'
        },
        translation: function(last, current, next){
            current.classList.add("slide_out");
            setTimeout(function(){current.classList.remove("slide_out");}, 1000);
        },
        wrapper: null,
        slides: null,
        bar: null,
        number_block: null,
        last_slide_index: 0,
        current_slide_index: 0,
        hashTagIntervall: null,
        in_translation: false,
        lastMouseWheelStep: 0,
    }
    
    me.events = [];
    me.on = function(event,callback){
      me.events.push(event.toLowerCase(), callback);
    };
    me.fire = function(){
      var args = [];
      for (var i=0; i<arguments.length; i++) args.push(arguments[i]);
      var event = args[0].toLowerCase();
      for (var i=0; i<=me.events.length; i+=2) {
        if(me.events[i]==event) me.events[i+1].apply(me,args.slice(1));
      }
    };
    
    me.init = function(){
        me.options.wrapper =  document.querySelectorAll(me.options.wrapper_selector)[0];
        me.options.slides =  me.options.wrapper.querySelectorAll(me.options.content_selector);
        
        me.options.current_slide_index = 0;
        me.options.last_slide_index = me.options.slides.length - 1;
        me.options.slides[me.options.current_slide_index ].classList.add('slide_current');
        me.options.slides[me.options.last_slide_index].classList.add('slide_last');
        
        init_bar();
        init_events();
        
        if(me.options.hashTagIntervall){
            clearInterval(me.options.hashTagIntervall);
        }
        
        me.options.hashTagIntervall = setInterval(checkHashTag,800);
        me.options.in_translation = false;
        
    }
  
    var init_bar = function(){
        if(me.options.bar){
            me.options.bar.parentNode.removeChild(me.options.bar);
        }
        
        me.options.bar = document.createElement('div');
        me.options.bar.classList.add(me.options.classes.bar);
         
        var bt_prev = document.createElement('div');
        bt_prev.classList.add(me.options.classes.bt);
        bt_prev.classList.add(me.options.classes.bt_prev);
        me.options.bar.appendChild(bt_prev);
        

        var bt_next = document.createElement('span');
        bt_next.classList.add(me.options.classes.bt);
        bt_next.classList.add(me.options.classes.bt_next);
        me.options.bar.appendChild(bt_next);
        
        if(me.options.fullscreenEnabled){
            var bt_full = document.createElement('span');
            bt_full.classList.add(me.options.classes.bt);
            bt_full.classList.add(me.options.classes.bt_full);
            me.options.bar.appendChild(bt_full);
            
        }
        
        
        me.options.number_block = document.createElement('span');
        me.options.number_block.classList.add(me.options.classes.numbers);
        me.options.bar.appendChild(me.options.number_block);
        
        setPageNumber();
        
        if (document.addEventListener) {
            bt_prev.addEventListener('click', me.prev, false);
            bt_next.addEventListener('click', me.next, false);
            if(me.options.fullscreenEnabled){
                bt_full.addEventListener('click', me.fullscreem, false);
            }
        } else {
            bt_prev.attachEvent('click', me.prev, false);
            bt_next.attachEvent('click', me.next, false);
            if(me.options.fullscreenEnabled){
                bt_full.attachEvent('click', me.fullscreem, false);
            }
        }
        
        me.options.wrapper.appendChild(me.options.bar);
        
    }
    
    var touch = { start: 0, end: 0}
    
    var init_events = function(){
        //scrollWheel
        me.options.lastMouseWheelStep = 0;
        if (me.options.wrapper.addEventListener) {
            me.options.wrapper.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // Firefox
            me.options.wrapper.addEventListener( 'mousewheel', onDocumentMouseScroll, false ); // IE9, Chrome, Safari, Opera
        }
        else {
            me.options.wrapper.attachEvent("onmousewheel", onDocumentMouseScroll); // IE 6/7/8
        }
        
        //touch events
        me.options.wrapper.addEventListener( 'touchstart', onTouchStart, false );
        me.options.wrapper.addEventListener( 'touchmove', onTouchMove, false );
        me.options.wrapper.addEventListener( 'touchend', onTouchEnd, false );
        
        //keyboard events
        document.addEventListener( 'keydown', onDocumentKeyPress, false );
    }
    
    var onDocumentKeyPress = function(event){
        console.log(event.keyCode);
        switch( event.keyCode ) {
            case 32: case 39: me.next(); break;
            case 37: me.prev(); break;
            case 70: me.fullscreem(); break;
        }
    }
    
    var onTouchStart = function(event){
        touch.start = event.touches[0].clientX;
        touch.end = event.touches[0].clientX;
    }
    
    var onTouchMove = function(event){
        touch.end = event.touches[0].clientX;
    }
    
    var onTouchEnd = function(event){
        touch_diff = touch.end - touch.start;
        
        if(touch_diff > 50){
            me.next();
        } 
        else if (touch_diff < -50){
            me.prev();
        } 
        
        touch = { start: 0, end: 0};
    }
    
    var onDocumentMouseScroll = function(event){
        if( Date.now() - me.options.lastMouseWheelStep > 600 ) {

            me.options.lastMouseWheelStep = Date.now();

            var delta = event.detail || -event.wheelDelta;
            if( delta > 0 ) {
                    me.next();
            }
            else {
                    me.prev();
            }

        }
    }
    
    var setPageNumber = function(){
        var t = me.options.text.page_number + '';
        t = t.replace("[current]", me.options.current_slide_index + 1);
        t = t.replace("[count]", me.options.slides.length);
        
        me.options.number_block.innerHTML = t;
    }
    
     me.next = function(){
        me.fire("next_start");
        
        var next_index =  me.options.current_slide_index + 1;
        if(next_index >= me.options.slides.length){
            next_index = 0;
        }

        me.goTo(next_index);
        me.fire("next_end");
    }
    
    me.prev = function(){
        me.fire("prev_start");
        
        var next_index =  me.options.current_slide_index - 1;
        if(next_index < 0){
            next_index = me.options.slides.length - 1;
        }

        me.goTo(next_index);
        me.fire("prev_end");
    }
    
    me.goTo = function(next_index){
        if(me.options.in_translation){
            return;
        }
        me.options.in_translation = true;
        
        me.fire("goTo_start", next_index);
        
        
        me.options.slides[next_index].classList.add(me.options.classes.next);
        
        me.options.translation(
                me.options.slides[me.options.last_slide_index],
                me.options.slides[me.options.current_slide_index],
                me.options.slides[next_index]
                ),
        
        me.options.slides[me.options.last_slide_index].classList.remove(me.options.classes.last);
        me.options.slides[me.options.current_slide_index].classList.remove(me.options.classes.current);
        me.options.slides[me.options.current_slide_index].classList.add(me.options.classes.last);
        me.options.slides[next_index].classList.add(me.options.classes.current);
        me.options.slides[next_index].classList.remove(me.options.classes.next);
        
        
        me.options.last_slide_index = me.options.current_slide_index;
        me.options.current_slide_index = next_index;
        setPageNumber();
        
        setHashTag();
        me.options.in_translation = false;
        
        me.fire("goTo_end", next_index);
    }
    
    me.fullscreem = function(){
        var element = me.options.wrapper;
        
        if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
    }
    
    var setHashTag = function(){
        location.hash = me.options.name + '-' + (me.options.current_slide_index + 1);
    }
    
    var checkHashTag = function(){
        if(me.options.in_translation){
            return;
        }
        
        var hashTag = location.hash;
        
        hashTag = hashTag.replace("#", "");
        
        if(hashTag.indexOf(me.options.name) !== 0){
            return;
        }
        
        var slide_id = hashTag.substring(me.options.name.length + 1);
        
        if(!isNaN(slide_id)){
            slide_id = parseInt(slide_id) - 1;
            if(me.options.current_slide_index != slide_id){
                if(slide_id >= 0 && slide_id < me.options.slides.length){
                    me.goTo(slide_id);
                }
            }
        }
    }
}

