## message-service

This project is a Node.js(Express) REST api written in TypeScript.
Since this is my first time authoring a Node.js application i took some help from:
[express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).
This helped me setup a fair amount of boilerplate code to speed up the process.

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Run `yarn install` to install the dependancies required.
4. Run `yarn dev`to start the development server (`yarn start` for prod).

## Tests

1. Run `yarn test` to run the tests.

## Project structure

- `src/models`: Contains the data entities used throughout the project.
- `src/repos`: Contains the data repositories and the local database.
- `src/routes`: Contains the controller layer and api mappings.
- `src/services`: Contains the service layer.
- `spec/tests`: Contains the tests.

## Delimitations and assumptions made for this assignment

- Database:
  Due to the small scope of this assignment i opted to go for a trivial persisting
  mechanism to keep track of the application state, instead of a proper database.
  **This is in no way an approach that i would recommend for a production application.**
  Using a simple `src/repos/database.json` file to store the objects.
  This is handled via `src/repos/MockOrm.ts` which contains methods to read and write.

- Entities:
  I approached the creation of entities for this application using a "fullstack" mindset.
  To ensure that the endpoints provided meaningful data for a UI layer to consume,
  I took a "pretend" approach by designing the entities as if they were the backend for a chat web app or an email client.
  For the user entity, full CRUD operations are not covered, methods covered are get, delete and post.

- Tests:
  Because of time constraints, I chose not to provide full test coverage for the API.

- Scalability & Redundancy (Overall improvements):
  By using a database with features such as replication and sharding, data can be distributed across multiple servers,
  improving both the performance and reliability of the system. Similarly, using Docker containers can help
  to ensure scalability and redundancy by allowing applications to be deployed in a consistent
  and reproducible way across multiple environments, making it easier to scale the system up or down as needed.
  Additionally, Docker containers can be easily replicated and distributed across multiple servers,
  providing redundancy in case of hardware failures or other issues.

## Usage & Examples

- User methods

To create a user use the following `curl`:

`curl -X POST -H "Content-Type: application/json" -d '{"name": "user", "email": "user@email.com"}' http://localhost:3000/api/users/add`

Delete a user by email:

`curl -X DELETE http://localhost:3000/api/users/delete/user@email.com`

Delete a user by id: 

`curl -X DELETE http://localhost:3000/api/users/delete/someId`

Get all users: `curl -X GET http://localhost:3000/api/users/all`

- Message methods
- 
  Get all messages: `curl -X GET http://localhost:3000/api/messages/all`

  Submit a new message:
  
  `curl -X POST -H "Content-Type: application/json" -d '{"sender": "user1@user1.com","recipient": "user2@user2.com","content": "Ping!"}' http://localhost:3000/api/messages/submit`
  
  Get the latest (unread) messages:
  
  `curl -X GET -H "Content-Type: application/json" -d '{"email": "user1@user1.com"}' http://localhost:3000/api/messages/latest/`
  
  Get all messages ordered by time with a startIndex and stopIndex.
  
  `curl -X GET -H "Content-Type: application/json" -d '{"email": "user1@user1.com", "startIndex": 1, "pageSize": 1}'
  http://localhost:3000/api/messages/ordered/byindex`
  
  Delete a specific message:
  
  `curl -X DELETE -H "Content-Type: application/json" -d '{"ids":"472080b2-9a6f-41cc-8ffc-38aa1a7b0d4b"}' http://localhost:3000/api/messages/delete`
  
  Delete multiple messages:
  
  `curl -X DELETE -H "Content-Type: application/json" -d '{"ids":["someid1", "someid2", "someId3"]}'`
