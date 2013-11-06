Solar Advocacy
==============
**!! Make sure to read the important note below !!**

This app relies heavily on Facebook's API and, as such, is designed to be run solely as a Facebook App. You can still run it locally, but it won't do a whole lot. If you'd like to run it, this document will show you how to get started.

I can see one real good use of running the app locally. You could:

1. Create a new facebook app for testing.
2. Run this app locally.
3. Point your facebook app at your current IP Address.
4. Set up the appropriate port forwarding and firewall exceptions.

This way, you can develop locally and see the changes on facebook on every refresh.

##Running it Locally
1. Get the git repo by running `git clone https://github.com/Social-Solar/solar-advocacy.git`.
2. Go install NodeJS from `http://nodejs.org/`
3. Navigate your terminal to the root directory of the project.
4. Run `npm install`
5. Run `NODE_ENV=production; node app secure`
6. The server should now be running locally on port 3000 (http) and port 4000 (https)

##Pushing to AppFog
1. Install the AppFog CLI. (google is your friend)
2. Login to app fog by typing `af login` in the terminal.
3. Type `af update i-like-solar`
4. It should now be on Facebook.

##Important Note
I didn't include any passwords or tokens inside of github. If you look inside `.gitignore` you can see that `config/production.js` is not included in the project.

Before you can do any of the above, go into the config folder and make a copy of `default.js` and call it `production.js`. You'll probably have to get Salsa Credentials from Susanna. If you email the Vivint guys, we can give you the facebook credentials.

If you're running your own facebook app, then you'll already have your app id and secret. If you're pushing to appfog, make sure to get the correct app id and secret from us.
