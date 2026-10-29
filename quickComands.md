#  Taquería Gon Web - Developer Cheat Sheet 

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

Welcome to the quick reference guide for the **Taquería Gon** development team. Keep these commands handy for a smooth and standardized workflow!

---

##  1. Version Control (Git & Gitflow)

| Command | Description |
| :--- | :--- |
| `git clone <url>` | Download the entire repository from GitHub to your local machine. |
| `git checkout Development` | Switch to the team's main integration branch. |
| `git pull origin Development` | Fetch and merge the latest changes from the cloud. |
| `git checkout -b feature/<task-name>` | Create and switch to a new isolated branch for your current task. |
| `git add .` | Stage all modified and new files (prepare them for saving). |
| `git commit -m "type: message"` | Create an official save point with a clear, descriptive message. |
| `git push origin feature/<task>` | Upload your local branch to GitHub (ready for a Pull Request). |
| `git branch` | List all existing branches on your local machine. |
| `git branch -m <new-name>` | Rename your current local branch. |

>  **Workflow Tip:** Never write code directly in the `Development` or `main` branches. Always create a new `feature/` branch before modifying any files!

---

##  2. Infrastructure (Docker)

| Command | Description |
| :--- | :--- |
| `docker compose up -d` | Read the `docker-compose.yml` file and start the database and server in the background (detached mode). |
| `docker compose up --build -d` | Force a clean rebuild of the images from scratch (mandatory if you modified the `Dockerfile` or installed new npm packages). |
| `docker compose down` | Stop all running containers and free up your computer's ports. |
| `docker compose down -v` | Stop running containers, remove networks, and delete all associated persistent data volumes. |
| `docker compose exec backend npm test` | Execute the automated integration test suite directly inside the running `backend` container. |
---

##  3. Package Management (Node.js & NPM)

| Command | Description |
| :--- | :--- |
| `npm init -y` | Initialize a new Node.js project and generate the base `package.json` file. |
| `npm install <packages>` | Install required production dependencies (e.g., `express`, `mysql2`, `dotenv`). |
| `npm install <package> --save-dev`| Install tools only needed for coding and testing (e.g., `nodemon`, `jest`). |
| `npm run dev` | Execute our custom script to start the local server with auto-reload enabled. |

---
*Happy coding! *
