import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Deployment, RestApi, Stage } from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { ARecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

export interface ApiStackProps extends StackProps {
  hostedZoneId: string;
}

export class ApiStack extends Stack {
  api: RestApi;
  table: TableV2;
  private deployment!: Deployment;
  private apiDomainName: string;

  constructor(scope: Construct, id: string, private props: ApiStackProps) {
    super(scope, id, props);

    const apiDomainName = this.apiDomainName = 'api.example.matthewbonig.com';
    this.api = this.createApi();
    this.table = this.createTable();

    new CfnOutput(this, 'BaseApiGatewayURL', {
      value: `https://${this.api.restApiId}.execute-api.${this.region}.amazonaws.com/prod/`,
    });
    new CfnOutput(this, 'CustomURL', {
      value: `https://${apiDomainName}/v1/`,
    });

  }

  private createApi(): RestApi {
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: this.props.hostedZoneId,
      zoneName: 'example.matthewbonig.com',
    });
    const api = new RestApi(this, 'MyRestApi', {
      deploy: false,
      restApiName: 'CdkCourseApi',
      domainName: {
        domainName: this.apiDomainName,
        certificate: new Certificate(this, 'Certificate', {
          domainName: this.apiDomainName,
          validation: CertificateValidation.fromDns(hostedZone),
        }),
      },
    });

    new ARecord(this, 'ApiAliasRecord', {
      target: {
        aliasTarget: new ApiGateway(api),
      },
      recordName: 'api',
      zone: hostedZone,
    });

    api.root.addMethod('ANY');

    const deployment = this.deployment = new Deployment(this, 'Deployment', {
      api: api,
    });
    new Stage(this, 'Prod', {
      deployment,
      stageName: 'v1',
    });

    return api;
  }

  private createTable(): TableV2 {
    return new TableV2(this, 'MyTable', {
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
    });
  }

  public addToDeployment(resources: any[]) {
    for (const resource of resources) {
      this.deployment.addToLogicalId(resource);
    }
  }
}
