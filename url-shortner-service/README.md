# Project requirement - URL Shortner API

## Tech Stack Overview

|Category           |Technology         |Purpose                                   |
|-----------        |-----------        |-----------                               |
|Backend            |Node.js + Express  |REST API Development                      |
|Database           | postgresql        |Reletional data store                     |
|ORM                | Drizzle ORM       |type safe database queries and and schema |
|containerization   | docker + compose  | local postgresql instance                |
| Authentication    | jwt               | securing private routes                  |
|testing tool       | postman           | Manual api testing                       |


# Project requirement
make sure you have following installed
nodejs, docker, postman, code-editor (vs code)

# NPM Dependencies
```bash
npm install express drizzle-orm pg jsonwebtoken bcrypt dotenv argon2
```


## Auth routes

| Method    |   Endpoint    |   Description   | Auth Req  |
|-----------|---------------|-----------------|------------|
|post       |   `signup`      | Register a new user   |no     |
|post       |   `login`       | Login and receive token|no     | 


## URL routes

| Method    |   Endpoint    |   Description                              | Auth Req  |
|-----------|---------------|--------------------------------------------|-----------|
|post   |    `/shorten`     |create a short url from long one            |  yes      |
|get    |   `/:shortCode`   |redirect to original url                    |  no       |
|get    |   `/urls`         |get all URLs created by the logged in user  |  yes      |
|delete |  `/urls/:id`      |Delete a short url (if it belong to user)   |  yes      |



## 