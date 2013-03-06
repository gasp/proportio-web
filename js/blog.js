// 
//  blog.js
//  
//  Created by gaspard on 2013-03-06.
// 
$(document).ready(function() {

	$(window).bind('resize',function(){
		place.date();
	})
	place.date();
	
	
});

var place = {
	// generic date
	date: function () {
		ww = $(window).width();
		if(ww > 768)
			place.datew();
		else
			place.dates();
	},
	
	// place date on wide screen
	datew: function () {
		$('.date').each(function(i){
			var d = $(this),
				w = 40- d.width();
			d.css({'margin-left':w});
			window.setTimeout(function(){
				d.fadeIn("fast");
			},i*200)
		});
	},
	// hide date on small screen
	dates: function () {
		$('.date').each(function(i){
			$(this).hide();
		})
	}
	
	
	
}
