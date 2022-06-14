# ZPlatform

## Set Up Database

- Install PostgreSQL
- Create Database

## SetUp Project

- Clone project

```sh
$ git clone https://github.com/nshaphan/zplatform.git
$ cd zplatform
```

- Install Dependencies

```sh
$ yarn

```

- Create a .env file in root folder and add the following content

```env
DATABASE_URL=postgres://<username>:<password>@127.0.0.1:5432/<db name>?schema=public
JWT_SECRET=
MAIL_USER=
MAIL_PASS=
FRONTEND_HOST=

```

- Run database migrations

```sh
npx prisma migrate deploy

```


- Run Development Server

```sh
$ yarn dev

```

- Start Production Server

```sh
$ yarn start

```
