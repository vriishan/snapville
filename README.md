# Snapville

A distributed image server as part of a course project in the DSCI 551 - Foundations of Data Management course.

## Stack requirements

- Django
- React
- PostgreSQL
- Conda

## Setup

### Backend

- Run `conda env create -f environment.yml` to install required dependencies.
- Ensure postgres database service is running on port 5432, with a `postgres` username with the same password.
- Run `setup.sh` to setup the databases
- Run `migrate.bat`, which runs django migrations and sets up the tables in each database
- Start the django server with `python backend/manage.py runserver`
- Access the api on `http://127.0.0.1:8000/api/

### Frontend

- TODO
