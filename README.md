# Nath'Relais — site vitrine

Site statique (HTML / CSS / JavaScript, sans framework ni build) pour Nath'Relais, l'autoentreprise de Nathalie Boubon.

## Pages

| Fichier | Page |
|---|---|
| `index.html` | Accueil |
| `a-propos.html` | À propos |
| `prestations.html` | Prestations + « Pour qui ? » |
| `tarifs.html` | Tarifs indépendants et cabinets comptables |
| `contact.html` | Coordonnées, carte, formulaire de contact |
| `mentions-legales.html` | Mentions légales, RGPD |

Les styles communs sont dans `assets/css/style.css` (couleurs dans `:root`), les scripts dans `assets/js/main.js`, les images dans `assets/img/`.

## Formulaire de contact (envoi par email)

Les messages sont envoyés à **contact.nathrelais@gmail.com** :

1. **`send.php`** (prioritaire) : petit script PHP qui utilise `mail()` de l'hébergement (Hostinger). Rien à configurer, il doit juste être dans le même dossier que `contact.html`. Pour changer l'adresse de réception, modifier `$destinataire` en haut du fichier.
2. **FormSubmit** (secours, si PHP n'est pas disponible) : nécessite d'avoir cliqué une fois sur le lien « Activate Form » reçu sur contact.nathrelais@gmail.com.

Pensez à vérifier le dossier Spam lors des premiers envois.

## Mise en ligne avec GitHub Pages

1. Pousser le dépôt sur GitHub.
2. Settings → Pages → Source : branche `main`, dossier `/ (root)`.
3. Le site est publié sur `https://<utilisateur>.github.io/NathRelais/` (un nom de domaine personnalisé peut être ajouté).

Si le site est hébergé ailleurs, mettre à jour la rubrique « Hébergement » dans `mentions-legales.html`.

## Tester en local

Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur :

```bash
python -m http.server 8000
```

puis aller sur http://localhost:8000.
