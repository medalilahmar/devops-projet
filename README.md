# Student Management – DevOps Full-Stack

Application full-stack de gestion des étudiants avec une chaîne CI/CD complète : Jenkins, Maven, Docker, Docker Hub, Ansible, SonarQube, Kubernetes et monitoring Prometheus/Grafana.

---

## Description

Ce projet met en place une infrastructure DevOps complète autour d’une application de gestion étudiante.  
Il couvre :

- Le build et les tests d’une application Java/Spring Boot avec Maven et JDK 17.
- La construction et la publication d’images Docker sur Docker Hub.
- Le déploiement automatisé via Ansible sur une VM cible.
- L’intégration continue avec Jenkins.
- La qualité de code avec SonarQube.
- L’orchestration avec Kubernetes multi-nœuds.
- Le monitoring avec Prometheus et Grafana.

> Le pipeline Jenkins actuel déploie l’application via Ansible et `docker-compose` sur le nœud `compute-node-d`.  
> Les parties Kubernetes, SonarQube et Prometheus/Grafana font partie de l’architecture cible DevOps.

---

## Architecture

```text
+----------------------+        +----------------------+        +----------------------+
|        VM1           |        |        VM2           |        |        VM3           |
|  Jenkins + SonarQube |  --->  |   compute-node-d     |  --->  | Kubernetes /         |
|  Maven / JDK17       |        | Docker + Compose     |        | Prometheus/Grafana   |
+----------------------+        +----------------------+        +----------------------+
```

### Rôles des machines

| VM | Rôle |
|---|---|
| VM1 | Jenkins, SonarQube, Maven, JDK17 |
| VM2 | `compute-node-d` : déploiement Docker / Docker Compose |
| VM3 | Cluster Kubernetes, monitoring Prometheus/Grafana |

---

## Stack technique

- **Backend** : Java 17, Spring Boot, Maven
- **Frontend** : dossier `frontend-app`
- **CI/CD** : Jenkins, Maven, JDK17
- **Conteneurisation** : Docker, Docker Compose
- **Registry** : Docker Hub
- **Déploiement** : Ansible
- **Qualité** : SonarQube
- **Orchestration** : Kubernetes multi-nœuds
- **Monitoring** : Prometheus, Grafana
- **IaC** : Ansible

---

## Structure du projet

```text
.
├── .mvn/wrapper
├── ansible/
│   ├── inventory.ini
│   └── playbooks/
│       └── deploy.yaml
├── frontend-app/
├── student-management-backend/
├── .dockerignore
├── .gitattributes
├── .gitignore
├── Jenkinsfile
├── docker-compose.yml
└── README.md
```

---

## Prérequis

### Jenkins

- Plugin Docker Pipeline
- Plugin Ansible
- Plugin JUnit
- Plugin Email Extension
- Plugin Git
- Outils configurés :
  - `Maven3`
  - `JDK17`

### Docker Hub

Créer un credential Jenkins avec l’ID :

```text
docker-hub-credentials
```

### Ansible

- Ansible installé sur l’agent Jenkins.
- Clé SSH privée disponible :

```text
/var/lib/jenkins/.ssh/id_rsa
```

- Inventaire Ansible : `ansible/inventory.ini`
- Playbook de déploiement : `ansible/playbooks/deploy.yaml`

### VM cible

- Docker installé
- Docker Compose installé
- Utilisateur `compute-node-d` ajouté au groupe `docker`

---

## Pipeline CI/CD

Le pipeline Jenkins est défini dans le fichier `Jenkinsfile`.

### Étapes

1. **Checkout**
   - Récupération du code depuis GitHub :
     ```text
     https://github.com/medalilahmar/devops-projet.git
     ```
   - Branche : `main`

2. **Build**
   ```bash
   mvn clean install -DskipTests
   ```

3. **Test**
   ```bash
   mvn test || true
   ```
   - Publication des rapports JUnit :
     ```text
     **/target/surefire-reports/*.xml
     ```

4. **Docker Build**
   - Construction de l’image :
     ```text
     lahmarali/student-management:${BUILD_ID}
     ```
   - Tag `latest`

5. **Push to Docker Hub**
   - Push de l’image versionnée et de `latest`
   - Retry : 3 tentatives
   - Timeout : 20 minutes

