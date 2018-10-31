# Nwen304GroupProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.

## Development Instructions

I will explain the different methods below, and when you should use them. 

IMPORTANT: Its recommended after a pull from master branch, to open a terminal and type `npm install` just in case any other team member has added/remove/modified NPM packages in the project. This usually occurs after Prashant's merges to master branch as he modifies the build configurations of the project frequently.

ADVICE: You can work on ECS lab machines, but please follow the instructions on the Wiki page for things to work. It does work if you follow the instructions properly as I have tested them myself.

### Method 1: Used in active development locally
Recommended to use when you are actively testing and developing on either the front-end or back-end. This is because both stacks are operating independently allowing for faster compile/build times. In fact, if you are only developing on a single stack, you don't even have to execute the other one if the operations you are testing are independent of each other.

1. Open a new terminal and run `npm run server` from the application's root directory. This will build and run the API server. Navigate to `http://localhost:5000/` to access API services. Any code changes to the back-end code will mean you have to re-execute this command as the server requires rebuilding.
2. Open another terminal and run `npm start` from the application's root directory. This will run the client-side webserver. Navigate to `http://localhost:4200/` to access website.
3. Done! 

Although the back-end and front-end are running on different servers, a proxy configuration is already set up so you do not have worry about how they connect. To access a API route from Angular, just do `/api/...` as a relative URL.

### Method 2: Used to test application before uploading to Heroku

1. Open a new terminal in the application's root directory.
2. Type `npm run build`. Wait for building to be finished, it usually takes up to 20-30 seconds.
3. After the build command has finished, type `heroku local web`. If Heroku is not installed, you can use the alternative command `npm run serve:ssr`. Navigate to `http://localhost:5000/` to access both the website and API service.
4. Done! 
5. If all is working well, push the changes to Heroku via `git push heroku master`. Wait for the build to finish. At the end of the logs, it will display a URL where you can access the website on the internet.

You can also use this method for development, but it gets annoying to use because any code changes on the front-end or back-end will require you to re-execute the command in the Step 1, which can is a time-consuming operation.


## New Components

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

IMPORTANT When creating a new page, use the flag `-m  app.module.ts`. For example `ng generate component browsing-page -m app.module.ts`. 

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
