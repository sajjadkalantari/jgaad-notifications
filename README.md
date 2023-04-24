
# Jagaad | Senior Node.js Engineer - Test

*Please read instructions carefully*

Use this file as part of the `README.md` and share with us your project when you complete it.

## Introduction
We are looking for an experienced Node.js backend engineer.
Your test will be evaluated on the:

* Architectural decisions
* Test coverage
* Adherence to instructions
* Cost of maintenance
* Readability
 

**Please:** make it easy for us to try your project on our machines.


## Requirements

We would like you to implement:

- a POST endpoint `/add-notifications` with body as follows, that adds this information to a database.  
As a side effect, when a notification is successfully added, an event should be triggered that sends an email: you can mock the email sending. 

```javascript
{
    email: string,
    notifications: string[],
}
```
example:
```json
{
    email: "email@example.com"
    notifications: [
        "Text #1",
        "Text #2"
    ]
}
```


- a GET endpoint `/messages` that gets the full list of user/notifications.  

- add any kind of API authentication, explaining your choice <br>
	JWT tokens because using JWTs as an API authentication method can provide a secure and scalable way to authenticate users without requiring the server to maintain session information. It is a widely adopted standard that is supported by many libraries and frameworks, making it easy to implement in your application, also JWTs are stateless meaningthat the server does not need to keep track of any session information and can be used for cross-domain authentication

- Please include an OpenApi in the repo to try your project <br>
	swagger is added to project you can check it on
	http://localhost:3000/docs <br>
  also there is swagger.json file on the root of project



## Running the app

```bash
#docker
docker-compose up

# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

