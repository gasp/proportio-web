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
	
	// bootstrap this
	$("input.submit").addClass('btn btn-inverse');
	$(".erreur_message").addClass('alert alert-error');
	$(".reponse_formulaire_ok").addClass('alert alert-success');
	$(".previsu .comment").addClass('alert alert-info');
	$(".control-group.erreur").addClass('error');
	
	
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
