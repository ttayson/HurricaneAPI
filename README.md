# HurricaneAPI
## _Api rest para gerenciamento de DNS Hurricane_

[![N|Solid](https://dns.he.net/include/images/helogo.gif)](https://dns.he.net/)
### This is not an official version


## Features

| Function | - Status -|
| ------ | ------ |
| List Domain | ✅ |
| List Hosts | ✅ |
| Add | ✅|
| Update itens | ⏳|
| Remove itens | ⏳ |
| Docker | ⏳|


## Installation

Requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/ttayson/HurricaneAPI.git
cd HurricaneAPI
npm install 
npm start
```

## Usage
### > List Domains
```curl
curl --request POST \
  --url http://localhost:3000/api/list \
  --header 'Content-Type: application/json' \
  --data '{
	"login": "LOGIN",
	"pass": "PASSWORD"
}'
```
```wget
wget --quiet \
  --method POST \
  --header 'Content-Type: application/json' \
  --body-data '{\n	"login": "LOGIN",\n	"pass": "PASSWORD"\n}' \
  --output-document \
  - http://localhost:3000/api/list
 
 ```



### > List all information for a domain

```curl
curl --request POST \
  --url http://localhost:3000/api/list \
  --header 'Content-Type: application/json' \
  --data '{
	"login": "LOGIN",
	"pass": "PASSWORD",
	"domain": "VALID DOMAIN"
}'
```

```wget
wget --quiet \
  --method POST \
  --header 'Content-Type: application/json' \
  --body-data '{\n	"login": "LOGIN",\n	"pass": "PASSWORD",\n	"domain": "VALID DOMAIN"\n}' \
  --output-document \
  - http://localhost:3000/api/list
```
### > To ADD

```curl
curl --request POST \
  --url http://localhost:3000/api/add \
  --header 'Content-Type: application/json' \
  --data '{
	"login": "LOGIN",
	"pass": "PASSWORD",
	"domain": "DOMAIN",
	"type": "Type",
	"name": "NAME",
	"data": "",
	"ttl": "ttl"
}'
```
```wget
wget --quiet \
  --method POST \
  --header 'Content-Type: application/json' \
  --body-data '{\n	"login": "LOGIN",\n	"pass": "PASWORD",\n	"domain": "DOMAIN",\n	"type": "TYPE",\n	"name": "NAME",\n	"data": "",\n	"ttl": "TTL"\n}' \
  --output-document \
  - http://localhost:3000/api/add
```

#### Docker

> being implemented

## License

MIT


## Legal
This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by Hurricane Electric. This is an independent and unofficial software. Use at your own risk.
