var proportio={
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

		//place bottom text
		$('#content').css({paddingTop:(this.display.h-$('#content').height()-30)});

		// place pola if there is one
		l = (this.display.w)/3-160;
		t = (this.display.h)/2-180;
		$('#pola').css({top: t, left:l, display: 'block'});
		
		// place navigation if there is one
		$("#nav .left").css({top:(this.display.h)/2});
		$("#nav .right").css({top:(this.display.h)/2,left:(this.display.w-30)});

	},
	load: function(){

		console.log(proportio.choose());


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
	}
}

$(document).ready(function(){
	
	proportio.image.name= $('#page').attr('class');
	
	$('#page').css({backgroundColor:proportio.display.bgcolor});
	proportio.place();
	proportio.load();
	
	// onresize, placeStuffs
	$(window).resize(function(){
		proportio.place();
		proportio.load();
	});
	
	
	// display a bullet under the menu
	$("#menu li a.on").each(function(){
		left = parseInt($(this).context.offsetLeft+($(this).width()/2));
		$('#bullet').css({left:left});
	});
	$("#menu li a").bind('mouseover',function(){
		left = parseInt($(this).context.offsetLeft+($(this).width()/2));
		$('#bullet').animate({left:left});
	}).bind('mouseout',function(){
		try{
			window.killTimeout(menutempo);
		}
		catch(e){}
		menutempo = window.setTimeout(function(){
			if($.timers.length<1){
				$("#menu li a.on").each(function(){
					left = parseInt($(this).context.offsetLeft+($(this).width()/2));
					$('#bullet').animate({left:left});
				});
			}
		},3000);
	});
	
	//make navigation work
	$("#nav div").each(function(i){
		$(this).bind('mouseover',function(){
			$(this);
		}).bind('click',function(){
			self.location.href = $(this).find('a').attr('href');
		})
	})
	
	
});


if(typeof console=="undefined"){
	var console = {log: function(){}};
}