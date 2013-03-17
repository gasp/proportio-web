<?php

define('_SPIP_SCRIPT','');
define('_url_minuscules',1);
define('_url_arbo_minuscules',1);
define('_MARQUEUR_URL','');
define('_url_propres_sep_id','-');
define('_URLS_PROPRES_MIN', 0);
define('_URLS_PROPRES_MAX', 80);
define('_URLS_ARBO_MIN', 0);
define('_URLS_ARBO_MAX', 80);

$GLOBALS['quota_cache'] = 500;
define('_DUREE_CACHE_DEFAUT', 24*3600*30);

function affdate_simple($d){
	$d=strtotime($d);
	$today = array('Y'=>date('Y'),'m'=>date('m'),'d'=>date('d'));
	$date  = array('Y'=>date('Y',$d),'m'=>date('m',$d),'d'=>date('d',$d));
	if($date['Y'] == $today['Y']) return date('M',$d).', '.date('dS',$d);
	else return date('M',$d).' '.$date['Y'];
}