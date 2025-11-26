# 📚 Documentation API SpeakTime - Backend

## 🎯 Vue d'ensemble

**SpeakTime Backend** est une API REST construite avec **Node.js/Express** et **MongoDB** pour gérer les utilisateurs, l'authentification, les groupes et les réunions.

**Base URL :** `http://localhost:5000` (développement) | `https://votre-domaine.com` (production)

---

## 🔐 Authentification

### 🔑 Système JWT

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification. Le token expire après **7 jours**.

### Headers requis

Pour toutes les requêtes protégées, incluez :

```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 📋 Endpoints

### 🔓 AUTHENTIFICATION (Public)

#### 1. **Inscription**

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Réponse (201):**

```json
{
  "message": "Compte créé avec succès !"
}
```

**Validations :**

- Email : format valide (ex: `user@domain.com`)
- Username : 3-20 caractères, alphanumériques + tiret/underscore
- Password : 8-50 caractères

**Erreurs :**

- 400 : Cet email est déjà utilisé / Données invalides
- 500 : Erreur serveur

**Rate Limiting :** Max 3 comptes par heure par IP

---

#### 2. **Connexion**

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Réponse (200):**

```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

**Erreurs :**

- 400 : Identifiants invalides
- 500 : Erreur serveur

**Rate Limiting :** Max 5 tentatives par 15 minutes par IP

---

#### 3. **Actualiser le token (Refresh)**

```
POST /api/auth/refresh
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "message": "Token actualisé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Utilisation :** Appeler cet endpoint avant que le token actuel n'expire pour obtenir un nouveau token avec une nouvelle expiration (7 jours).

**Erreurs :**

- 401 : Token invalide ou expiré
- 500 : Erreur serveur

---

### 👥 UTILISATEURS (Protégés)

#### 4. **Récupérer tous les utilisateurs**

```
GET /api/users
Authorization: Bearer <token>
```

**Réponse (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2025-11-26T10:00:00Z"
  }
]
```

---

#### 4. **Récupérer mon profil**

```
GET /api/users/:id
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2025-11-26T10:00:00Z"
}
```

**Erreurs :**

- 403 : Accès non autorisé à ce profil
- 404 : Utilisateur non trouvé

---

#### 5. **Mettre à jour mon profil**

```
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username",
  "email": "newemail@example.com",
  "password": "NewPassword123"
}
```

**Réponse (200):**

```json
{
  "message": "Profil mis à jour avec succès !"
}
```

---

### 📁 GROUPES (Protégés)

#### 6. **Créer un groupe**

```
POST /api/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Team Marketing",
  "description": "Réunions de l'équipe marketing",
  "members": ["Alice", "Bob", "Charlie"]
}
```

**Réponse (201):**

```json
{
  "message": "Groupe créé avec succès !",
  "group": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "Team Marketing",
    "description": "Réunions de l'équipe marketing",
    "members": ["Alice", "Bob", "Charlie"],
    "createdAt": "2025-11-26T10:00:00Z",
    "updatedAt": "2025-11-26T10:00:00Z"
  }
}
```

---

#### 7. **Récupérer tous mes groupes**

```
GET /api/groups
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "groups": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Team Marketing",
      "description": "Réunions de l'équipe marketing",
      "members": ["Alice", "Bob", "Charlie"],
      "createdAt": "2025-11-26T10:00:00Z"
    }
  ]
}
```

---

#### 8. **Récupérer un groupe par ID**

```
GET /api/groups/:id
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "group": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "Team Marketing",
    "description": "Réunions de l'équipe marketing",
    "members": ["Alice", "Bob", "Charlie"],
    "createdAt": "2025-11-26T10:00:00Z"
  }
}
```

**Erreurs :**

- 403 : Accès non autorisé à ce groupe
- 404 : Groupe non trouvé

---

#### 9. **Mettre à jour le nom du groupe**

```
PUT /api/groups/:id/name
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Team Marketing - Updated"
}
```

**Réponse (200):**

```json
{
  "message": "Nom du groupe mis à jour !",
  "group": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Team Marketing - Updated",
    ...
  }
}
```

---

#### 10. **Mettre à jour la description du groupe**

```
PUT /api/groups/:id/description
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Nouvelle description"
}
```

**Réponse (200):**

```json
{
  "message": "Description du groupe mise à jour !",
  "group": { ... }
}
```

---

#### 11. **Ajouter des membres au groupe**

```
POST /api/groups/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "members": ["David", "Eve"]
}
```

**Réponse (200):**

```json
{
  "message": "Membres ajoutés au groupe !",
  "group": {
    "_id": "507f1f77bcf86cd799439012",
    "members": ["Alice", "Bob", "Charlie", "David", "Eve"],
    ...
  }
}
```

---

#### 12. **Retirer des membres du groupe**

```
DELETE /api/groups/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "members": ["Bob"]
}
```

**Réponse (200):**

```json
{
  "message": "Membres retirés du groupe !",
  "group": {
    "_id": "507f1f77bcf86cd799439012",
    "members": ["Alice", "Charlie", "David", "Eve"],
    ...
  }
}
```

---

#### 13. **Récupérer les membres d'un groupe**

```
GET /api/groups/:id/members
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "members": ["Alice", "Bob", "Charlie"],
  "groupName": "Team Marketing"
}
```

_Utilisé pour récupérer les participants pour les réunions_

---

#### 14. **Supprimer un groupe**

