# merchant-calculator

This is a front and backend application with React, Postgres, Docker and NodeJs to upload a merchant cost csv file and calculate merchant acquisition cost.

## Requirements:

* docker-compose

### Environment
An env file is provided to easily bring the project up:

## Starting project:

### Start docker containers
```
docker-compose up --build -d
```

### Used ports

- nginx: 80 
- nodejs: 3000
- postgres: 5432

### [optional] Access postgres DB
```bash
docker-compose exec postgres bash
su postgres
psql database -U dbuser
```

## Usage

The project can be reached at localhost:80 or just click the link http://localhost.

When the project was brought up with docker-compose a admin user and a normal user were created.

#### Login credentials

- Admin user:
  - username: Manager
  - password: password
  

- Normal user:
  - username: Sales
  - password: password

#### Upload cost file

If your logged in as Manager which is an admin type user you will have the option "Upload file" in the dropdown on the top right.

![Screenshot from 2021-08-14 07-22-40](https://user-images.githubusercontent.com/44851100/129427460-0b59e61c-2a4b-4131-b23f-e08564d44ef0.png)

Now you just need to select the csv file and hit send, the csv file will be processed and added to the DB for use.

*Note that the cost table is cleared before adding new data.

![Screenshot from 2021-08-14 07-25-26](https://user-images.githubusercontent.com/44851100/129427490-1ccded06-22dd-487f-a0d6-403eb89cd4d9.png)

