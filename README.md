# Blog Backend

## Installation
git clone <repo-backend-url>
cd blog-backend
npm install

## Variables d'environnement
PORT=4000
MONGO_URI=mongodb://localhost:27017/blog
JWT_SECRET=tesupersecret
CORS_ORIGIN=http://localhost:4200

## Lancer le projet
npm run dev

## Structure du projet
src/
├─ config/         # DB
├─ controllers/    # Logique métier
├─ middlewares/    # Auth, permissions
├─ models/         # User, Article, Notification
├─ routes/         # Express routes
├─ utils/          # login, token
├─ tests/          # Tests unitaires / e2e
server.js           # Entrée principale

## Tests des rôles
- Admin peut supprimer et modifier tous les articles
- Editor peut modifier tous les articles
- Writer peut modifier seulement ses articles

Lancer les tests :
npm run test


