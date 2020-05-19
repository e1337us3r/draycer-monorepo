# Parfüm | DRaycer Front-end App

## Getting started

DRaycer uses Firebase service for authentication. In order to run the server you must first create a Firebase project.

## 1) Set up Firebase

Create an account, and a simple web project. Head over to your console, find your API key on your project settings. Copy it and create a firebase.js file under src/Components/auth and initilize a firebase application.

## 2) Set up environment variables

If there are any changes to the serverUrl and serverSocketUrl variables on the DRaycer back-end. Change them accordingly in the config.js file.

## 3) Set up dependencies

Depending on your package manager (DRaycer uses yarn), install the dependencies required on different package.json files found inside the application.

Run

```
yarn
```

On the root position, inside the frontend folder and core folder.

After installing required dependencies on the core folder run;

```
yarn run build
```

to create a production grade build of the core DRaycer Ray Tracing algorithm.

## 4) Run the application

```
yarn start
```

You should see the message 'Starting the development server...'

If everything is correct on your part, the app will compile succesfully. If not the terminal will output you any compile errors or warnings.

## License

Copyright (c) 2020 DRaycer. Licensed under the MIT license.
