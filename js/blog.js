// 
//  blog.js
//  
//  Created by gaspard on 2013-03-06.
// 
$(document).ready(function() {

	$('.date').each(function(i){
		var d = $(this),
			w = 40- d.width();
		d.css({'margin-left':w});
		window.setTimeout(function(){
			d.fadeIn("fast");
		},i*200)
	})
	
});

