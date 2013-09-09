<?php

if (!defined('_ECRIRE_INC_VERSION')) return;

function formulaires_request_fabrics_charger_dist(){
	include_spip('inc/texte');
	$puce = definir_puce();
	$valeurs = array(
		'civility_message_auteur'=>'',
		'fname_message_auteur'=>'',
		'lname_message_auteur'=>'',
		'phone_message_auteur'=>'',
		'address_message_auteur'=>'',
		'zip_message_auteur'=>'',
		'city_message_auteur'=>'',
		'country_message_auteur'=>'',
		'texte_message_auteur'=>'',
		'email_message_auteur'=>$GLOBALS['visiteur_session']['email']
	);
	
	$valeurs['rien'] = '';
	return $valeurs;
}

function formulaires_request_fabrics_verifier_dist(){
	$erreurs = array();
	include_spip('inc/filtres');


	//email
	if (!$email = _request('email_message_auteur'))
		$erreurs['email_message_auteur'] = _T("info_obligatoire");
	elseif(!email_valide($email))
		$erreurs['email_message_auteur'] = _T('form_prop_indiquer_email');
	else {
		include_spip('inc/session');
		session_set('email', $email);
	}

	// civility
	if (!$fname=_request('civility_message_auteur'))
		$erreurs['civility_message_auteur'] = _T("info_obligatoire");

	// fname lname
	if (!$fname=_request('fname_message_auteur'))
		$erreurs['fname_message_auteur'] = _T("info_obligatoire");
	if (!$lname=_request('lname_message_auteur'))
		$erreurs['lname_message_auteur'] = _T("info_obligatoire");

	$fname=_request('fname_message_auteur');
	if($fname AND !(strlen($fname)>1))
		$erreurs['fname_message_auteur'] = _T('form_too_short');

	$lname=_request('lname_message_auteur');
	if($lname AND !(strlen($lname)>1))
		$erreurs['lname_message_auteur'] = _T('form_too_short');

	// place
	if (!$place=_request('address_message_auteur'))
		$erreurs['address_message_auteur'] = _T("info_obligatoire");

	if (!_request('confirmer') AND !count($erreurs))
		$erreurs['previsu']=' ';
	return $erreurs;
}

function formulaires_request_fabrics_traiter_dist(){
	
	$mailto = 'gaspard@gmail.com';
	$civil = _request('civility_message_auteur');
	$fname = _request('fname_message_auteur');
	$lname = _request('lname_message_auteur');
	$address = _request('address_message_auteur');
	$zip     = _request('zip_message_auteur');
	$city    = _request('city_message_auteur');
	$country = _request('country_message_auteur');
	$email = _request('email_message_auteur');
	$phone = _request('phone_message_auteur');
	$line  = "------------------------------------\n";

	$sujet = "[".supprimer_tags(extraire_multi($GLOBALS['meta']['nom_site']))."] "
		. "Fabrics request";
	$texte =
		"Good morning,\n"
		."$civil $fname $lname has just requested fabrics!\n";


	$texte .= " Please contact $fname for fixing details\n"
		." email : $email\n"
		." phone : $phone\n"
		." address : $address\n"
		."           ($zip) $city - $country\n"
		.$line
		. _request('texte_message_auteur')
		."\n"
		.$line
		._T('envoi_via_le_site')
		." ".supprimer_tags(extraire_multi($GLOBALS['meta']['nom_site']))
		." (".$GLOBALS['meta']['adresse_site']."/)";

	$envoyer_mail = charger_fonction('envoyer_mail','inc');

	if ($envoyer_mail($mailto, $sujet, array(
		'texte' => $texte,
		'nom_envoyeur' => 'webmaster Try',
		'from' => 'webmaster@try-studio.com',
		'headers' => "X-Originating-IP: ".$GLOBALS['ip']
	))){
		return array('message_ok',_T('form_prop_message_envoye'));
	}
	else{
		return array('message_erreur',_T('pass_erreur_probleme_technique'));
	}
}

?>