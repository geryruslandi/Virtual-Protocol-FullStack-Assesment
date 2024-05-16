# Getting Started

This project is using cosine similarity algorith to determine the distance between user interests vector. And for framework, i am using NestJS with its microservice feature.

There will be three microservices that booted up on this project.

- Api microservic
- Scheduler microservice
- Queue worker

All of those services will be communicated through RabbitMQ.
Each of microservice will have their own docker container. All of those three container will be using the same database and RabbitMQ instance.

Below is the instruction to start the project

## Requirement

- Docker installed on your machine
- `.env` files, referenced from `.env.example`

## Starting the project

After above requirement, run bash script that provided from this source by executing
`./startDev.sh` . This script will build all of services from docker compose. after all of the services booted up. make sure to put the Api service url into frontend `.env`
