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
 * background unstable
 * init stable
 */

var slider = {
	data: {
		numberOfSlides:0
	},
	init: function(){
		$(".container").iosSlider({
			snapToChildren: true,
			desktopClickDrag: true, // really, this has to be false in prod
			keyboardControls: true,
			navNextSelector: $("#nav .right a"),
			navPrevSelector: $("#nav .left a"),
			unselectableSelector: $("#menu, #bullet"),
			onSlideChange: function(sl){
				slider.change(sl)
			},
			onSliderLoaded: function(sl){
				slider.data = sl.data;
			}
		});
		
		// nav
		if(slider.data.numberOfSlides == 1)
			$("#nav .right a").hide();
		$("#nav .left a").hide();
		$("#nav a").bind("click",function(e){
			e.preventDefault();
			return false;
		});
	},
	update: function(){
		/* call to rerender iosSlider
		$(".iosSlider1").iosSlider("update");
		*/
	},
	change: function(sl){
		if(sl.currentSlideNumber > 1) $("#nav .left a").fadeIn();
		else $("#nav .left a").fadeOut();
		if(sl.currentSlideNumber < slider.data.numberOfSlides) $("#nav .right a").fadeIn();
		else $("#nav .right a").fadeOut();
	}
};

var menu = {
	init: function(){
		// display a bullet under the menu
		$("#menu li a.on").each(function(){
			left = parseInt($(this).context.offsetLeft+($(this).width()/2));
			$('#bullet').css({left:left});
		});
		$("#menu li a").bind('mouseover',function(){
			left = parseInt($(this).context.offsetLeft+($(this).width()/2));
			$('#bullet').stop().animate({left:left});
		}).bind('mouseout',function(){
			try{
				window.killTimeout(menutempo);
			}
			catch(e){}
			menutempo = window.setTimeout(function(){
				if($.timers.length<1){
					$("#menu li a.on").each(function(){
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
	}
};

var content = {
	init: function(){
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
		
		if(width>800){
			$('.page').show();
			if(animate === true)
				$('.content').animate({paddingTop:space},"fast");
			else
				$('.content').css({paddingTop:space});

		}
		else{
			$('.page').hide()
		}
	}
}


var background = {
	tempo: null,
	init: function(){
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
		background.tempo = window.setTimeout(function(){
			$(".slider .slide").each(function(i){
				background.fetch(this);
			});
		},300);
		
	},	
	fetch: function (slide) {
		var width = $(document).width(),
			height = $(document).height(),
			type='article',
			id=$(slide).data('id_article')
			url = '/spip.php',
			data = {
				page: 'background.json',
				id_article: id,
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
				background.set(slide,d.file);
			},
			error: function(d,e){
				console.log('error',e,d);
			}
		})
	},
	set: function(slide,file){
		$(slide).css({'background-image':'url('+file+')'});	
	}

}


$(document).ready(function(){
	slider.init();
	background.init();
	var t = window.setTimeout(function(){
		menu.init();
		content.init();
	},300);
	
	$(window).bind('resize',function(){
		content.place();
		background.update();
	})
});


if(typeof console === "undefined"){
	var console = {log: function(){},dir:function(){}};
}
