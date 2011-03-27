/*!
* jquery.font
* http://www.beseku.com/2009/04/22/detecting-installed-fonts-with-jquery/
*
* Copyright (c) 2009 Ben sekulowicz-Barclay
*
* Date: 2009-05-06 (Wed, 06 May 2009)
* Revision: 1.1
*/
 
jQuery.font={test:function(user_family,base_family,user_weight,base_weight){var base={family:'monospace',weight:'400'};var user={family:'monospace',weight:'400'};base.family=(typeof(base_family)!='undefined')?base_family:base.family;base.weight=(typeof(base_weight)!='undefined')?base_weight:base.weight;user.family=(typeof(user_family)!='undefined')?user_family:user.family;user.weight=(typeof(user_weight)!='undefined')?user_weight:user.weight;$('body').prepend('<p id="jQuery-Font-Test" style="font-family:'+base.family+';font-size:72px;font-weight:'+base.weight+';height:auto;left:-9999px;position:absolute;top:-9999px;visibility:hidden;width:auto;">The quick brown fox jumps over a lazy dog.</p>');var baseX=$('p#jQuery-Font-Test').width();var baseY=$('p#jQuery-Font-Test').height();$('p#jQuery-Font-Test').css({'font-family':(user.family+','+base.family),'font-weight':user.weight});var userX=$('p#jQuery-Font-Test').width();var userY=$('p#jQuery-Font-Test').height();$('p#jQuery-Font-Test').remove();return(((userY!=baseY)||(userX!=baseX))?true:false);}};