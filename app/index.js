'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const _ = require('lodash');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-enrichment') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the human readable name of the enrichment (Richmond Parcel)?',
      required: true
    }, {
      type: 'input',
      name: 'description',
      message: 'Provide a short description (Provides parcel data for city of Richmond, VA)?',
      required: true
    }, {
      type: 'list',
      name: 'baseClass',
      message: 'Which base class would you like to extend?',
      choices: ['ArcGISServiceEnrichment','Enrichment'],
      default: 'Enrichment',
      required: true
    }, {
      type: 'list',
      name: 'outputType',
      message: 'Which type of data does the enrichment provide?',
      choices: ['Council District','First Due','Parcel','Population Density','Precinct','Response Zone','Weather'],
      default: 'Parcel',
      required: true
    },];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.props.repoName = 'se-enrichment-' + _.kebabCase(this.props.name);
      this.props.className = _.upperFirst(_.camelCase(this.props.name)) + 'Enrichment';

      switch(this.props.outputType) {
        case 'Council District':
        case 'Neighborhood':
        case 'Precinct':
          this.props.normalizedOutput = 'address.location';
          break;

        case 'First Due':
        case 'Population Density':
        case 'Response Zone':
          this.props.normalizedOutput = 'address';
          break;

        case 'Parcel':
          this.props.normalizedOutput = 'address.location.parcel';
          break;

        case 'Weather':
          this.props.normalizedOutput = 'weather';
          break;
      }
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath(path.join(this.props.repoName, '.babelrc'))
    );

    this.fs.copy(
      this.templatePath('eslintrc'),
      this.destinationPath(path.join(this.props.repoName, '.eslintrc'))
    );

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath(path.join(this.props.repoName, '.gitignore'))
    );

    this.fs.copyTpl(
      this.templatePath('README'),
      this.destinationPath(path.join(this.props.repoName, 'README.md')),
      { repoName: this.props.repoName, humanName: this.props.name, description: this.props.description }
    );

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath(path.join(this.props.repoName, 'package.json')),
      { repoName: this.props.repoName, description: this.props.description }
    );

    this.fs.copyTpl(
      this.templatePath('test/test.js'),
      this.destinationPath(path.join(this.props.repoName, 'test/test.js')),
      { className: this.props.className,
        baseClass: this.props.baseClass,
        normalizedOutput: this.props.normalizedOutput,
      }
    );

    mkdirp.sync(path.join(this.props.repoName, 'test/data'));

    this.fs.copyTpl(
      this.templatePath('src/index.js'),
      this.destinationPath(path.join(this.props.repoName, 'src/index.js')),
      { className: this.props.className,
        baseClass: this.props.baseClass,
        normalizedOutput: this.props.normalizedOutput,
      }
    )
  }

  install() {
    this.installDependencies({
      bower: false
    });
  }
};
