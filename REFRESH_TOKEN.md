# Système de Refresh Token - Documentation

## Vue d'ensemble

Un système de **refresh token automatique** a été implémenté pour améliorer l'expérience utilisateur. Au lieu de déconnecter l'utilisateur quand le token expire, le système rafraîchit automatiquement le token en arrière-plan.

## Fonctionnement

### 1. **Détection d'expiration imminente**

Avant chaque requête API, `apiClient.js` vérifie si le token expire dans les **5 prochaines minutes**.

```javascript
// Dans apiCall()
if (token && shouldRefreshToken(token)) {
  const newToken = await refreshToken();
}
```

### 2. **Rafraîchissement automatique**

Si le token expire bientôt, une requête est envoyée à l'endpoint `/api/auth/refresh` :

```
POST /api/auth/refresh
Authorization: Bearer {expiring_token}
```

**Réponse attendue :**

```json
{
  "token": "new_jwt_token"
}
```

### 3. **Gestion des requêtes concurrentes**

Pour éviter les problèmes de race condition, les requêtes de refresh concurrentes sont synchronisées :

```javascript
let isRefreshing = false;
let refreshPromise = null;

// Si déjà en cours de refresh, attendre le résultat
if (isRefreshing) {
  return refreshPromise;
}
```

### 4. **Stockage du nouveau token**

Le nouveau token est automatiquement stocké dans `localStorage` et utilisé pour les requêtes suivantes.

## Architecture

### **jwtUtils.js** - Utilitaires JWT

**Nouvelle fonction :**

- `shouldRefreshToken(token)` - Vérifie si le token expire dans moins de 5 minutes

```javascript
export const shouldRefreshToken = (token) => {
  const timeRemaining = getTokenTimeRemaining(token);
  // Rafraîchir si moins de 5 minutes (300 secondes) restantes
  return timeRemaining < 300 && timeRemaining > 0;
};
```

### **apiClient.js** - Client API amélioré

**Nouvelles fonctionnalités :**

1. **Fonction `refreshToken()`** - Envoie une requête de refresh au backend

   - Gère les requêtes concurrentes
   - Déconnecte l'utilisateur si le refresh échoue
   - Stocke le nouveau token

2. **Logique dans `apiCall()`** - Vérifie avant chaque requête
   ```javascript
   if (token && shouldRefreshToken(token)) {
     const newToken = await refreshToken();
   }
   ```

### **useAuthStore.jsx** - Store d'authentification

**Nouvelle méthode publique :**

- `refreshToken()` - Permet un refresh manuel si besoin

```javascript
const { refreshToken } = useAuthStore();
await refreshToken(); // Rafraîchit manuellement le token
```

## Flux d'une requête API

```
1. Utilisateur appelle une action (ex: fetchGroups())
   ↓
2. apiGet('/api/groups') est appelé
   ↓
3. apiCall() vérifie shouldRefreshToken()
   ↓
4. Si expiration imminente:
   - Envoie requête POST /api/auth/refresh
   - Reçoit nouveau token
   - Stocke le nouveau token
   ↓
5. Procède avec la requête API originale (GET /api/groups)
   - Utilise le nouveau token (ou l'ancien si refresh réussi)
   ↓
6. Retourne les données
```

## Avantages

✅ **Meilleure UX** : L'utilisateur n'est pas déconnecté inopinément  
✅ **Transparent** : Le refresh se fait automatiquement, sans action utilisateur  
✅ **Sécurisé** : Prévient les race conditions avec la synchronisation  
✅ **Gracieux** : Si le refresh échoue, l'utilisateur est redirigé vers login

## Configuration backend requise

Le backend doit implémenter l'endpoint `/api/auth/refresh` :

```javascript
// Exemple (Node.js/Express)
app.post("/api/auth/refresh", authenticateToken, (req, res) => {
  const user = req.user;
  const newToken = generateJWT(user);

  res.json({ token: newToken });
});
```

**Points importants :**

- Doit vérifier le token existant avec `authenticateToken`
- Retourne un nouveau token avec une expiration mise à jour
- Peut avoir une expiration plus longue que le token original

## Améliorations futures

- [ ] Implémenter des refresh tokens séparés (refresh token en httpOnly cookie)
- [ ] Ajouter un système de revocation de tokens
- [ ] Monitorer les statistiques de refresh
- [ ] Implémenter un logout de tous les appareils

## Résumé des fichiers modifiés

| Fichier                      | Modifications                                    |
| ---------------------------- | ------------------------------------------------ |
| `src/utils/jwtUtils.js`      | Ajout de `shouldRefreshToken()`                  |
| `src/utils/apiClient.js`     | Ajout de `refreshToken()` + logique de détection |
| `src/store/useAuthStore.jsx` | Ajout de la méthode `refreshToken()` publique    |