6. **Deploy with Ansible**
   ```bash
   ANSIBLE_SSH_PRIVATE_KEY_FILE=/var/lib/jenkins/.ssh/id_rsa \
   ansible-playbook \
     -i ansible/inventory.ini \
     ansible/playbooks/deploy.yaml \
     -e docker_image=lahmarali/student-management:${BUILD_ID} \
     -e build_number=${BUILD_ID}
   ```

### Post-actions

- Nettoyage Docker :
  ```bash
  docker system prune -f --volumes
  ```
- Nettoyage workspace Jenkins :
  ```text
  cleanWs()
  ```
- Notification email en cas de succès ou d’échec.

---

##  Docker & Docker Hub

### Construire l’image localement

```bash
docker build -t lahmarali/student-management:local .
```

### Tagger l’image

```bash
docker tag lahmarali/student-management:local lahmarali/student-management:latest
```

### Publier sur Docker Hub

```bash
docker push lahmarali/student-management:local
docker push lahmarali/student-management:latest
```

### Lancer avec Docker Compose

```bash
docker-compose up -d
```

---

##  Déploiement Ansible

Le playbook `ansible/playbooks/deploy.yaml` effectue les actions suivantes sur `compute-node-d` :

- Mise à jour du cache APT.
- Installation des dépendances Docker.
- Ajout de la clé GPG Docker.
- Ajout du dépôt Docker.
- Installation de `docker-ce` et `docker-compose`.
- Démarrage du service Docker.
- Ajout de l’utilisateur `compute-node-d` au groupe `docker`.
- Création du répertoire de projet :
  ```text
  /home/compute-node-d/devops-project/student-management
  ```
- Copie du fichier `docker-compose.yml`.
- Pull de l’image :
  ```text
  lahmarali/student-management:latest
  ```
- Déploiement avec `docker-compose`.

### Commande manuelle

```bash
ANSIBLE_SSH_PRIVATE_KEY_FILE=/var/lib/jenkins/.ssh/id_rsa \
ansible-playbook \
  -i ansible/inventory.ini \
  ansible/playbooks/deploy.yaml \
  -e docker_image=lahmarali/student-management:latest \
  -e build_number=manual
```

---

## Monitoring & Qualité

### SonarQube

- Analyse statique du code.
- Détection des bugs, vulnérabilités et code smells.
- Intégration possible dans le pipeline Jenkins.

### Prometheus & Grafana

- Collecte des métriques applicatives et infrastructure.
- Dashboards Grafana pour la supervision.
- Alerting possible selon les besoins.

### Kubernetes

- Cluster multi-nœuds.
- Déploiement scalable de l’application.
- Gestion des services, ingress et configurations.

---

## 🛠️ Utilisation locale

### Cloner le projet

```bash
git clone https://github.com/medalilahmar/devops-projet.git
cd devops-projet
```

### Builder le backend

```bash
mvn clean install
```

### Lancer avec Docker Compose

```bash
docker-compose up -d
```

### Accès à l’application

```text
http://localhost:8080
```

ou selon l’environnement :

```text
http://192.168.1.138:8080
```

---

## Variables importantes

| Variable | Description |
|---|---|
| `DOCKER_IMAGE` | Image Docker versionnée avec `BUILD_ID` |
| `DOCKER_TAG` | Tag `latest` |
| `PROJECT_PATH` | Chemin du projet sur la machine Jenkins |
| `BUILD_ID` | Numéro de build Jenkins |
| `BUILD_NUMBER` | Numéro de build Jenkins |
| `BUILD_URL` | URL du build Jenkins |

---

## Notifications

Le pipeline envoie des emails en cas de succès ou d’échec.

Pense à remplacer :

```text
votre-email@example.com
```

par ta véritable adresse email dans le `Jenkinsfile`.

---

## Contribution

1. Fork le projet.
2. Créer une branche :
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```
3. Commit :
   ```bash
   git commit -m "Ajout de ma fonctionnalité"
   ```
4. Push :
   ```bash
   git push origin feature/ma-fonctionnalite
   ```
5. Ouvrir une Pull Request.

---

## Auteur

**medalilahmar**

- GitHub : [https://github.com/medalilahmar](https://github.com/medalilahmar)
- Projet : [https://github.com/medalilahmar/devops-projet](https://github.com/medalilahmar/devops-projet)

---

## 📄 Licence

Ce projet est sous licence MIT.  
Voir le fichier `LICENSE` pour plus d’informations.
