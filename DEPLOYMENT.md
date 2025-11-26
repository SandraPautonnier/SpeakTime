# Guide de Déploiement - SpeakTime

## 1. Déployer le Frontend (Vercel)

### Étapes :

1. Pousser le code sur GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Connecter votre repo GitHub
4. Sélectionner le projet et cliquer "Import"
5. Configurer les variables d'environnement :
   - `REACT_APP_API_URL` → URL de votre backend Render

### Variables d'environnement Vercel :

```
REACT_APP_API_URL=https://speaktime-backend.onrender.com
```

## 2. Déployer le Backend (Render)

### Prérequis backend :

- Node.js + Express
- MongoDB (Render supporte MongoDB)
- Variables d'environnement configurées

### Étapes :

1. Créer un compte sur [render.com](https://render.com)
2. Cliquer "New +" → "Web Service"
3. Connecter votre repo GitHub (branche backend)
4. Configurer :
   - **Name** : speaktime-backend
   - **Runtime** : Node
   - **Build command** : `npm install`
   - **Start command** : `npm start`
5. Ajouter les variables d'environnement :
   - `MONGODB_URI` → Votre connexion MongoDB
   - `JWT_SECRET` → Une clé secrète pour les JWT
   - `NODE_ENV` → production
   - `PORT` → 3000 (Render l'assignera automatiquement)

### Variables d'environnement Backend (Render) :

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/speaktime
JWT_SECRET=votre-cle-secrete-tres-longue-et-aleatoire
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://speaktime-frontend.vercel.app
```

## 3. Configuration CORS

### Sur le backend (Express) :

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

## 4. Vérifier les connexions

### Frontend → Backend :

1. Ouvrir DevTools (F12)
2. Aller dans "Console"
3. Essayer de se connecter
4. Vérifier les erreurs réseau dans "Network"

### Erreur commune : "Unexpected token 'T', ... not valid JSON"

**Cause** : Le backend retourne du HTML au lieu de JSON
**Solutions** :

- Vérifier que le backend est en ligne
- Vérifier que l'URL `REACT_APP_API_URL` est correcte
- Vérifier que CORS est configuré correctement
- Vérifier les logs du backend pour les erreurs

## 5. Configuration du domaine personnalisé

### Sur Vercel :

1. Dashboard → Projet → Settings → Domains
2. Ajouter votre domaine personnalisé
3. Configurer les DNS records

### Sur Render :

1. Dashboard → Service → Custom Domain
2. Ajouter votre domaine personnalisé
3. Configurer les DNS records

## 6. Monitoring et Logs

### Vercel :

- Dashboard → Projet → Deployments
- Cliquer sur un deployment pour voir les logs

### Render :

- Dashboard → Service → Logs
- Voir les logs en temps réel

## 7. Mise à jour de l'URL API après déploiement

### Mettre à jour Vercel :

1. Dashboard → Projet → Settings → Environment Variables
2. Modifier `REACT_APP_API_URL` avec la nouvelle URL Render
3. Redéployer (Render → Deployments → Trigger Deploy)

### Redéployer Vercel après changement :

```bash
git push origin main  # Pousse les changements
# Vercel redéploiera automatiquement
```

## 8. Checklist de déploiement

✅ Backend sur Render

- [ ] Database MongoDB configurée
- [ ] JWT_SECRET défini
- [ ] CORS configuré
- [ ] Variables d'environnement définies
- [ ] Health check endpoint `/health` disponible

✅ Frontend sur Vercel

- [ ] `REACT_APP_API_URL` pointant vers Render
- [ ] Build process : `npm run build`
- [ ] `.env.local` ignoré dans Git
- [ ] Tests d'inscription/connexion réussis

✅ Communication Frontend ↔ Backend

- [ ] Pas d'erreurs CORS
- [ ] Pas d'erreurs 404 sur les endpoints
- [ ] Les tokens JWT sont reçus correctement
- [ ] Les requêtes authentifiées fonctionnent

## 9. Troubleshooting

### Le frontend ne peut pas se connecter au backend

1. Vérifier l'URL : `https://speaktime-backend.onrender.com` (pas http)
2. Vérifier CORS dans le backend
3. Vérifier les logs du backend : `Render Dashboard → Logs`
4. Tester l'API directement : `curl https://speaktime-backend.onrender.com/health`

### Erreur "Unexpected token 'T', ... not valid JSON"

1. Vérifier les logs du backend
2. L'API peut retourner une page d'erreur HTML au lieu de JSON
3. Vérifier que tous les endpoints répondent en JSON

### Token JWT invalide après déploiement

1. Vérifier que `JWT_SECRET` est le même entre déploiements
2. Nettoyer le localStorage : `localStorage.clear()`
3. Se reconnecter

## 10. URLs finales exemple

```
Frontend:  https://speaktime.vercel.app
Backend:   https://speaktime-backend.onrender.com

REACT_APP_API_URL=https://speaktime-backend.onrender.com
```

---

Pour plus d'aide :

- Docs Vercel : https://vercel.com/docs
- Docs Render : https://render.com/docs
- JWT : https://jwt.io
