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

### [optional] Access postgres DB
```bash
docker-compose exec postgres bash
su postgres
psql database -U dbuser
```

## Usage

The project can be reached at localhost.

When the project was brought up an admin user and a normal user where created.

#### Login credentials

- Admin user:
  - username: Manager
  - password: password
  

- Normal user:
  - username: Sales
  - password: password

#### Upload cost file

If your logged in as Manager which is an admin type user you will have the option "Upload file" in the dropdown on the top right.


![](../../Pictures/Screenshot from 2021-08-14 07-22-40.png)


Now you just need to select the csv file and hit send, the csv file will be processed and added to the DB for use.

*Note that the cost table is cleared before adding new data.


![](../../Pictures/Screenshot from 2021-08-14 07-25-26.png)
