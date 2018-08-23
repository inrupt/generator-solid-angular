const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const figlet = require('figlet');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    const done = this.async();
    this.log(yosay(chalk.cyan.bold('Welcome to the \n Solid Angular Generator')));

    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Please enter your application name (Test data):',
      store   : true,
      validate: (name) => {
        const pass = name.match(/^[^\d\s!@£$%^&*()+=]+$/);
        if (pass) {
          return true;
        }
        return `${chalk.red('Provide a valid string, digits and whitespaces not allowed')}`;
      },
      default : this.appname // Default to current folder name
    }]).then((answers) => {
      this.props = answers;
      done();
    });;

  }

  writing() {

  }

  install() {

  }

  end() {

  }
};