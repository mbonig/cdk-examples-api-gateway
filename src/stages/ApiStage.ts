import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiStack, ApiStackProps } from '../stacks/ApiStack';
import { OrderStack } from '../stacks/OrderStack';
import { PersonStack } from '../stacks/PersonStack';

export interface ApiStageProps extends ApiStackProps{
}

export class ApiStage extends Stage {
  constructor(scope: Construct, id: string, props: ApiStageProps) {
    super(scope, id, props);

    const apiStack = new ApiStack(this, 'Api', props);
    const { api, table } = apiStack;
    const personStack = new PersonStack(this, 'Person', { api, table });
    const orderStack = new OrderStack(this, 'Order', { api, table });

    // Add dependencies to the api stack so that it knows if it needs to redeploy
    apiStack.addToDeployment(personStack.deploymentDependencies);
    apiStack.addToDeployment(orderStack.deploymentDependencies);
  }

}
