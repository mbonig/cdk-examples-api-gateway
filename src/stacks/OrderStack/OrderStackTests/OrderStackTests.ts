import { Construct } from 'constructs';
import { GetOrderTest, GetOrderTestProps } from './GetOrderTest';
import { PostOrderTest, PostOrderTestProps } from './PostOrderTest';

export interface OrderStackTestProps {
  getOptions: GetOrderTestProps;
  postOptions: PostOrderTestProps;
}

export class OrderStackTests extends Construct {
  constructor(scope: Construct, id: string, props: OrderStackTestProps) {
    super(scope, id);


    new GetOrderTest(this, 'GetOrderTest', props.getOptions);
    new PostOrderTest(this, 'PostOrderTest', props.postOptions);
  }
}
