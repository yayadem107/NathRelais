<?php
/**
 * Nath'Relais — envoi du formulaire de contact par email.
 * Utilise la fonction mail() de l'hébergement (Hostinger).
 */

// Adresse qui reçoit les demandes
$destinataire = 'contact.nathrelais@gmail.com';

header('Content-Type: application/json; charset=utf-8');

function repondre($ok, $message, $code = 200) {
    http_response_code($code);
    echo json_encode(['success' => $ok ? 'true' : 'false', 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    repondre(false, 'Méthode non autorisée', 405);
}

// Accepte JSON ou formulaire classique
$data = $_POST;
$brut = file_get_contents('php://input');
if (empty($data) && $brut) {
    $json = json_decode($brut, true);
    if (is_array($json)) $data = $json;
}

// Piège anti-robots
if (!empty($data['_honey'])) {
    repondre(true, 'ok');
}

function champ($data, $cle, $max = 200) {
    $v = isset($data[$cle]) ? trim((string) $data[$cle]) : '';
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v); // pas d'injection d'en-têtes
    return mb_substr($v, 0, $max);
}

$nom       = champ($data, 'nom');
$prenom    = champ($data, 'prenom');
$email     = champ($data, 'email');
$telephone = champ($data, 'telephone', 40);
$objet     = champ($data, 'objet');
$message   = isset($data['message']) ? mb_substr(trim((string) $data['message']), 0, 5000) : '';

if ($nom === '' || $prenom === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    repondre(false, 'Champs obligatoires manquants ou email invalide', 422);
}

$domaine = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'nathrelais.fr');
$domaine = preg_replace('/[^a-z0-9.\-]/i', '', $domaine);

$sujet = "Nouvelle demande Nath'Relais — " . ($objet ?: 'Contact') . " — $prenom $nom";

$corps  = "Nouvelle demande reçue depuis le site Nath'Relais\n";
$corps .= "-----------------------------------------------\n\n";
$corps .= "Nom       : $nom\n";
$corps .= "Prénom    : $prenom\n";
$corps .= "Email     : $email\n";
$corps .= "Téléphone : " . ($telephone ?: '—') . "\n";
$corps .= "Objet     : " . ($objet ?: '—') . "\n\n";
$corps .= "Message :\n$message\n\n";
$corps .= "-----------------------------------------------\n";
$corps .= "Répondez directement à cet email pour écrire à $prenom $nom.\n";

$entetes  = "From: Nath'Relais <noreply@$domaine>\r\n";
$entetes .= "Reply-To: $prenom $nom <$email>\r\n";
$entetes .= "MIME-Version: 1.0\r\n";
$entetes .= "Content-Type: text/plain; charset=UTF-8\r\n";
$entetes .= "Content-Transfer-Encoding: 8bit\r\n";

$sujetEncode = '=?UTF-8?B?' . base64_encode($sujet) . '?=';

if (mail($destinataire, $sujetEncode, $corps, $entetes, "-fnoreply@$domaine")) {
    repondre(true, 'Message envoyé');
}

repondre(false, "L'envoi de l'email a échoué", 500);
