'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

var csharpgenerator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.option("fx", {
      desc: "Which .NET Framework version to load",
      type: "Number",
      defaults: 4.6,
      hide: false
    });
  },
  
  init: function () {
    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvellous ' + chalk.red('C#') + ' generator!'));
    this.templatedata = {};
    switch (this.options.fx) {
      case 2:
      case 3:
      case 3.5:
      case 4:
      case 4.5:
      case 4.6:
        this.fx = this.options.fx;
        this.templatedata.fx = this.fx.toFixed(1);
        break;
      default:
        this.fx = 0;
        this.log(chalk.red('Unknown framework version \'' + this.options.fx.toFixed(1) + '\''));
    }
  },
  getInfo: function () {
    if (this.fx === 0) {
      return;
    }
    var done = this.async();
    
    function askFor() {
      var prompts = [{
          type: 'list',
          name: 'projecttype',
          message: 'What type of project do you want to create?',
          choices: [
            {
              name: 'Class library',
              value: 'classlibrary'
            },
            {
              name: "Portable class library",
              value: 'portableclasslib'
            },
            {
              name: 'xUnit test project',
              value: 'xunit'
            },
            {
              name: 'Console application',
              value: 'consoleapp'
            }
          ]
        }];
      
      this.prompt(prompts, function (props) {
        this.projecttype = props.projecttype;
        askForName.apply(this);
      }.bind(this));
    }
    
    function askForName() {
      var app = '';
      
      switch (this.projecttype) {
        case 'classlibrary':
          app = 'ClassLibrary';
          break;
        case 'portableclasslib':
          app = 'PortableClassLibrary';
          break;
        case 'xunit':
          app = 'UnitTest';
          break;
        case 'consoleapp':
          app = 'ConsoleApp';
          break;
        default:
          this.log('Unknown value for projecttype: [' + this.projecttype + ']');
          askFor.apply(this);
          return;
      }
      
      var prompts = [{
          name: 'applicationName',
          message: 'What\'s the name of your ' + app.match(/(?:([A-Z][a-z]+)(?=[A-Z]))|(?:([a-z]+)(?=[A-Z]))|(?:(\d+))|(?:([A-Z][a-z]+))|([A-Z]+)/g).join(' ') + '?',
          default: app
        }];
      this.prompt(prompts, function (props) {
        this.templatedata.namespace = props.applicationName;
        this.templatedata.applicationname = props.applicationName;
        this.applicationName = props.applicationName;
        
        done();
      }.bind(this));
    }
    
    askFor.apply(this);
  },
  
  writing: function () {
    if (this.fx === 0) {
      return;
    }
    this.mkdir(this.applicationName);
    
    switch (this.projecttype) {
      case 'classlibrary':
        this.sourceRoot(path.join(__dirname, './templates/', this.projecttype));
        switch (this.fx) {
          case 2:
          case 3:
            this.template(this.sourceRoot() + '/Class1.20.cs', this.applicationName + '/Class1.cs', this.templatedata);
            break;
          case 3.5:
            this.template(this.sourceRoot() + '/Class1.35.cs', this.applicationName + '/Class1.cs', this.templatedata);
            break;
          case 4.0:
          case 4.5:
          case 4.6:
            this.template(this.sourceRoot() + '/Class1.40.cs', this.applicationName + '/Class1.cs', this.templatedata);
            break;
        }
        switch (this.fx) {
          case 2:
          case 3:
            this.template(this.sourceRoot() + '/ClassLibrary.20.csproj', this.applicationName + '/' + this.applicationName + '.csproj', this.templatedata);
            break;
          case 3.5:
          case 4.0:
          case 4.5:
          case 4.6:
            this.template(this.sourceRoot() + '/ClassLibrary.35.csproj', this.applicationName + '/' + this.applicationName + '.csproj', this.templatedata);
            break;
        }
        this.mkdir(this.applicationName + '/Properties/');
        this.template(this.sourceRoot() + '/Properties/AssemblyInfo.cs', this.applicationName + '/Properties/AssemblyInfo.cs', this.templatedata);
        break;
      case 'portableclasslib':
        this.log('not implemented yet');
        return;
        break;
      case 'xunit':
        this.log('not implemented yet');
        return;
        break;
      case 'consoleapp':
        this.sourceRoot(path.join(__dirname, './templates/', this.projecttype));
        switch (this.fx) {
          case 2:
          case 3:
            this.template(this.sourceRoot() + '/Program.20.cs', this.applicationName + '/Program.cs', this.templatedata);
            break;
          case 3.5:
            this.template(this.sourceRoot() + '/Program.35.cs', this.applicationName + '/Program.cs', this.templatedata);
            break;
          case 4.0:
          case 4.5:
          case 4.6:
            this.template(this.sourceRoot() + '/Program.40.cs', this.applicationName + '/Program.cs', this.templatedata);
            break;
        }
        switch (this.fx) {
          case 2:
          case 3:
            this.template(this.sourceRoot() + '/ConsoleApp.20.csproj', this.applicationName + '/' + this.applicationName + '.csproj', this.templatedata);
            break;
          case 3.5:
          case 4.0:
          case 4.5:
          case 4.6:
            this.template(this.sourceRoot() + '/ConsoleApp.35.csproj', this.applicationName + '/' + this.applicationName + '.csproj', this.templatedata);
            break;
        }
        this.mkdir(this.applicationName + '/Properties/');
        this.template(this.sourceRoot() + '/Properties/AssemblyInfo.cs', this.applicationName + '/Properties/AssemblyInfo.cs', this.templatedata);
        break;
    }
  }
});

module.exports = csharpgenerator
