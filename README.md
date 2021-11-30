## Pre Requisite

- docker and docker-compose
- node.js
- nest.js cli

## Feature

- [x] Ready To Run.
- [x] Postgres Database as Container.
- [x] Config Service
- Read and Ensure .env variable.
- [x] .env Sample.
- [x] Connect Postgres Database.

**Member**

- [x] Register Member.
- [ ] X-Member-Token.

**Todo**

- [ ] Only member can create new todo with **not_started** status.
- [ ] Every member can list **existing** todo.
- [ ] Only todo **owner** can update their **title** and **description**.
- [ ] Only todo **owner** can change status.
- [ ] Only todo **owner** can delete todo(soft delete).
- [ ] Send notification to all assigned member when **owner** delete **active** todo.

## How To

### Run Project

1.  Clone Project
    ```
    git clone https://github.com/pspapleng/NestJS-todo.git
    npm install
    ```
2.  Run Database As Container.
    ```
    docker-compose up -d
    ```
3.  Run Project.
    ```
    npm run start:dev
    ```

---
