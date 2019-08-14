## create-storybook-starter

This is an opinionated starter script for Storybook based on the NYPL Simplified's Storybook instance for [Reusable Components](https://github.com/NYPL-Simplified/reusable-components).

### Requirements
This is currently used for Typescript, React 16, and Webpack 4 projects in SimplyE. It is necessary to use Webpack to add configs to the project and, for now, Typescript. Check the TODO section for upcoming updates.

### Installation and Usage
It's recommended to install the project globally:

```bash
$ npm install -g create-storybook-starter
```

Simply run the following in your _Typescript_-based project:

```bash
$ create-storybook-starter
```

This will add a `stories` and `.storybook` folders in the root of your project. `stories` contains an example Storybook story file and `.storybook` contains configurations for Storybook. The script will also add the necessary npm scripts and devdependencies to `package.json`.

### TODO
This project relies on the base project to use and include Typescript, React 16, and Webpack 4. Not all NYPL projects use this configuration and making this more generic is a plan for the future.
