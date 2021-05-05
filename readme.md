# ⛔ Archived 
This project is now archived and no longer maintained. 
We do not currently have supported components for Angular. 
We do however have supported components for React which can be found in this [repository](https://github.com/inrupt/solid-ui-react).
Supported components will always use the latest [Solid client libraries](https://github.com/inrupt/solid-client-js) from [Inrupt](https://inrupt.com). 
We will continue to make components and libraries available for other frameworks and languages and you can find announcements on new releases on our [website](https://inrupt.com/blog).


# ⛔ Solid Angular Yeoman Generator

A yeoman generator to help you get up and running quickly using Solid and Angular. Running the generator will create a sample Angular profile editor application using Solid.

## ⛔ Getting Started

The below instructions will get you up and running with a Solid app in a matter of minutes.

### ⛔ Prerequisites

You will need a few things to get started. The first is npm, as you will need to install the app using npm. You will also likely need angular-cli installed globally. 

You can do this by running the following command

```
npm install -g @angular/cli
```

Another thing you will need to install manually is yeoman itself, if you don't already have it. You can install yeoman using the following command:
```
npm install -g yo
```

### ⛔ Installing

The easiest way to install the yeoman generator is using npm. To install, you can run the command
```
npm install -g @inrupt/generator-solid-angular
```

## ⛔ Using the Generator

Once it's installed, you can run the generator using a command line interface. First, navigate to the parent folder you wish to create the new project. Next, run the command
```
yo @inrupt/solid-angular
```
This will open a prompt with a few questions, such as the project name. Note the project name will also be your root folder name.

The generator will then install the angular and solid project files, then run npm install for you.

Once the generator has finished running, you can navigate into the newly created project folder and run the command
``` 
ng serve
```
That command is the regular angular-cli serve, and will launch the web app on your localhost, port 4200.

With this running, you'll see a login page.
