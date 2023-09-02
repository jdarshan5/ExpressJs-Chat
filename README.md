# Chat Application

## Description

A simple chat application using express.js to develop APIs

### Fontend:

[React Native Chat Application][7]

## TechStack

| Tech | Usage |
| :- | - |
| [`Express.js`][1] | Web application framework to handle HTTP request and responses |
| [`jwt`][2] | To generate authentication token |
| [`bcrypt`][3] | To incrypt text e.g. my_password to something ashvkbasdkhvbsdjvsdnljvnhsbv |
| [`dotenv`][4] | For environment variables |
| [`MongoDB`][5] | A NoSQL database to store data |
| [`socket.io`][6] | For real time communication between client(Our mobile app) and server |

# Local Development

## To Get Started

Install [nvm][8], [node][9] and npm

### step - 1: Install dependencies

run <code>npm install</code>, this command will install all the necessary packages required for this project.

### step - 2: Setting ENV variables

create two file called .env.dev and .env.prod at the root of this project directory and add environment variables which are listed below,

| Variable Name | Usage |
| :- | - |
| PORT | Port number on which we want our application to run |
| MONGO_URI | Your MongoDB database url |
| JWT_SECRET | Secret key to pass in JWT |

Your .env.dev file should look like this:

    PORT=8080
    MONGO_URI={`URL TO MONGODB DATABASE`}
    JWT_SECRET=THISISMYSECRET

same goes for the .env.prod file

### step - 3: Running our node application

For Development: `npm dev`

For Production: `npm start`

[1]: https://expressjs.com/ "Express.js"
[2]: https://jwt.io/ "JWT"
[3]: https://www.npmjs.com/package/bcrypt "bcrypt"
[4]: https://www.npmjs.com/package/dotenv "dotenv"
[5]: https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial "MongoDB"
[6]: https://socket.io/docs/v4/server-api/ "socket.io"

[7]: https://github.com/jdarshan5/React-Native-Chat "React Native Chat"

[8]: https://github.com/nvm-sh/nvm "NVM"
[9]: https://nodejs.org/en "Node.js"
