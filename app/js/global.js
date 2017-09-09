/**
 * Created by MinhMan.Tran on 9/9/2017.
 */
var BLK = (function(){
    'use strict';
    var method = {
        windowWidthHeight: function(){
            var heightWindow = document.documentElement.clientHeight;
            var widthWindow = document.documentElement.clientWidth;
            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (iOS) {
                var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
                heightWindow = window.innerHeight * zoomLevel;
                widthWindow = window.innerWidth * zoomLevel;
            }
            return {width: widthWindow, height: heightWindow};
        },
        scrollBarWidth: function() {
            var outer = document.createElement("div");
            outer.style.visibility = "hidden";
            outer.style.width = "100px";
            outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

            document.body.appendChild(outer);

            var widthNoScroll = outer.offsetWidth;
            // force scrollbars
            outer.style.overflow = "scroll";

            // add innerdiv
            var inner = document.createElement("div");
            inner.style.width = "100%";
            outer.appendChild(inner);

            var widthWithScroll = inner.offsetWidth;

            // remove divs
            outer.parentNode.removeChild(outer);

            return widthNoScroll - widthWithScroll;
        },
        scrolling: function(){
            $(window).on('load scroll', function(){
                var top = $(this).scrollTop(),
                    wrapper = $('.site-wrapper');
                if(top > 100){
                    wrapper.addClass('scrolling');
                } else {
                    wrapper.removeClass('scrolling');
                }
            });
        },
        init: function () {
            method.scrolling();
        }
    };
    return {
        init: method.init,
        windowWidthHeight: method.windowWidthHeight,
        scrollBarWidth: method.scrollBarWidth
    }
})();


$(function(){
    'use strict';

    BLK.init();
});