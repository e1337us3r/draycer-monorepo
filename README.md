# DRaycer
![Team4](https://github.com/e1337us3r/draycer-monorepo/assets/29656513/19f7af81-855f-4f9c-b44e-a106ab51e405)


## What is DRaycer?
DRaycer is a web-based distributed Ray Tracing rendering system that is a faster and cheaper alternative to traditional rendering farms used by film and media industry. Users can create the scene that they want to render on our feature-rich scene editor. Add lights, set up the camera, place premade 3D objects or even upload your models, with a click of a button your scene will be rendered and delivered to you in a moment. The distributed nature of the system allows it to outsource each chunk of the rendering process to a worker that is connected to our system. Any device that can open an Internet browser can become a worker; smartphones, and IoT devices, which total up to billions of devices. Using these devices DRaycer can render complex 3D scenes with ray tracing in just a few seconds at the fraction of the cost. 

## Getting started

DRaycer uses Firebase service for authentication. In order to run the server you must first create a Firebase project.

## 1) Set up Firebase

Create an account, and a simple web project. Head over to your console, find your API key on your project settings. Copy it and create a firebase.js file under src/Components/auth and initilize a firebase application.

## 2) Set up environment variables

If there are any changes to the serverUrl and serverSocketUrl variables on the DRaycer back-end. Change them accordingly in the config.js file.

## 3) Set up dependencies

Depending on your package manager (DRaycer uses yarn), install the dependencies required on different package.json files found inside the application.

Important: Use node version 12

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

## 4) Start the backend

Follow the instructions in the backend repository [https://github.com/e1337us3r/draycer-backend](https://github.com/e1337us3r/draycer-backend)

## 5) Run the application

```
yarn start
```

You should see the message 'Starting the development server...'

If everything is correct on your part, the app will compile succesfully. If not the terminal will output you any compile errors or warnings.

## License

Copyright (c) 2020 DRaycer. Licensed under the MIT license.
