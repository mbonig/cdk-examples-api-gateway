import { APIGatewayEvent } from 'aws-lambda';
import { PersonApplication } from './PersonApplication';
import { PersonRepository } from './PersonRepository';
import { DynamoDBAdapter } from '../common/IDatabaseAdapter';

export const TABLE_NAME = 'TABLE_NAME';
export const INDEX_NAME = 'INDEX_NAME';

export const handler = async (event: APIGatewayEvent) => {
  console.log(JSON.stringify(event, null, 2));
  const indexName = process.env[INDEX_NAME]!;
  const personApplication = new PersonApplication(
    new PersonRepository(
      new DynamoDBAdapter(process.env[TABLE_NAME]!),
      indexName,
    ),
  );

  if (event.pathParameters?.id) {
    const id = event.pathParameters.id;
    const person = await personApplication.getById(id);
    if (!person) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Person not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(person),
    };
  }

  const persons = await personApplication.getAll();
  return {
    statusCode: 200,
    body: JSON.stringify(persons),
  };
};
