import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { ApiStack } from '../../src/stacks/ApiStack';
import { PersonStack } from '../../src/stacks/PersonStack';

test('Snapshot', () => {
  const app = new App();
  const stack = new ApiStack(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});

test('Snapshot with added dependencies', () => {
  const app = new App();
  const stack = new ApiStack(app, 'test');
  const personStack = new PersonStack(stack, 'Person', { api: stack.api, table: stack.table });
  stack.addToDeployment(personStack.deploymentDependencies);
  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
