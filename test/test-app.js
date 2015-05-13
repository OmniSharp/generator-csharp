'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

function createProjectTypeTest(type, files)
{
  describe('csharp:' + type, function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompt({
        projecttype: type,
        applicationName: "test"
      })
      .on('end', done);
    });
    
    it('creates files', function () {
      assert.file(files);
    });

  });
}

createProjectTypeTest("classlibrary", [
  'test/Class1.cs',
  'test/test.csproj',
  'test/Properties/AssemblyInfo.cs'
]);

createProjectTypeTest("consoleapp", [
  'test/Program.cs',
  'test/test.csproj',
  'test/Properties/AssemblyInfo.cs'
]);