# Espace client Rahim International

- `index.html` : espace client (connexion par lien envoyé par courriel)
- `admin.html` : gestion des clients (réservé aux adresses de la table `admins`)
- `portail.js` : configuration Supabase et accès aux données
- `?demo=1` : mode démonstration avec des données fictives

Les données clients et les documents sont stockés dans Supabase (base et stockage privés,
protégés par des règles RLS), jamais dans ce dépôt public.
La clé « anon » présente dans `portail.js` est publique par conception.
