// 
//  general.js
//  proportio
//  
//  Created by gaspard on 2010-12-06.
// 
		
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
		$('#content').css({marginTop:(this.display.h-$('#content').height()-30)});
		
	},
	load: function(){
		
		console.log(proportio.choose());
		
		
		var img = new Image();
		$(img).load(function () {
			$('#b').css({
					backgroundImage: 'url('+proportio.choose()+')',
			});
			$('#b').fadeIn();

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
		return this.image.path + this.image.name 
			+ this.image.sizes[i].w + 'x' +  this.image.sizes[i].h + '.jpg';
	}
}



$(document).ready(function(){
	
	// general display
	proportio.image.name= $('body').attr('id'); // this won't be working anymoye
	$('#b').css({backgroundColor:proportio.display.bgcolor});
	proportio.place();
	proportio.load();
	
	// onresize, placeStuffs
	$(window).resize(function(){
		proportio.place();
		proportio.load();
	});
	
	// navigation
	$('#navigation a').click(function(){
		$('#navigation a').removeClass('active');
		$(this).addClass('active');
		$(window).scrollTo( $($(this).attr('href')), 800 );
		return false;
		/*
			TODO use the hash after the scroll
			it might be embed into the plugin
		*/
	});
	if(window.location.hash){
		$('#navigation a').removeClass('active');
		$('a[href='+window.location.hash+']').addClass('active');
	}
	

});



if(typeof console=="undefined"){
	var console = {log: function(){}};
}