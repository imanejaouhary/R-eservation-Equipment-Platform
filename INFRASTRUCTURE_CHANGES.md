# Modifications de l'Infrastructure Commune (Docker Compose & Spring Cloud)

Ce document récapitule les évolutions apportées à l'infrastructure commune dans le cadre de l'intégration de `equipment-service` sur la branche `imane`, les raisons techniques associées, et les recommandations d'alignement pour les autres microservices de la plateforme.

---

## 1. Modifications partagées de l'infrastructure (`docker-compose.yml`)

### A. Healthchecks et conditions de démarrage ordonné (`service_healthy`)
- **Problème initial :** Auparavant, `depends_on` vérifiait uniquement le démarrage du conteneur (`service_started`), et non la disponibilité réelle du serveur Spring Boot ou du SGBD. Lors des démarrages à froid, les microservices clients démarraient plus rapidement que Config Server et Eureka, provoquant des erreurs transitoires `Connection refused` et un statut `UNKNOWN` du Config Client dans Actuator.
- **Modifications appliquées :**
  - **`discovery-server`** (port 8761) : sondage sur `http://localhost:8761/actuator/health`.
  - **`config-server`** (port 8888) : sondage sur `http://localhost:8888/actuator/health`.
  - **`postgres`** (port 5432) : sondage via l'outil natif `pg_isready -U equipment_user -d equipment_db`.
  - **Dépendances conditionnées :** `equipment-service`, `api-gateway` et `reservation-service` attendent désormais que `discovery-server` et `config-server` soient effectivement `healthy` avant de s'initialiser.

### B. Service PostgreSQL persistant
- Service `postgres` basé sur l'image `postgres:16-alpine`.
- Port hôte restreint à `127.0.0.1:5432:5432` (sécurité loopback, évite l'exposition sur le réseau local ou public).
- Volume persistant nommé `postgres-data` pour préserver les tables et données entre les arrêts de conteneurs.
- Connecté au réseau partagé `reservation-network` (accessible en interne via le nom d'hôte `postgres:5432`).

---

## 2. Configuration du Config Client (Local vs Docker)

### A. Pattern adopté dans `equipment-service`
Dans son `application.properties` :
```properties
spring.config.import=optional:configserver:${CONFIG_SERVER_URL:http://localhost:8888}
```

- **En local :** Aucune variable `CONFIG_SERVER_URL` n'est requise ; la valeur par défaut `http://localhost:8888` est utilisée automatiquement.
- **En Docker :** `docker-compose.yml` injecte simplement :
  ```yaml
  environment:
    CONFIG_SERVER_URL: http://config-server:8888
  ```
- **Bénéfice :** Élimine durablement les tentatives de connexion vers `localhost:8888` à l'intérieur du conteneur Docker, tout en garantissant une exécution locale sans modification manuelle des fichiers de configuration.

---

## 3. Gestion des identifiants et variables d'environnement

- **Externalisation :** Les identifiants PostgreSQL sont externalisés via des variables d'environnement (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`).
- **Protection Git :** Le fichier `.env` est ignoré par Git (`.gitignore`). Le fichier modèle partagé `.env.example` documente les clés sans exposer de secrets.
- **Validation Docker Compose :** La syntaxe `${POSTGRES_PASSWORD:?...}` garantit qu'aucun conteneur utilisant PostgreSQL ne démarrera si le mot de passe est absent.
*(Pour la procédure détaillée de configuration locale, se référer au guide [POSTGRES_SETUP.md](file:///c:/Users/HP/Downloads/projet-DS/R-eservation-Equipment-Platform/POSTGRES_SETUP.md)).*

---

## 4. Impact sur les autres microservices et recommandations

- **Services existants non altérés :**
  - `reservation-service` continue d'utiliser H2 par défaut et reste fonctionnel.
  - `api-gateway` conserve son routage existant (`/api/equipments/**` vers `lb://EQUIPMENT-SERVICE`).
- **Recommandations pour l'équipe :**
  - **Adopter le pattern `CONFIG_SERVER_URL`** dans les `application.properties` des futurs services (`user-service`, `payment-service`) pour fiabiliser la résolution du Config Server sans avertissement.
  - **Bénéficier des healthchecks :** Tout nouveau service dépendant d'Eureka ou du Config Server doit configurer son `depends_on` avec `condition: service_healthy`.

---

## 5. Commandes utiles de démarrage et de vérification

```bash
# Vérifier la validité de la syntaxe Docker Compose
docker compose config --quiet

# Démarrer la stack applicative avec Eureka, Config Server, Gateway, PostgreSQL et Equipment Service
docker compose up -d discovery-server config-server postgres api-gateway equipment-service

# Consulter l'état de santé des conteneurs
docker compose ps

# Vérifier la santé et le Config Client d'Equipment Service
curl http://localhost:8082/actuator/health

# Vérifier l'enregistrement auprès d'Eureka
curl http://localhost:8761/eureka/apps/EQUIPMENT-SERVICE

# Tester l'accès via l'API Gateway
curl http://localhost:8080/api/equipments
```

---

## 6. État des tests et validation

### Tests validés avec succès
- **Build Maven & tests unitaires/intégration :** 7/7 tests réussis sur `equipment-service` (MockMvc, Mockito, H2 en scope test).
- **Démarrage à froid de la stack Docker :** Démarrage ordonné respecté avec healthchecks (`postgres`, `config-server`, `discovery-server` déclarés Healthy avant le lancement d'`equipment-service`).
- **Config Client :** Statut `UP` immédiat sans erreur de connexion `localhost:8888` ni besoin de redémarrage.
- **PostgreSQL :** Schéma de la table `equipments` généré avec contraintes et persistance validée.
- **Routage API Gateway :** Opérations CRUD complètes (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) validées à travers la Gateway sur le port `8080`.

### Tests restants à réaliser ultérieurement
- Test d'intégration de bout en bout via Feign Client entre `reservation-service` et `equipment-service` lors de la mise en service globale de la réservation.
- Intégration future avec `user-service` lorsque son implémentation sera amorcée.
