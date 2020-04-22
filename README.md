# Welcome to My App!

This app provide API to build **Social Network** app using *Express* on *NodeJS* with *MySQL* Database.

**❗️Requirement**: Create `.env` file on top level of project following these variable:
- `PORT`: your port number *(default: 8080)*.
- `PROTOCAL`: http or https *(require)*.
- `DOMAIN`: your app domain *(optional)*.
- `WHITELIST`: allow domain in this variable from cors, sepearate with comma *(optional)*.
- `SALT_ROUND`: (number) represent time complexity of encrypt algorithm *(require)*.
- `SECRET`: secret key of encrypt algorithm *(require)*.
- `MAIL_USER`, `MAIL_PASS`: app will use this mail to send mail *(require)*.
- `DB_NAME`: database *(for production)*.
- `DB_USER`: database username *(for production)*.
- `DB_PASS`: database password *(for production)*.
- `DB_HOST`: database hosting *(for production)*.
- `DB_DEV_NAME`, `DB_DEV_USER`, `DB_DEV_PASS`, `DB_DEV_HOST`: for development *(if not have these variable, running with development on local will fail).*
- `NODE_ENV`: runing enviroment (product, development, test) *(require)*.

## Getting started

To get the app running locally:

- Clone this repo.
- `npm install` to install all req'd dependencies.
- `NODE_ENV=development npx sequelize-cli db:migrate` to initialize database.
- `npm start` to start the server (this project uses `NODE_ENV=development node src/server.js`).

## Response Format

```
{
	status: <status>,
	data: <data>
}
```
- `status`:
	- `success`: everything is ok.
	- `fail`: error from client.
	- `error`: error from server.
- `data`: response data.

## Auth Router - `/api/v1/auth`

| Description | Endpoint | Request | Response | Require |
| ----------- | -------- | ------- | -------- | ------- |
| Register | `POST /register` | <ul><li>`username`: [5-32] characters, only contain alphabelt, dot and underscore *(string)*.</li><li>`password`: [6-32] characters, not contain white space *(string)*.</li><li>`fullName`: only contain alphabelt characters, not contain 2 space in a row *(string)*.</li><li>`email`: must valid. ex: example@mail.com *(string)*.</li><li>`female`: 0 or 1 *(boolean)*.</li></ul> | data: <ul><li>`id`</li><li>`username`</li><li>`email`</li><li>`fullName`</li><li>`female`</li><li>`avatar`</li><li>`createdAt`</li><li>`updatedAt`</li></ul>`set-cookie`: token. | • all field in request.
| Login | `POST /login` | <ul><li>`username`: *(string)*.</li><li>`password`: *(string)*.</li></ul> | data: <ul><li>`id`</li><li>`username`</li><li>`email`</li><li>`fullName`</li><li>`female`</li><li>`avatar`</li><li>`createdAt`</li><li>`updatedAt`</li></ul>`set-cookie`: token. | • all field in request.
| Send Verification Mail |`GET /sendMail`|  | data: *message*. | • `token` is stored in cookie.<br>• not verified yet.
| Verify Account | `GET /verify` | <ul><li>`token`: *(query-string)*.</li></ul> | data: <ul><li>`token`: new token.</li></ul>`set-cookie`: new token. | • all field in request.
| Reset Password | `POST /resetPassword` | <ul><li>`oldPassword`: *(string)*.</li><li>`newPassword`: [6-32] characters, not contain white space *(string)*.</li><li>`forgotCode`: from email *(string).*</li></ul> | data: *message*. | • all field in request.
| Send Reset Code To Email | `GET /sendForgotMail` | <ul><li>`username`: *(query-string)*.</li></ul> | data: *message*. | • all field in request.


## User Router - `/api/v1/users`

| Description | Endpoint | Request | Response | Require |
| ----------- | -------- | ------- | -------- | ------- |
| Update Infomation | `PATCH /info` | <ul><li>`fullName`: only contain alphabelt characters, not contain 2 space in a row *(string)*.</li><li>`avatar`: only .jpg or .png *(file)*.</li></ul> | data: <ul><li>`id`</li><li>`username`</li><li>`email`</li><li>`fullName`</li><li>`female`</li><li>`avatar`</li><li>`createdAt`</li><li>`updatedAt`</li></ul> | • at least one field in request.<br>• logged.
| Update Password | `PATCH /password` | <ul><li>`oldPassword`: *(string)*.</li><li>`newPassword`: [6-32] characters, not contain white space *(string)*.</li></ul> | data: *message*. | • all field in request.<br>• logged.
| Get User | `GET /:username` | <ul></ul> | data: <ul><li>`id`</li><li>`username`</li><li>`email`</li><li>`fullName`</li><li>`female`</li><li>`avatar`</li><li>`createdAt`</li><li>`updatedAt`</li></ul> | 
| Get Friends | `GET /:username/friends` | <ul></li><li>`from`: *(query-number)*.</li><li>`limit`: *(query-number)*.</li></ul> | data: *array* <ul><li>`friend`</li><li>`status`</li><li>`User`: *relate to `friend`*<ul><li>`fullName`</li><li>`avatar`</li></ul></li><li>`createdAt`</li><li>`updatedAt`</li></ul> |
| Get Friend Requests | `GET /requests` | <ul></li><li>`from`: *(query-number)*.</li><li>`limit`: *(query-number)*.</li></ul> | data: *array*<ul><li>`from`</li><li>`status`</li><li>`User`: *relate to `from`*<ul><li>`fullName`</li><li>`avatar`</li></ul></li><li>`createdAt`</li><li>`updatedAt`</li></ul> | • logged.
| Get Own Posts | `GET /posts` | <ul></li><li>`from`: *(query-number)*.</li><li>`limit`: *(query-number)*.</li></ul> | data: *array* <ul><li>`id`</li><li>`createdBy`</li><li>`content`</li><li>`status`</li><li>`like`</li><li>`photos`: *array*<ul><li>`id`</li><li>`photo`</li></ul></li><li></li>`createdAt`<li></li>`updatedAt`</ul> | • logged.
| Get User Posts | `GET /:username/posts` | <ul></li><li>`from`: *(query-number)*.</li><li>`limit`: *(query-number)*.</li></ul> | data: *array* <ul><li>`id`</li><li>`createdBy`</li><li>`content`</li><li>`status`</li><li>`like`</li><li>`photos`: *array*<ul><li>`id`</li><li>`photo`</li></ul></li><li></li>`createdAt`<li></li>`updatedAt`</ul> | 

