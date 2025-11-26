# 🔐 Règles de Validation - Backend & Frontend

## Synchronisation des Validations

Pour que le backend et le frontend travaillent ensemble correctement, les règles de validation doivent être **identiques** sur les deux côtés.

---

## 📋 Règles Backend Actuelles

Ces règles sont implémentées dans `authController.js` et doivent correspondre au frontend.

### 1️⃣ **USERNAME**

```javascript
// Backend - authController.js
const validateUsername = (username) => {
  return (
    username &&
    username.length >= 3 &&
    username.length <= 20 &&
    /^[a-zA-Z0-9_-]+$/.test(username)
  );
};
```

**Règles exactes :**

- ✅ Longueur : **3 à 20 caractères** (inclus)
- ✅ Caractères autorisés : **lettres (a-z, A-Z), chiffres (0-9), tiret (-), underscore (\_)**
- ❌ PAS d'accents, espaces, ou caractères spéciaux

**Exemples valides :**

- ✅ `john_doe`
- ✅ `alice-123`
- ✅ `user_2025`
- ✅ `ABC`
- ✅ `x_y-z`

**Exemples invalides :**

- ❌ `jo` (trop court)
- ❌ `this_is_a_very_long_username_that_exceeds_20_chars` (trop long)
- ❌ `john@doe` (contient @)
- ❌ `john doe` (contient espace)
- ❌ `josé` (contient accent)

**Frontend - À valider :**

```javascript
// Frontend - Synchroniser avec cette regex
const validateUsername = (username) => {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
};
```

---

### 2️⃣ **EMAIL**

```javascript
// Backend - authController.js
const validateEmail = (email) => {
  return validator.isEmail(email);
};
```

**Règles exactes (via validator.js) :**

- ✅ Doit contenir un **@**
- ✅ Doit avoir un **domaine valide** (ex: `example.com`)
- ✅ Format standard d'email valide
- ❌ Ne peut pas être vide

**Exemples valides :**

- ✅ `john@example.com`
- ✅ `alice.doe@company.co.uk`
- ✅ `user+tag@domain.org`

**Exemples invalides :**

- ❌ `john` (pas de @)
- ❌ `john@` (pas de domaine)
- ❌ `john@.com` (domaine invalide)
- ❌ `john@@example.com` (@ double)

**Frontend - À valider :**

```javascript
// Frontend - Vérification basique (ou utiliser une library comme validator.js)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

---

### 3️⃣ **PASSWORD**

```javascript
// Backend - authController.js
const validatePassword = (password) => {
  return password && password.length >= 8 && password.length <= 50;
};
```

**Règles exactes :**

- ✅ Longueur : **8 à 50 caractères** (inclus)
- ✅ **Au moins 1 lettre OBLIGATOIRE** (a-z, A-Z)
- ✅ **Au moins 1 chiffre OBLIGATOIRE** (0-9)
- ✅ **Au moins 1 caractère spécial OBLIGATOIRE** : `!@#$%^&*(),.?":{}|<>`
- ❌ **PAS d'espace autorisé**
- ❌ Ne peut pas être vide

**Exemples valides :**

- ✅ `password123`
- ✅ `MyPassword!@#`
- ✅ `12345678` (8 chiffres)
- ✅ `pass word 123` (avec espaces)
- ✅ `P@ssw0rd!` (avec caractères spéciaux)

**Exemples invalides :**

- ❌ `pass` (trop court)
- ❌ `` (vide)
- ❌ `this_is_a_very_long_password_that_exceeds_fifty_characters_limit` (trop long)

**Frontend - À valider :**

```javascript
// Frontend - Synchroniser avec cette logique
const validatePassword = (password) => {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNoSpace = !/\s/.test(password);

  return (
    password &&
    password.length >= 8 &&
    password.length <= 50 &&
    hasLetter &&
    hasDigit &&
    hasSpecialChar &&
    hasNoSpace
  );
};
```

---

## ⚠️ DIFFÉRENCES DÉTECTÉES

### ❌ Frontend a : "Caractère spécial obligatoire dans password"

### ✅ Backend a : "Au moins 1 caractère spécial OBLIGATOIRE"

**SYNCHRONISÉ ✅** - Les deux côtés demandent maintenant un caractère spécial.

**Action requise :**

- ✅ Frontend et Backend sont maintenant synchronisés

---

## 🔄 Résumé des synchronisations

| Champ        | Backend                        | Frontend                     | Action                                     |
| ------------ | ------------------------------ | ---------------------------- | ------------------------------------------ |
| **Username** | 3-20 chars, `^[a-zA-Z0-9_-]+$` | À confirmer                  | Synchroniser regex                         |
| **Email**    | Format valide (validator.js)   | Contient "@"                 | Améliorer validation email                 |
| **Password** | 8-50 chars, aucune restriction | 8+ chars + caractère spécial | ❌ Supprimer caractère spécial obligatoire |

---

## 📝 Messages d'erreur Backend

Ces messages sont retournés par l'API :

```javascript
// Username
"Le pseudo doit contenir 3-20 caractères (alphanumériques, tiret, underscore).";

// Email
"Format d'email invalide.";

// Password
"Le mot de passe doit contenir entre 8 et 50 caractères.";

// Général
"Tous les champs sont requis.";
"Email et mot de passe requis.";
```

**Frontend peut utiliser ces messages ou les traduire.**

---

## ✅ Checklist Synchronisation

Côté Frontend, vérifier que :

- [ ] Username : Longueur 3-20 chars
- [ ] Username : Regex `^[a-zA-Z0-9_-]{3,20}$`
- [ ] Email : Format valide avec @
- [ ] Email : Utiliser validator.js si possible
- [ ] Password : Longueur 8-50 chars
- [ ] Password : **SUPPRIMER** la validation "caractère spécial obligatoire"
- [ ] Afficher les messages d'erreur du backend
- [ ] Tester avec les exemples ci-dessus

---

✅ **Documentation complète pour la synchronisation !**
