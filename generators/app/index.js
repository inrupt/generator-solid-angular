const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const figlet = require('figlet');
const path = require('path');
const mkdirp = require('mkdirp');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    const done = this.async();
    this.log(yosay(chalk.cyan.bold('Welcome to the \n Solid Angular 6 Generator')));

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Please enter your application name :',
      store: true,
      validate: (name) => {
        const pass = name.match(/^[^\d\s!@£$%^&*()+=]+$/);
        if (pass) {
          return true;
        }
        return `${chalk.red('Provide a valid "App name", digits and whitespaces not allowed')}`;
      },
      default: this.appname // Default to current folder name
    }]).then((answers) => {
      this.props = answers;
      done();
    });

  }

  writing() {
    this.log('Copying app directory...');
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        `Creating folder...`
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }

    this.log(this.templatePath());
    this.log(this.destinationPath());
    /*this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      {
        name: this.props.name
      }


    );
*/
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationRoot(),
      {
        name: this.props.name
      },
      {},
      {
        globOptions: {
          ignore: ['node_modules', 'dist']
        }
      }
    );
  }

  install() {
    this.log('Installing dependencies...');
    const _this = this;
    if (this.props.runNpm) {
      this.installDependencies({
        npm: true,
        callback: function () {
          _this.log(`${chalk.bold.underline.green('Dependencies installed!')}`);
        }
      });
    }
    this.completed = true;
  }

  end() {
    if (this.completed) {
      this.log('Installation complete. Welcome to Solid');
      this.log(chalk.bold.blue(figlet.textSync('- Solid -',
        {
          font: '3D-ASCII',
          horizontalLayout: 'full',
          verticalLayout: 'full'
        }
      )));
      return;
    }
  }
}