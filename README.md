# E-Commerce Microservices Backend

### Introduction

This project is a backend microservices architecture for an e-commerce platform, built using [NestJS](https://nestjs.com/), a high-performance framework for building efficient and scalable server-side applications in Node.js. The project aims to provide a comprehensive backend solution for e-commerce platforms, handling everything from product management and orders to payment processing and notifications.

### Technologies

-  **NestJS:** An efficient framework for building server-side applications that offers a robust architecture and scalability.
-  **MongoDB:** A NoSQL database used for storing dynamic data and easily scaling.
-  **Redis:** Used for caching to improve data retrieval performance and manage session states.
-  **RabbitMQ:** A message broker that facilitates processing and distributing tasks among services, supporting an efficient microservices architecture.

### Features

-  Product Management: Add, update, delete, and search for products.
-  Order Management: Handle orders, update statuses, and manage shipping.
-  User Management: Register, login, and manage user profiles.
-  Payment Integration: Integrate payment gateways for online transactions.
-  Notifications: Send notifications to users via email using RabbitMQ.

### Architecture

The project is designed using a microservices architecture, with each service running independently and communicating through RabbitMQ. MongoDB is used for data storage, while Redis supports caching to speed up query performance.

### Prerequisites

-  Node.js (Latest version is recommended)
-  Docker and Docker Compose
-  MongoDB
-  Redis
-  RabbitMQ

### Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/yourrepo/ecommerce-microservice.git
cd ecommerce-microservice
```

2. Install all dependencies

```bash
npm install
```

3. Start microservices application with docker at the first time

```bash
npm run docker:start
```
