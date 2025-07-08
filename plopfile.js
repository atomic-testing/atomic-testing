export default function (plop) {
  plop.setGenerator('component-driver', {
    description: 'Create a component driver',
    prompts: [
      {
        type: 'input',
        name: 'driverName',
        message: 'Driver name (e.g. ButtonDriver)',
      },
      {
        type: 'input',
        name: 'path',
        message: 'Directory for the driver file',
        default: 'packages/your-package/src/components',
      },
      {
        type: 'confirm',
        name: 'hasParts',
        message: 'Does this driver have parts?',
        default: true,
      },
    ],
    actions: [
      {
        type: 'add',
        path: '{{path}}/{{driverName}}.ts',
        templateFile: 'plop-templates/componentDriver.hbs',
      },
    ],
  });

  plop.setGenerator('container-component-driver', {
    description: 'Create a container component driver',
    prompts: [
      {
        type: 'input',
        name: 'driverName',
        message: 'Driver name (e.g. DialogDriver)',
      },
      {
        type: 'input',
        name: 'path',
        message: 'Directory for the driver file',
        default: 'packages/your-package/src/components',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '{{path}}/{{driverName}}.ts',
        templateFile: 'plop-templates/containerComponentDriver.hbs',
      },
    ],
  });
}
