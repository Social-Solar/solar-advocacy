Solar Advocacy
==============
**!! Make sure to read the important note below !!**

##Running it Locally
1. Go install NodeJS from `http://nodejs.org/`
2. Get the git repo by running `git clone https://github.com/Social-Solar/solar-advocacy.git`.
3. Make an entry in your `/etc/hosts` file to route `local.ilikesolar.org` to `127.0.0.1`
4. Read Important Note and create local.js
5. Navigate your terminal to the root directory of the project.
6. Run `npm install`
7. Update `knexfile.coffee` with the database configuration
8. Run `knex migrate:latest`
9. To create an http server, run `node app`
10. To create both an http and https server run `node app secure`
11. The server will run locally on port(s) 3000 (http) and port 4000 (https)

##Running it in Production
1. Submit a pull request for changes
2. Once merged, server admin will deploy a new build

Note: We'll probably want to make a service to start and stop this site.

##Important Note
I didn't include any passwords or tokens inside of github. If you look inside `.gitignore` you can see that `config/production.js` and `config/local.js` are not included in the project.

To run the project, you'll need to add those passwords and tokens. Inside the `config/` folder, make a copy of `default.js` and call it `local.js`. If you email the Vivint guys, we can give you the facebook credentials. If you talk to SEIA, they can give you the Salsa credentials.
