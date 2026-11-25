# Configuration PostgreSQL (Docker Compose)

Ce guide explique comment configurer l'environnement local pour le service `postgres` ajouté dans `docker-compose.yml` (base `equipment_db`, dédiée à `equipment-service`).

> **Note sur les services H2 :** Les services existants utilisant H2 (comme `reservation-service`) restent inchangés et continuent de fonctionner avec H2.

---

## 1. Créer le fichier `.env` (obligatoire pour toute l'équipe)

Dans `docker-compose.yml`, la variable `POSTGRES_PASSWORD` est requise (`:?`). Docker Compose vérifie et résout **tout** le fichier `docker-compose.yml` à chaque commande (`docker compose up`, `config`, etc.) : **sans `POSTGRES_PASSWORD` (dans `.env` ou dans l'environnement système), Docker Compose refusera de démarrer, même pour lancer uniquement les services H2.**

Si vous n'avez pas encore de fichier `.env` (ne pas écraser un `.env` existant), copiez `.env.example` vers `.env` à la racine du projet :

```bash
# Linux / macOS / Git Bash
cp .env.example .env
```

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

Ouvrez ensuite `.env` et renseignez un mot de passe local pour `POSTGRES_PASSWORD` :

```env
POSTGRES_DB=equipment_db
POSTGRES_USER=equipment_user
POSTGRES_PASSWORD=votre_mot_de_passe_local
```

> **Sécurité :** `.env` est ignoré par `.gitignore`. **Ne partagez jamais `.env` et ne le versionnez jamais sur Git/GitHub.** Seul `.env.example` (sans mot de passe) est suivi par Git.

---

## 2. Démarrer et vérifier PostgreSQL

Valider la configuration Docker Compose :

```bash
docker compose config --quiet
```

Démarrer uniquement PostgreSQL en arrière-plan (ou toute la stack avec `docker compose up -d`) :

```bash
docker compose up -d postgres
```

Vérifier que le conteneur tourne et que PostgreSQL accepte les connexions (port `5432` exposé uniquement sur `127.0.0.1`) :

```bash
docker compose ps
docker compose exec postgres pg_isready -U equipment_user -d equipment_db
```

Si besoin, consulter les logs du conteneur :

```bash
docker compose logs -f postgres
```
