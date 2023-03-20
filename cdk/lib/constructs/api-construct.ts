import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class ApiConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const table = new dynamodb.Table(this, "Table", {
      tableName: "sample-delivery-table",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    const api = new apigw.RestApi(this, "RestApi", {
      deployOptions: {
        stageName: "v1",
      },
    });

    const getFunction = new nodejs.NodejsFunction(this, "GetFunction", {
      entry: "lambda/get.ts",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    const createFunction = new nodejs.NodejsFunction(this, "CreateFunction", {
      entry: "lambda/create.ts",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    const updateFunction = new nodejs.NodejsFunction(this, "UpdateFunction", {
      entry: "lambda/update.ts",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    const deleteFunction = new nodejs.NodejsFunction(this, "DeleteFunction", {
      entry: "lambda/delete.ts",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(getFunction);
    table.grantReadWriteData(createFunction);
    table.grantReadWriteData(updateFunction);
    table.grantReadWriteData(deleteFunction);

    const getIntegration = new apigw.LambdaIntegration(getFunction);
    const createIntegration = new apigw.LambdaIntegration(createFunction);
    const updateIntegration = new apigw.LambdaIntegration(updateFunction);
    const deleteIntegration = new apigw.LambdaIntegration(deleteFunction);

    const items = api.root.addResource("items");
    items.addMethod("GET", getIntegration);
    items.addMethod("POST", createIntegration);
    items.addMethod("PUT", updateIntegration);
    items.addMethod("DELETE", deleteIntegration);
  }
}
