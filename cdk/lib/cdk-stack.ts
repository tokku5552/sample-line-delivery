import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiConstruct } from "./constructs/api-construct";
import { EventBridgeConstruct } from "./constructs/event-bridge-construct";
import { FrontConstruct } from "./constructs/front-construct";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new FrontConstruct(this, "FrontConstruct");
    const apiConstruct = new ApiConstruct(this, "ApiConstruct");
    new EventBridgeConstruct(this, "EventBridgeConstruct", {
      table: apiConstruct.table,
    });
  }
}
