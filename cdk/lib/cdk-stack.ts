import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiConstruct } from "./constructs/api-construct";
import { FrontConstruct } from "./constructs/front-construct";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new FrontConstruct(this, "FrontConstruct");
    new ApiConstruct(this, "ApiConstruct");
  }
}
