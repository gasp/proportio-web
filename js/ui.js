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

		// read if there is a need to inverse the menu
		if($($(".container .slide").get(0)).hasClass("inverse"))
			menu.inverse(true)
	},
	update: function () {
		/* call to rerender iosSlider
		$(".iosSlider1").iosSlider("update");
		*/
	},
	change: function (sl) {
		// show/hide arrows
		if (sl.currentSlideNumber > 1) $("#nav .left a").fadeIn();
		else $("#nav .left a").fadeOut();
		if (sl.currentSlideNumber < slider.data.numberOfSlides) $("#nav .right a").fadeIn();
		else $("#nav .right a").fadeOut();

		// change url #hash
		var id_article = $(sl.currentSlideObject).data('id_article');
		if(typeof id_article === "undefined")
			window.location.hash = "";
		else
			window.location.hash = "#art" + id_article;

		// read if there is a need to inverse the menu
		if($(sl.currentSlideObject).hasClass('inverse'))
			menu.inverse(true);
		else menu.inverse(false);
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
	},
	inverse: function (is) {
		if(is){
			$("#menu").addClass("inverse");
			if(!$("#menu h1 img").attr('src').match(/inverse\.svg$/)){ // change only if needed
				$("#menu h1 img").attr('src',"/squelettes/img/logoproportio-inverse.svg");
			}
		}
		else{ // isn't
			$("#menu").removeClass("inverse");
			if($("#menu h1 img").attr('src').match(/inverse\.svg$/)){ // change only if needed
				$("#menu h1 img").attr('src',"/squelettes/img/logoproportio.svg");
			}
		}
	}
};

var content = {
	init: function () {
		content.place(true);
	},
	isdown: true,
	place: function(animate){
		//place bottom text
		var height = $(document).height(),
			width = $(document).width(),
			$content = $('.content');

		$content.each(function(){
			var space = Math.max(height-$(this).height(),30);
			console.log(this, height,$(this).height(),space)
			if(width>640){
				if(animate === true)
					$(this).hide().css({paddingTop:space}).fadeIn();
				else
					$(this).css({paddingTop:space}).show();
			}
		});

		$('#updown div').off('click').on('click',function(){
			if(content.isdown == true){
				$('.page').css({top:0}).removeClass('down');
				content.isdown = false;
			}
			else{
				$('.page').css({top: height-50}).addClass('down');
				content.isdown = true;
			}
			console.log("updown")
			$('#updown .up, #updown .down').toggle();
		});

			/*
				TODO move this to media queries
			*/
		
		if(width>640){

			// reset css if has been modified by <640 version
			$('.section.blog .article').show()
			$('.page').css({width: '34%',marginLeft: '66.1%'}).show();
			$('.page').removeClass('down');
			$('.container').css({overflowY: 'hidden'});
			$('#menu').removeClass('mini');
			$('#menu ul, #menu .lang').show();

			$('#updown').hide();
			content.isdown = false;
			$('.page').css({top:0}).removeClass('down');
		}
		else{
			menu.inverse(false);
			// hide menu > find some way to display it
			$('#menu').addClass('mini');
			$('#bullet').hide();

			// show only the first blog post on home page
			$('.section.blog .article').hide()
			$($('.section.blog .article').get(0)).show()

			$('.page').css({width: '100%',marginLeft: 0});
			$('.page').css({top: height-50}).addClass('down');
			content.isdown = true;

			$('.content').css({paddingTop: '60px'}).show();
			$('.container').css({overflowY: 'auto'});

			$('#updown').show();

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
