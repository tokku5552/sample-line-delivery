import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class ApiConstruct extends Construct {
  public readonly table: dynamodb.Table;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.Table(this, "Table", {
      tableName: "sample-delivery-table",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    const api = new apigw.RestApi(this, "RestApi", {
      deployOptions: {
        stageName: "v1",
        tracingEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: ["*"],
        allowCredentials: true,
        statusCode: 200,
        exposeHeaders: [
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Headers",
        ],
      },
    });

    const getFunction = new nodejs.NodejsFunction(this, "GetFunction", {
      entry: "lambda/get.ts",
      functionName: "sample-delivery-get-function",
      runtime: lambda.Runtime.NODEJS_18_X,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        TABLE_NAME: this.table.tableName,
      },
    });

    const getAlias = getFunction.addAlias("GetFunctionAlias", {
      provisionedConcurrentExecutions: 1,
    });

    const getAllFunction = new nodejs.NodejsFunction(this, "GetAllFunction", {
      entry: "lambda/getAll.ts",
      functionName: "sample-delivery-get-all-function",
      runtime: lambda.Runtime.NODEJS_18_X,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        TABLE_NAME: this.table.tableName,
      },
    });

    const createFunction = new nodejs.NodejsFunction(this, "CreateFunction", {
      entry: "lambda/create.ts",
      functionName: "sample-delivery-create-function",
      runtime: lambda.Runtime.NODEJS_18_X,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        TABLE_NAME: this.table.tableName,
      },
    });
    const updateFunction = new nodejs.NodejsFunction(this, "UpdateFunction", {
      entry: "lambda/update.ts",
      functionName: "sample-delivery-update-function",
      runtime: lambda.Runtime.NODEJS_18_X,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        TABLE_NAME: this.table.tableName,
      },
    });
    const deleteFunction = new nodejs.NodejsFunction(this, "DeleteFunction", {
      entry: "lambda/delete.ts",
      functionName: "sample-delivery-delete-function",
      runtime: lambda.Runtime.NODEJS_18_X,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        TABLE_NAME: this.table.tableName,
      },
    });

    this.table.grantReadWriteData(getAllFunction);
    this.table.grantReadWriteData(getFunction);
    this.table.grantReadWriteData(createFunction);
    this.table.grantReadWriteData(updateFunction);
    this.table.grantReadWriteData(deleteFunction);

    const getAllIntegration = new apigw.LambdaIntegration(getAllFunction);
    const getIntegration = new apigw.LambdaIntegration(getFunction);
    const createIntegration = new apigw.LambdaIntegration(createFunction);
    const updateIntegration = new apigw.LambdaIntegration(updateFunction);
    const deleteIntegration = new apigw.LambdaIntegration(deleteFunction);

    const items = api.root.addResource("items");
    const itemsId = items.addResource("{id}");

    items.addMethod("GET", getAllIntegration);
    items.addMethod("POST", createIntegration);
    itemsId.addMethod("GET", getIntegration);
    itemsId.addMethod("PUT", updateIntegration);
    itemsId.addMethod("DELETE", deleteIntegration);
  }
}
