import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class EventBridgeConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { table }: { table: dynamodb.Table }
  ) {
    super(scope, id);

    const sendMessageFunction = new nodejs.NodejsFunction(
      this,
      "SendMessageFunction",
      {
        entry: "lambda/sendMessage.ts",
        functionName: "sample-delivery-send-message-function",
        runtime: lambda.Runtime.NODEJS_18_X,
        environment: {
          TABLE_NAME: table.tableName,
          CHANNEL_ACCESS_TOKEN: "dummy",
          CHANNEL_SECRET: "dummy",
        },
      }
    );
    // Create an EventBridge rule
    const rule = new events.Rule(this, "EventBridgeRule", {
      schedule: events.Schedule.cron({ minute: "0", hour: "12" }),
    });

    // Add a target to the rule
    rule.addTarget(new targets.LambdaFunction(sendMessageFunction));

    table.grantReadWriteData(sendMessageFunction);
  }
}
