# Intégration JWT - Documentation

## Vue d'ensemble

SpeakTime utilise JWT (JSON Web Tokens) pour l'authentification. Le token JWT est stocké dans `localStorage` et automatiquement inclus dans toutes les requêtes API.

## Structure

### 1. **Utilitaires JWT** (`src/utils/jwtUtils.js`)

Fonctions pour gérer les JWT côté client :

- `decodeJWT(token)` - Décode un JWT sans vérification
- `isTokenExpired(token)` - Vérifie si un token a expiré
- `isTokenValid()` - Vérifie si le token actuel est valide
- `getTokenTimeRemaining(token)` - Obtient le temps restant avant expiration
- `getUserFromToken(token)` - Extrait les données utilisateur du token

### 2. **Client API** (`src/utils/apiClient.js`)

Fournit des fonctions pour faire des requêtes avec authentification JWT automatique :

```javascript
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiCall,
} from "../utils/apiClient";

// GET request
const data = await apiGet("/api/groups");

// POST request
const result = await apiPost("/api/groups", { name: "My Group" });

// PUT request
const updated = await apiPut("/api/groups/123", { name: "Updated" });

// DELETE request
await apiDelete("/api/groups/123");
```

**Fonctionnalités :**

- Ajoute automatiquement le header `Authorization: Bearer {token}`
- Gère les erreurs 401 (token expiré) et redirige vers `/login`
- Convertit automatiquement les données en JSON

### 3. **Store d'authentification** (`src/store/useAuthStore.jsx`)

Gère l'état d'authentification :

```javascript
import useAuthStore from "../store/useAuthStore";

const { user, token, login, logout, isAuthenticated } = useAuthStore();
```

**Méthodes :**

- `login(formData)` - Connecte l'utilisateur et stocke le token
- `logout()` - Déconnecte et nettoie le localStorage
- `register(formData)` - Enregistre un nouvel utilisateur
- `isAuthenticated()` - Vérifie l'authentification
- `clearError()` / `clearSuccess()` - Nettoie les messages

**À l'initialisation :**

- Vérifie automatiquement si un token stocké a expiré
- Nettoie le localStorage si le token est expiré

### 4. **Route protégée** (`src/components/ProtectedRoute.jsx`)

Wrapper pour les routes qui nécessitent une authentification :

```jsx
import ProtectedRoute from "../components/ProtectedRoute";

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

Redirige automatiquement vers `/login` si l'utilisateur n'est pas authentifié.

## Flux d'authentification

### Connexion

1. L'utilisateur saisit ses identifiants
2. `login()` envoie une requête POST à `/api/auth/login`
3. Le backend retourne `{ token, user }`
4. Le token est stocké dans `localStorage` avec la clé `"token"`
5. L'utilisateur est redirigé

### Requête API authentifiée

1. Le client appelle `apiGet('/api/groups')`
2. `apiClient` récupère le token depuis `localStorage`
3. Ajoute l'en-tête `Authorization: Bearer {token}`
4. Envoie la requête au serveur
5. Si le serveur retourne 401 : le token est supprimé et l'utilisateur est redirigé vers `/login`

### Déconnexion

1. `logout()` est appelé
2. Le token et l'utilisateur sont supprimés de `localStorage`
3. L'état du store est réinitialisé à `null`

## Configuration de l'API

L'URL de base de l'API est définie via :

```
REACT_APP_API_URL=http://localhost:5000
```

**Dans `.env` ou variables d'environnement Vite**

## Sécurité

### Points à respecter :

✅ **À faire :**

- Toujours utiliser HTTPS en production
- Le token est lisible côté client (ne pas y mettre d'infos sensibles)
- Vérifier le token côté serveur à chaque requête
- Utiliser une durée d'expiration raisonnable (15-30 min)
- Implémenter un refresh token pour renouveler l'accès

⚠️ **À éviter :**

- Ne pas stocker des mots de passe ou données sensibles dans le token
- Ne pas mettre le JWT dans les requêtes GET
- Ne pas ignorer les erreurs 401 (expiration)

## Exemples d'utilisation

### Récupérer les groupes de l'utilisateur

```javascript
import { apiGet } from "../utils/apiClient";

const fetchMyGroups = async () => {
  try {
    const data = await apiGet("/api/groups");
    console.log(data.groups); // Array of groups
  } catch (error) {
    console.error(error.message);
  }
};
```

### Vérifier l'authentification dans un composant

```javascript
import useAuthStore from "../store/useAuthStore";
import { isTokenValid } from "../utils/jwtUtils";

export function MyComponent() {
  const { user, token } = useAuthStore();

  if (!user || !token || !isTokenValid()) {
    return <Navigate to="/login" />;
  }

  return <div>Bienvenue {user.name}!</div>;
}
```

### Afficher le temps restant avant expiration

```javascript
import { getTokenTimeRemaining } from "../utils/jwtUtils";

const timeLeft = getTokenTimeRemaining(token);
console.log(`Token expire dans ${timeLeft} secondes`);
```

## Variables de store

### useAuthStore

- `user: object | null` - Données de l'utilisateur
- `token: string | null` - Token JWT
- `loading: boolean` - Requête en cours
- `error: string | null` - Message d'erreur
- `success: string | null` - Message de succès

### Autres stores

Les stores `useGroupsStore`, `useMeetingsStore`, et `useUsersStore` utilisent automatiquement `apiClient` pour toutes les requêtes et ne nécessitent plus de gestion manuelle du token JWT.

## Notes

- Le token JWT est validé à chaque démarrage de l'app
- Les stores mettent en cache les données côté client
- Les erreurs réseau sont loggées dans la console du navigateur
- Un token expiré provoque automatiquement une redirection vers `/login`
