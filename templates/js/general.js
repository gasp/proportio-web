// 
//  general.js
//  proportio
//  
//  Created by gaspard on 2010-12-06.
// 
		
var proportio={
	image: {
		name: null,
		path: 'http://proportio.site/iconography/',
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
		// are we in a portrait or in landscape display (viewport?)
		this.display.landscape = (this.display.w*3>this.display.h*4);

		//place bottom text
		$('#content').css({marginTop:(this.display.h-$('#content').height()-30)});
		
	},
	load: function(){
		
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
		var i=0;
		while((!this.display.landscape && (this.display.h > this.image.sizes[i].h))
			||(this.display.landscape && (this.display.w > this.image.sizes[i].w))){
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
	proportio.image.name= $('body').attr('id');
	$('#b').css({backgroundColor:proportio.display.bgcolor});
	proportio.place();
	proportio.load();
	
	// onresize, placeStuffs
	$(window).resize(function(){
		proportio.place();
		proportio.load();
	});

});



if(typeof console=="undefined"){
	var console = {log: function(){}};
}