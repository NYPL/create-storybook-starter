import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import Listr from 'listr';
import { install } from 'pkg-install';
var URL = require('url').URL;
import findPkg from 'pkg-up';
import jsonfile from 'jsonfile';

const access = promisify(fs.access);
const copy = promisify(ncp);
const storybookDevDeps = [
  "@storybook/addon-a11y",
  "@storybook/addon-actions",
  "@storybook/addon-info",
  "@storybook/addon-knobs",
  "@storybook/addon-links",
  "@storybook/addon-storysource",
  "@storybook/addons",
  "@storybook/react",
  "@storybook/storybook-deployer",
  "@storybook/theming",
];

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function addScripts() {
  const pkgPath = await findPkg();
  if (!pkgPath) throw new Error('No package.json file found!');

  const pkg = await jsonfile.readFile(pkgPath);
  const storybookScripts = {
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook",
    "deploy-storybook": "storybook-to-ghpages"
  };

  pkg.scripts = Object.assign(pkg.scripts, storybookScripts);
  await jsonfile.writeFile(pkgPath, pkg, { spaces: 2 });
  return;
}

export async function createStorybook(options) {
  options = {
    ...options,
    targetDirectory: process.cwd(),
  };

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates'
  );
  options.templateDirectory = templateDir;

  const getTemplateDirectory = (name) => path.resolve(
      new URL(currentFileUrl).pathname,
      '../../templates',
      name
    );

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const configOpts = {
    templateDirectory: getTemplateDirectory('.storybook'),
    targetDirectory: '.storybook'
  };
  const storyOpts = {
    templateDirectory: getTemplateDirectory('stories'),
    targetDirectory: 'stories'
  };

  const tasks = new Listr([
    {
      title: 'Copying .storybook files',
      task: () => copyTemplateFiles(configOpts),
    },
    {
      title: 'Copying example story',
      task: () => copyTemplateFiles(storyOpts)
    },
    {
      title: 'Adding npm scripts to package.json',
      task: () => addScripts(),
    },
    {
      title: 'Install dev-dependencies',
      task: () =>
        install(
          storybookDevDeps,
          { cwd: options.targetDirectory, dev: true }
        )
    },
  ]);

  await tasks.run();

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}
