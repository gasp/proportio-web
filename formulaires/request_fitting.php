<?php

/***************************************************************************\
 *  SPIP, Systeme de publication pour l'internet                           *
 *                                                                         *
 *  Copyright (c) 2001-2012                                                *
 *  Arnaud Martin, Antoine Pitrou, Philippe Riviere, Emmanuel Saint-James  *
 *                                                                         *
 *  Ce programme est un logiciel libre distribue sous licence GNU/GPL.     *
 *  Pour plus de details voir le fichier COPYING.txt ou l'aide en ligne.   *
\***************************************************************************/


if (!defined('_ECRIRE_INC_VERSION')) return;

function formulaires_request_fitting_charger_dist(){
	include_spip('inc/texte');
	$puce = definir_puce();
	$valeurs = array(
		'fname_message_auteur'=>'',
		'lname_message_auteur'=>'',
		'phone_message_auteur'=>'',
		'place_message_auteur'=>'',
		'texte_message_auteur'=>'',
		'email_message_auteur'=>$GLOBALS['visiteur_session']['email']
	);
	
	// id du formulaire (pour en avoir plusieurs sur une meme page)
	$valeurs['id'] = "rfitting";
	
	return $valeurs;
}

function formulaires_request_fitting_verifier_dist(){
	$erreurs = array();
	include_spip('inc/filtres');


	//email
	if (!$adres = _request('email_message_auteur'))
		$erreurs['email_message_auteur'] = _T("info_obligatoire");
	elseif(!email_valide($adres))
		$erreurs['email_message_auteur'] = _T('form_prop_indiquer_email');
	else {
		include_spip('inc/session');
		session_set('email', $adres);
	}

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
	if (!$place=_request('place_message_auteur'))
		$erreurs['place_message_auteur'] = _T("info_obligatoire");

	if (!_request('confirmer') AND !count($erreurs))
		$erreurs['previsu']=' ';
	return $erreurs;
}

function formulaires_request_fitting_traiter_dist(){
	
	$mailto = 'gaspard@gmail.com';
	$adres = _request('email_message_auteur');
	$fname = _request('fname_message_auteur');
	$lname = _request('lname_message_auteur');
	$place = _request('place_message_auteur');
	$phone = _request('phone_message_auteur');
	$line = "------------------------------------\n";

	$sujet = "[".supprimer_tags(extraire_multi($GLOBALS['meta']['nom_site']))."] "
		. "Fitting request";
	$texte =
		"Good morning,\n$fname $lname has just requested a fitting in $place!\n"
		." Please contact $fname for fixing details\n"
		." email : $adres\n"
		." phone : $adres\n"
		.$line
		. _request('texte_message_auteur')
		."\n"
		.$line
		._T('envoi_via_le_site')
		." ".supprimer_tags(extraire_multi($GLOBALS['meta']['nom_site']))
		." (".$GLOBALS['meta']['adresse_site']."/)";

	$envoyer_mail = charger_fonction('envoyer_mail','inc');

	if ($envoyer_mail($mailto, $sujet, $texte, $adres,
	"X-Originating-IP: ".$GLOBALS['ip'])){
		return array('message_ok',_T('form_prop_message_envoye'));
	}
	else{
		return array('message_erreur',_T('pass_erreur_probleme_technique'));
	}
}

?>
