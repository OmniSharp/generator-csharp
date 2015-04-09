'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

var csharpgenerator = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
    },

  init: function () {
    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvellous ' + chalk.red('C#') + ' generator!'    ));
    this.templatedata = {};
  },
  
  getInfo: function (){
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

  writing: function(){
    this.mkdir(this.applicationName);

    switch(this.projecttype){
      case 'classlibrary':
        this.sourceRoot(path.join(__dirname,'./templates/',this.projecttype));
        this.template(this.sourceRoot() + '/Class1.cs',this.applicationName+'/Class1.cs',this.templatedata);
        this.template(this.sourceRoot() + '/ClassLibrary.csproj',this.applicationName+'/'+this.applicationName+'.csproj',this.templatedata);
        this.mkdir(this.applicationName + '/Properties/');
        this.template(this.sourceRoot() + '/Properties/AssemblyInfo.cs',this.applicationName + '/Properties/AssemblyInfo.cs',this.templatedata);
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
        this.template(this.sourceRoot() + '/Program.cs', this.applicationName + '/Program.cs', this.templatedata);
        this.template(this.sourceRoot() + '/ConsoleApp.csproj', this.applicationName + '/' + this.applicationName + '.csproj', this.templatedata);
        this.mkdir(this.applicationName + '/Properties/');
        this.template(this.sourceRoot() + '/Properties/AssemblyInfo.cs', this.applicationName + '/Properties/AssemblyInfo.cs', this.templatedata);
        break; 
    }
  }
});

module.exports = csharpgenerator
