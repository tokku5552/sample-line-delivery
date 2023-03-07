import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class FrontConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // S3バケット作成
    const appBucket = new s3.Bucket(this, "AppBucket", {
      bucketName: "sample-line-delivery-app-bucket",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
    });

    const appIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );

    appBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        effect: iam.Effect.ALLOW,
        principals: [appIdentity.grantPrincipal],
        resources: [`${appBucket.bucketArn}/*`],
      })
    );

    // CloudFrontの設定
    const appDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "AppDistribution",
      {
        errorConfigurations: [
          {
            errorCode: 403,
            errorCachingMinTtl: 300,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
          {
            errorCode: 404,
            errorCachingMinTtl: 300,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
        ],
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: appBucket,
              originAccessIdentity: appIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      }
    );

    // S3へデプロイ
    new s3deploy.BucketDeployment(this, "BucketDeployment", {
      sources: [s3deploy.Source.asset("../front/out")],
      destinationBucket: appBucket,
      distribution: appDistribution,
      distributionPaths: ["/*"],
    });
  }
}
