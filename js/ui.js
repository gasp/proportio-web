// 
//  ui.js
//  proportio
//  
//  Created by gaspard on 2013-02-01
// 

/**
 * slider ok
 * menu ok
 * content stable
 * background stable
 * init stable
 */

var slider = {
	data: {
		numberOfSlides: 0
	},
	init: function () {
		$(".container").iosSlider({
			snapToChildren: true,
			desktopClickDrag: true, // really, this has to be false in prod
			keyboardControls: true,
			navNextSelector: $("#nav .right a"),
			navPrevSelector: $("#nav .left a"),
			unselectableSelector: $("#menu, #bullet"),
			onSlideChange: function (sl) {
				slider.change(sl);
			},
			onSliderLoaded: function (sl) {
				slider.data = sl.data;
			}
		});

		// nav
		if (slider.data.numberOfSlides === 1) {
			$("#nav .right a").hide();
        }
		$("#nav .left a").hide();
		$("#nav a").bind("click", function (e) {
			e.preventDefault();
			return false;
		});

		// deep linking
		var goto = window.location.hash.toString().substring(1);
		if(goto.length>0){
			var desti = null;
			$(".slider .slide").each(function(i){
				if($(this).hasClass(goto))
					desti = i;
			});
			// console.log("desti", desti);
			$(".container").iosSlider('goToSlide', parseInt(desti)+1);
		}
	},
	update: function () {
		/* call to rerender iosSlider
		$(".iosSlider1").iosSlider("update");
		*/
	},
	change: function (sl) {
		if (sl.currentSlideNumber > 1) $("#nav .left a").fadeIn();
		else $("#nav .left a").fadeOut();
		if (sl.currentSlideNumber < slider.data.numberOfSlides) $("#nav .right a").fadeIn();
		else $("#nav .right a").fadeOut();
	}
};

var menu = {
	init: function () {
		// display a bullet under the menu
		$("#menu li a.on").each(function () {
			left = parseInt($(this).context.offsetLeft+($(this).width()/2));
			$('#bullet').css({left:left});
		});
		$("#menu li a").bind('mouseover',function () {
			left = parseInt($(this).context.offsetLeft+($(this).width()/2));
			$('#bullet').stop().animate({left:left});
		}).bind('mouseout',function () {
			try{
				window.killTimeout(menutempo);
			} catch (e) {}
			menutempo = window.setTimeout(function () {
				if($.timers.length<1){
					$("#menu li a.on").each(function () {
						left = parseInt($(this).context.offsetLeft+($(this).width()/2));
						$('#bullet').stop().animate({left:left});
					});
				}
			},3000);
		});
		// place navigation if there is one
		var height = $(document).height();
		$("#nav .left").css({top:(height/2)-10});
		$("#nav .right").css({top:(height/2)-10});

		$(".navbar-toggle").on("click",function(){
			$("#menu.mini ul,#menu.mini .lang").toggle(); // the alt menu
		})
	}
};

var content = {
	init: function () {
		content.place(true);
	},
	place: function(animate){
		//place bottom text
		var height = $(document).height(),
			width = $(document).width()
			space = Math.max(height-$('.content').height()-20,30);
			/*
				TODO move this to media queries
			*/
		
		if(width>640){
			if(animate === true)
				$('.content').hide().css({paddingTop:space}).fadeIn();
			else
				$('.content').css({paddingTop:space}).show();
			// reset css if has been modified by <640 version
			$('.section.blog .article').show()
			$('.page').css({width: '34%',marginLeft: '66.1%'}).show();
			$('.container').css({overflowY: 'hidden'});
			$('#menu').removeClass('mini');
			$('#menu ul, #menu .lang').show();
		}
		else{
			// hide menu > find some way to display it
			$('#menu').addClass('mini')
			$('#bullet').hide();

			// show only the first blog post on home page
			$('.section.blog .article').hide()
			$($('.section.blog .article').get(0)).show()

			$('.page').css({width: '100%',marginLeft: 0});
			$('.content').css({paddingTop: '30px'}).show();
			$('.container').css({overflowY: 'auto'});

			// fix height with scroll
			// dirty, please recode this
			var ch = $('.container').height();
			$('.slide.article .inner').each(function(){
//				console.log(this,$(this).height(),ch);
				if($(this).height() > (ch - 100)){
					$(this).css({
						height: (ch - 40),
						overflowY: 'auto'
					});
				}
			});
		}
	}
}


var background = {
	tempo: null,
	init: function () {
		$(".slider .slide").each(function(i){
			background.colorize(this);
			background.fetch(this);
			
			if(!i)
				$(this).addClass('first');
		});
		$(".slider .slide").last().addClass('last');
	},
	colorize: function(slide){
		// auto color
		var c='',r;
		if($(slide).data('color'))
			c = $(slide).data('color');
		else{
			for (var i=2; i >= 0; i--){
				r = Number(Math.floor(Math.random()*0xFF)).toString(16);
				c += (r.length>1)?r:'0'+r; // adding missing 0 if needed
			};
		}
		$(slide).css({'background-color':'#'+c});
		
	},
	update: function (slide) {
		if(background.tempo !== null){
			window.clearTimeout(background.tempo);
		}
		background.tempo = window.setTimeout(function () {
			$(".slider .slide").each(function(i){
				background.fetch(this);
			});
		},300);
		
	},	
	fetch: function (slide) {
		var width = $(document).width(),
			height = $(document).height(),
			type='article',
			id_article= $(slide).data('id_article'),
			id_rubrique= $(slide).data('id_rubrique'),
			url = '/spip.php',
			data = {
				page: 'background.json',
				id_article: id_article,
				id_rubrique: id_rubrique,
				w: width,
				h: height
			};
		// ajax query
		return $.ajax({
			dataType: "json",
			async:true,
			url: url,
			data: data,
			success: function(d){
				if(d.file != null)
				background.set(slide,d.file);
			},
			error: function(d,e){
				console.log('error',e,d);
			}
		})
	},
	set: function(slide,file){
		var im = new Image();
		im.src=file;
		im.onload = function () {
			$('.overlay',slide).css({'background-image':'url('+file+')'}).hide().fadeIn();	
		}
	}

}


$(document).ready(function () {
	slider.init();
	background.init();
	var t = window.setTimeout(function () {
		menu.init();
		content.init();
	},300);
	
	$(window).bind('orientationchange resize',function () {
		content.place();
		background.update();
	});
});


if(typeof console === "undefined"){
	var console = {log: function () {}, dir: function () {}};
}