```
DELETE /api/groups/:id
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "message": "Groupe supprimé avec succès !"
}
```

---

### 📅 RÉUNIONS (Protégés)

#### 15. **Créer une réunion**

```
POST /api/meetings
Authorization: Bearer <token>
Content-Type: application/json

{
  "groupId": "507f1f77bcf86cd799439012",
  "participants": [
    "Alice",
    "Bob",
    "Charlie"
  ],
  "duration": 60
}
```

**Réponse (201):**

```json
{
  "message": "Réunion créée avec succès !",
  "meeting": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "groupId": "507f1f77bcf86cd799439012",
    "title": "Réunion du 26/11/2025",
    "date": "2025-11-26T10:00:00Z",
    "duration": 60,
    "participants": [
      { "name": "Alice", "speakingTime": 0 },
      { "name": "Bob", "speakingTime": 0 },
      { "name": "Charlie", "speakingTime": 0 }
    ],
    "notes": ""
  }
}
```

---

#### 16. **Récupérer toutes mes réunions**

```
GET /api/meetings
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "meetings": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Réunion du 26/11/2025",
      "date": "2025-11-26T10:00:00Z",
      "duration": 60,
      "participants": [...]
    }
  ]
}
```

---

#### 17. **Récupérer une réunion par ID**

```
GET /api/meetings/:id
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "meeting": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Réunion du 26/11/2025",
    "date": "2025-11-26T10:00:00Z",
    "duration": 60,
    "participants": [
      { "name": "Alice", "speakingTime": 15 },
      { "name": "Bob", "speakingTime": 25 },
      { "name": "Charlie", "speakingTime": 20 }
    ]
  }
}
```

---

#### 18. **Mettre à jour les participants/temps de parole**

```
PUT /api/meetings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "participants": [
    { "name": "Alice", "speakingTime": 15 },
    { "name": "Bob", "speakingTime": 25 },
    { "name": "Charlie", "speakingTime": 20 }
  ]
}
```

**Réponse (200):**

```json
{
  "message": "Réunion mise à jour !",
  "meeting": { ... }
}
```

---

#### 19. **Supprimer une réunion**

```
DELETE /api/meetings/:id
Authorization: Bearer <token>
```

**Réponse (200):**

```json
{
  "message": "Réunion supprimée avec succès !"
}
```

---

## 🔒 Sécurité

### ✅ Mesures implémentées

1. **CORS Stricte**

   - Accepte seulement `https://speaktime.vercel.app`
   - Authentification par headers

2. **Validation d'Input**

   - Email : format valide
   - Password : 8-50 caractères
   - Username : 3-20 caractères, alphanumériques

3. **Rate Limiting**

   - Login : 5 tentatives / 15 minutes par IP
   - Register : 3 comptes / heure par IP

4. **Authentification JWT**

   - Token expire après 7 jours
   - Stockage sécurisé dans `JWT_SECRET`

5. **Gestion des erreurs**

   - Erreurs détaillées seulement en logs serveur
   - Réponses génériques au client

6. **Ownership Verification**
   - Vérification que l'utilisateur possède ses groupes/réunions
   - Pas d'accès cross-user

---

## 📦 Environnement

### Variables requises (`.env`)

```
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/database
JWT_SECRET=votre_clé_secrète_très_longue
FRONTEND_URL=http://localhost:3000 (dev) ou https://votre-domaine.com (prod)
NODE_ENV=development
```

---

## 🚀 Stack Technique

| Composant  | Version   | Usage            |
| ---------- | --------- | ---------------- |
| Node.js    | 18+       | Runtime          |
| Express    | ^5.1.0    | Framework Web    |
| MongoDB    | 8.19.2    | Base de données  |
| Mongoose   | ^8.19.2   | ODM              |
| JWT        | ^9.0.2    | Authentification |
| Bcrypt     | ^6.0.0    | Hash password    |
| CORS       | ^2.8.5    | Cross-Origin     |
| Rate-Limit | ^8.2.1    | Throttling       |
| Validator  | ^13.15.23 | Validation       |

---

## 📝 Codes de Statut HTTP

| Code | Signification                             |
| ---- | ----------------------------------------- |
| 200  | ✅ OK - Succès                            |
| 201  | ✅ Created - Ressource créée              |
| 400  | ❌ Bad Request - Données invalides        |
| 401  | ❌ Unauthorized - Token invalide/manquant |
| 403  | ❌ Forbidden - Accès non autorisé         |
| 404  | ❌ Not Found - Ressource non trouvée      |
| 429  | ❌ Too Many Requests - Rate limit dépassé |
| 500  | ❌ Server Error - Erreur serveur          |

---

## 💡 Exemples cURL

### Inscription

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Récupérer les groupes

```bash
curl -X GET http://localhost:5000/api/groups \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔍 Debugging

### Logs serveur

Les erreurs détaillées sont loggées côté serveur :

```javascript
console.error("Erreur lors de la création du groupe :", error);
```

### Test endpoints

Utilisez **Postman** ou **Insomnia** pour tester les endpoints

### Variables d'environnement

Vérifiez que `.env` est bien chargé :

```javascript
console.log(process.env.MONGO_URI); // doit afficher l'URI
```

---

## 📞 Support & Contact

Pour des questions, consultez les logs serveur ou contactez l'équipe de développement.

**Développeur :** Sandra Pautonnier  
**Projet :** SpeakTime Backend  
**Date :** 26 Novembre 2025

---

✅ **Documentation complète et à jour !**
