/**
 * Created by MinhMan.Tran on 3/4/2016.
 */
var DKS = (function(){
    'use strict';
    var method = {
        showNoticePopup: function(){
            'use strict';
            $.magnificPopup.open({
                items: {
                    src: $('#noticePopup')
                },
                type: 'inline',

                fixedContentPos: true,
                fixedBgPos: true,

                overflowY: 'auto',

                closeBtnInside: true,
                preloader: false,

                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-zoom-in'
            });

            $(document).on('click', '.button--close', function (e) {
                e.preventDefault();
                $.magnificPopup.close();
            });
        },
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
        getScrollbarWidth: function() {
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
        menuToggle: function() {
            $('.lang_sel_sel, .toggle-main-menu, .panel-grid-cell .widget_nav_menu .widget-title').on('click', function(){
                $(this).toggleClass('open');
                return false;
            });

            $(window).on('resize', function(){
                $('.lang_sel_sel, .toggle-main-menu, .panel-grid-cell .widget_nav_menu .widget-title').removeClass('open');
            });
        },

        menuHover: function(){
            if(method.windowWidthHeight().width >= 1024) {
                $('.special-submenu').on('mouseover', function () {
                    $('.submenu.' + $(this).attr('id')).show();
                }).on('mouseleave', function () {
                    $('.submenu.' + $(this).attr('id')).hide();
                });

                $('.submenu').on('mouseover', function () {
                    $(this).show();
                }).on('mouseleave', function () {
                    $(this).hide();
                });
            }
        },
        railMenu: function(){
            $('.site-rail-menu--toggle').on('click', function(){
                $('.site-container').toggleClass('site-rail-menu--open');
            });
            $('.site-rail-menu--close').on('click', function(){
                $('.site-container').removeClass('site-rail-menu--open');
            });

            $('.site-rail-menu .scrolling').mCustomScrollbar();


            $(window).on('scroll', function(){
                var scrollTop = $(window).scrollTop();
                //console.log(scrollTop);
                if(scrollTop > 90) {
                    $('.site-container').addClass('site-scrolling');
                }
                else {
                    $('.site-container').removeClass('site-scrolling');
                }
            });
        },

        fullImage: function(){
            var containerImg = $('.cover .sow-image-container');
            containerImg.each(function(){
                var that = $(this),
                    img = that.children('.so-widget-image');

                that.css({
                    'background-image': 'url("' + img.attr('src') + '")',
                    'background-size': "cover"
                });

                img.css({"visibility": "hidden"});
            });
            $(window).on('load resize', function(){
                containerImg.height('auto');
                if( method.windowWidthHeight().width >= 768) {
                    containerImg.each(function () {
                        var that = $(this);
                        that.height(that.parents('.panel-grid').height());
                        that.css({'opacity': 1});
                    });
                }
            });
        },

        playVideo: function(){

            var interval = setInterval(function(){
                if(window.YT){
                    clearInterval(interval);

                    var siteVideo = $('.site-video');
                    if(siteVideo.length > 0){
                        siteVideo.each(function(index, element){
                            var that = $(element),
                                videoId = that.data('id'),
                                parent = that.parents('.panel-grid'),
                                playerOver,
                                playerBelow;
                            playerOver = new YT.Player(element, {
                                height: '390',
                                width: '640',
                                videoId: videoId,
                                playerVars: {
                                    controls: 0,
                                    showinfo: 0,
                                    modestbranding: 1,
                                    autoplay: 1
                                },
                                events: {
                                    'onReady': function(event){

                                    },
                                    'onStateChange': function(event){
                                        if (event.data === YT.PlayerState.PLAYING) {
                                            playerBelow.playVideo();
                                        }
                                        if (event.data === YT.PlayerState.PAUSED) {
                                            playerBelow.pauseVideo();
                                        }
                                        if (event.data === YT.PlayerState.ENDED) {
                                            playerOver.playVideo();
                                            playerBelow.playVideo();
                                        }
                                    }
                                }
                            });
                            var playerBelowHtml = $('<div class="player-below"></div>');
                            parent.addClass('panel-grid--site-video').prepend('<div class="overlay"></div>').prepend(playerBelowHtml);
                            playerBelow = new YT.Player(playerBelowHtml.get(0), {
                                height: '390',
                                width: '640',
                                videoId: videoId,
                                playerVars: {
                                    controls: 0,
                                    showinfo: 0,
                                    modestbranding: 1,
                                    autoplay: 1
                                },
                                events: {
                                    'onReady': function(event){
                                        playerBelow.mute();
                                    },
                                    'onStateChange': function(event){

                                    }
                                }
                            });

                            $('.site-video--mute-toggle').on('click', function(){
                                var mute = $(this);
                                if(mute.hasClass('unmute')){
                                    mute.removeClass('unmute');
                                    playerOver.mute();
                                    mute.children('i').addClass('fa-volume-off').removeClass('fa-volume-up');
                                } else {
                                    mute.addClass('unmute');
                                    playerOver.unMute();
                                    mute.children('i').removeClass('fa-volume-off').addClass('fa-volume-up');
                                }
                            });
                        });
                    }
                }
            }, 500);

        },

        backgroundTitle: function(){
            $('.has-background').each(function(){
                var src = $(this).find('.wp-post-image').attr('src');
                $(this).css('background-image', 'url("' + src + '")');
            });
        },
        /*historyTab: function(){
            var siteHistory = $('.site-history');
            if(siteHistory.length > 0){
                siteHistory.on('click', '.toggle', function(){
                    if(!$(this).parent().hasClass('active')) {
                        siteHistory.find('.active').removeClass('active');
                        $(this).parent().addClass('active');
                        $($(this).data('target')).addClass('active');

                        $('html, body').animate({
                            scrollTop: siteHistory.offset().top
                        }, 500);
                    }
                });

            }
        },*/
        contactForm7: function(){
            var cellForm = $('.wpcf7-form');
            if(cellForm.length > 0){
                $('.wpcf7-form-control').on('focus', function(){
                    $(this).parents('label').find('.label').hide();
                }).on('blur', function(){
                    if(!$(this).val()) {
                        $(this).parents('label').find('.label').show();
                    }
                });
            }

            var yourLanguage = $('#yourLanguage');
            if(yourLanguage.length > 0){
                yourLanguage.find('select').on('change', function(){
                    var value = $(this).val();
                    if(value === ''){
                        value = "Default";
                    }
                    $('#yourName .label').html(objectLanguage[value][0]);
                    $('#yourEmail .label').html(objectLanguage[value][1]);
                    $('#yourMessage .label').html(objectLanguage[value][2]);
                    $('#buttonSend input').val(objectLanguage[value][3]);
                });
            }
        },
        stretchColumn: function(){
            var stretch = $('.siteorigin-panels-stretch');
            $(window).on('load resize', function(){
                stretch.find('.widget_sow-editor .panel-widget-style').height('auto');
                stretch.each(function(){
                    var panelStyle = $(this).find('.widget_sow-editor .panel-widget-style');
                    var maxHeight = Math.max.apply(null, panelStyle.map(function () {
                        return $(this).height();
                    }).get());

                    panelStyle.height(maxHeight);
                });
            });
        },
        tablePress: function(){
            $('.tablepress').each(function(){
                $(this).wrap('<div class="table-responsive"></div>');
            });
        },
        init: function () {
            method.windowWidthHeight();
            method.fullImage();
            method.playVideo();
            method.menuToggle();
            method.menuHover();
            method.railMenu();
            //method.historyTab();
            method.backgroundTitle();
            method.contactForm7();
            method.stretchColumn();
            method.tablePress();
        }
    };
    return {
        init: method.init,
        showNoticePopup: method.showNoticePopup
    }
})();


$(function(){
    'use strict';

    $('a[target="null"]').removeAttr('target');
    $(document).on('click', 'a', function(event){
        var url = $(this).attr('href');
        if(url && url[0] === '#') {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: $(url).offset().top - 30
            }, 500);
        }
    });

    var sliderTestimonials = $('.slider-testimonials');
    if(sliderTestimonials.length > 0){
        sliderTestimonials.find('.body').show();
        sliderTestimonials.slick({
            autoplay: true,
            autoplaySpeed: 4000,
            dots: true,
            arrows: false
        });
    }

    DKS.init();
});