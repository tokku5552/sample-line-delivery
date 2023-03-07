import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3バケット作成
    const liffAppBucket = new s3.Bucket(this, 'LiffAppBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html'
    });

    const liffAppIdentity = new cloudfront.OriginAccessIdentity(this, 'LiffAppIdentity');

    const liffAppBucketPolicyStatement = new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: iam.Effect.ALLOW,
      principals: [liffAppIdentity.grantPrincipal],
      resources: [`${liffAppBucket.bucketArn}/*`]
    });

    liffAppBucket.addToResourcePolicy(liffAppBucketPolicyStatement);

    // CloudFrontの設定
    const liffAppDistribution = new cloudfront.CloudFrontWebDistribution(this, 'LiffAppDistribution', {
      errorConfigurations: [
        {
          errorCode: 403,
          errorCachingMinTtl: 300,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCode: 404,
          errorCachingMinTtl: 300,
          responseCode: 200,
          responsePagePath: '/index.html',
        }
      ],
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: liffAppBucket,
            originAccessIdentity: liffAppIdentity
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            }
          ]
        }
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL
    })

    // S3へデプロイ
    new s3deploy.BucketDeployment(this, 'LiffAppDeploy', {
      sources: [s3deploy.Source.asset('../front/out')],
      destinationBucket: liffAppBucket,
      distribution: liffAppDistribution,
      distributionPaths: ['/*']
    })
  }
}