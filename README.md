# FlyRadars

Interface de gestion de base de données pour le suivi de vols.

## Prérequis

- Node.js 18+
- PostgreSQL

## Installation

### 1. Base de données

```bash
# Créer la base
sudo -u postgres psql -c "CREATE DATABASE flyradars;"

# Lancer le setup
./path/to/flyradars/setup.sh
```

### 2. Dépendances

```bash
npm install
```

### 3. Configuration (optionnel)

Par défaut, le serveur se connecte via l'utilisateur `postgres` sur `127.0.0.1:5432`.

Pour personnaliser, créer un fichier `.env` :

```bash
cp .env.example .env
```

## Lancement

```bash
npm run dev
```

Ou séparément :

```bash
npm run dev:server  # Backend sur http://127.0.0.1:3001
npm run dev:client  # Frontend sur http://127.0.0.1:5173
```
