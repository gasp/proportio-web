<?php

$GLOBALS['quota_cache'] = 500;
define('_DUREE_CACHE_DEFAUT', 24*3600*30);

function affdate_simple($d){
	$d=strtotime($d);
	$today = array('Y'=>date('Y'),'m'=>date('m'),'d'=>date('d'));
	$date  = array('Y'=>date('Y',$d),'m'=>date('m',$d),'d'=>date('d',$d));
	var_dump($date);
	var_dump($today);
	if($date['Y'] == $today['Y']) return date('M',$d).', '.date('dS',$d);
	else return date('M',$d).' '.$date['Y'];
}