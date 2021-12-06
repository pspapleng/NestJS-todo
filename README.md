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
- [x] **X-Member-Token**

**Todo**

- [x] Only member can create new todo with `not_started` status.
- [x] Every member can list `existing` todo.
- [x] Only todo `owner` can update their `title` and `description`.
- [x] Only todo `owner` can change status.
- [x] Only todo `owner` can delete todo(soft delete).
- [x] Only todo `owner` can assign member.
- [x] Send notification to all assigned member when `owner` delete `active` todo.
- [x] Run a `background scheduler` to notify all assigned members.

**Other**

- [x] Authorization --> UseGuards()
- [x] Rate Limiting from header **X-Forwarded-For**

### API Documentation

- [ScaMo-todo](https://documenter.getpostman.com/view/17117876/UVJigDfV)

---

## Getting Started

### How to Run Project

1.  Clone Project

    ```
    git clone https://github.com/pspapleng/NestJS-todo.git

    npm install
    ```

2.  Run Database As Container
    ```
    docker-compose up -d
    ```
3.  Run Project
    ```
    npm run start:dev
    ```

### How to Run Migration

1.  Generate Migration
    ```
    npm run typeorm:migration:generate -- init
    ```
2.  Run Migration
    ```
    npm run typeorm:migration:run
    ```

---
