// 
//  ui.js
//  proportio
//  
//  Created by gaspard on 2013-02-01
// 

var slider = {
	data: {
		numberOfSlides:0
	},
	init: function(){
		$(".container").iosSlider({
			snapToChildren: true,
			desktopClickDrag: true,
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
		// auto color
		$(".slider .item").each(function(i){
			var r = Number(Math.floor(Math.random()*0xFF)).toString(16);
			$(this).css({'background-color':'#'+r+r+r});
			if(!i)
				$(this).addClass('first');
		});
		$(".slider .item").last().addClass('last');
		$("#nav .left a").hide();
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
		content.place();
	},
	place: function(){
		//place bottom text
		var height = $(document).height(),
			width = $(document).width()
			space = height-$('.content').height()-30;
		
		if(width>800){
			$('.page').show()
			$('.content').css({paddingTop:space});
		}
		else{
			$('.page').hide()
		}
		
		
	}
	
}

var backgroud ={
	image: {
		name: null,
		path: '/iconography/',
//		path: 'http://freelancis.net/~franck/proportio/iconography/',
		sizes:[{w: 640,h: 480},{w: 800,h: 600},{w:1024,h: 768},{w:1280,h: 960},{w:1600,h:1200},{w:2048,h:1536}]
	},
	display: {
		bgcolor:'#bccea6',
		w:null,
		h:null,
		landscape:null
		
	},
	place: function(){
		this.display.w = $(document).width();
		this.display.h = $(document).height();

		/*
			WARNING : document and window do not have the same dimension
		*/

		// are we in a portrait or in landscape display (viewport?)
		this.display.landscape = (this.display.w*3>this.display.h*4);

	},
	load: function(){

		console.log(proportio.choose());
		
		$("div.page").each(function(i){
			console.log(this);
			console.log($(this).data('id_article'))
			console.log($(this).data('id_article'))
			$(this).css({'background-color':'#'+$(this).data('color')})
			.css({left:proportio.display.w*i});
			
			
		});


		var img = new Image();
		$(img).load(function () {
			$('#page').css({
					backgroundImage: 'url('+proportio.choose()+')',
			});
			$('#page').fadeIn();

		}).error(function () {
			//image load fail
		}).attr('src',proportio.choose());
	},
	choose: function(){
		/*
		 if we are in landscape viewport mode, we gonna choose the image depending on the width
		 if we are in portrait, let's choose depending on the height
		*/
		console.log(this);

		var i=0;
		while((!this.display.landscape && (this.display.h > this.image.sizes[i].h))
			||(this.display.landscape && (this.display.w > this.image.sizes[i].w))){
			console.log(i);

			i++;
		}
		console.log({display:this.display,selectedImage:this.image.sizes[i]});

		/*
		 images' url is path/ name width x height .jpg
		 http://i.try.com/iconography/page_home800x600.jpg
		*/
		return this.image.path + "page_" + this.image.name 
			+ this.image.sizes[i].w + 'x' +  this.image.sizes[i].h + '.jpg';
	},
	nav: function(){
		$('#nav a').bind('click',function(e){
			
			e.preventDefault();
		})
	},
	schtroumpf: function(){
		/*
		proportio.image.name= $('#page').attr('class');

		$('#page').css({backgroundColor:proportio.display.bgcolor});
		proportio.place();
		proportio.load();

		// onresize, placeStuffs
		$(window).resize(function(){
			proportio.place();
			proportio.load();
		});
		proportio.nav();


		*/
		
	}
}


$(document).ready(function(){
	slider.init();
	menu.init();
	content.init();

	$(window).bind('resize',function(){
		content.place();
	})
	
	console.log('init');
});


