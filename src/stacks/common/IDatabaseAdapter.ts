import awsLite from '@aws-lite/client';

export interface TableModel extends Record<string, string | number | boolean | any> {
  pk: string;
  sk: string;
}

export interface IDatabaseAdapter {
  queryItem(pk: string): Promise<TableModel[]>;

  getItem(pk: string, sk: string): Promise<TableModel>;

  putItem(data: TableModel): Promise<void>;

  getAll(indexName?: string): Promise<TableModel[]>;
}

export class DynamoDBAdapter implements IDatabaseAdapter {
  private awsClient: any;

  constructor(private tableName: string) {
  }

  async queryItem(pk: string): Promise<TableModel[]> {
    await this.createClient();
    const item = await this.awsClient.DynamoDB.Query({
      TableName: this.tableName,
      KeyConditionExpression: ':pk = pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    });
    return item.Items as TableModel[];
  }

  async getAll(indexName?: string): Promise<TableModel[]> {
    await this.createClient();
    const results = await this.awsClient.DynamoDB.Scan({
      IndexName: indexName,
      TableName: this.tableName,
      paginate: true,
    });
    return results.Items;
  }

  async createClient() {
    if (this.awsClient) {
      return;
    }

    // @ts-ignore
    this.awsClient = await awsLite({ region: process.env.AWS_REGION, plugins: [await import('@aws-lite/dynamodb')] });
  }

  async getItem(pk: string, sk: string): Promise<TableModel> {
    await this.createClient();
    const item = await this.awsClient.DynamoDB.GetItem({
      TableName: this.tableName,
      Key: { pk, sk },
    });
    return item.Item as TableModel;
  }

  async putItem(data: TableModel): Promise<void> {
    await this.createClient();
    return this.awsClient.DynamoDB.PutItem({
      TableName: this.tableName,
      Item: data,
    });
  }
}

