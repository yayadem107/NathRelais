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

Le formulaire envoie les messages à **contact.nathrelais@gmail.com** via [FormSubmit](https://formsubmit.co) (gratuit, sans serveur).

**Activation (une seule fois) :**
1. Mettre le site en ligne.
2. Envoyer un premier message de test depuis la page Contact.
3. FormSubmit envoie un email « Confirm your email » à contact.nathrelais@gmail.com : cliquer sur le lien d'activation.
4. Les messages suivants arrivent directement dans la boîte mail.

Optionnel : après l'activation, FormSubmit fournit un identifiant aléatoire. On peut le mettre à la place de l'adresse dans l'attribut `data-endpoint` du formulaire (`contact.html`) pour ne plus faire apparaître l'email dans le code.

Pour changer l'adresse de réception, modifier `data-endpoint` dans `contact.html`.

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

puis aller sur http://localhost:8000. Les fonds de carte OpenStreetMap peuvent ne pas s'afficher quand on ouvre le fichier directement (`file://`). Ils s'affichent une fois le site servi en http(s).
