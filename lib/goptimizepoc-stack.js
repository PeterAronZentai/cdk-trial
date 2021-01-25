const path = require('path');
const cdk = require('@aws-cdk/core');
const s3deploy = require('@aws-cdk/aws-s3-deployment');
const s3 = require('@aws-cdk/aws-s3');
const cloudfront = require('@aws-cdk/aws-cloudfront');
const origins = require('@aws-cdk/aws-cloudfront-origins');
const acm = require('@aws-cdk/aws-certificatemanager');
const lambda = require('@aws-cdk/aws-lambda');
const lambdaNode = require('@aws-cdk/aws-lambda-nodejs');
const apiGw = require('@aws-cdk/aws-apigateway');

// const apiGw = require('@aws-cdk/aws-apigateway');
// const apiGw2Integrations = require('@aws-cdk/aws-apigatewayv2-integrations');
class GoptimizepocStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {

    });
    
    const domainName = 'today.zed.codes';


    const lambdaFunction = new lambda.Function(this, "ZedLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
    });
    
    const lambdaIntegration = new apiGw.LambdaIntegration(lambdaFunction, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }'  }
    });
    
    const zedApi = new apiGw.RestApi(this, "ZedAPI", {
      restApiName: "Zed API",

    });
    zedApi.root.addMethod("GET", lambdaIntegration);
    zedApi.root.addProxy({  defaultIntegration: lambdaIntegration })
    // zedApi.addRoutes({
    //   path: '/api/zed',
    //   methods: [apiGw.HttpMethod.GET, apiGw.HttpMethod.OPTIONS],
    //   integration: lambdaIntegration
    // });
    // zedApi.addRoutes({
    //   path: '/',
    //   methods: [apiGw.HttpMethod.GET, apiGw.HttpMethod.OPTIONS],
    //   integration: lambdaIntegration
    // });

    const certificate = acm.Certificate.fromCertificateArn(this, 'ZedCert', 'arn:aws:acm:us-east-1:856324650258:certificate/02d6d907-4c7d-48d9-9cae-5a6714fc0dad');

    const cachePolicy = new cloudfront.CachePolicy(this, 'ZedCache', {
      maxTtl: cdk.Duration.seconds(0),
    })
    const cachePolicy2 = new cloudfront.CachePolicy(this, 'ZedCache2', {
      maxTtl: cdk.Duration.seconds(0),
      defaultTtl: cdk.Duration.seconds(0),
    })
    const originRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'ZedORP', {
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.all(),
      cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
    });

    // const logBucket = new s3.Bucket(this, 'LogBucket', {

    // });
    new cloudfront.Distribution(this, 'ZedCodesDist', {
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: { 
          // origin: new origins.HttpOrigin(`${zedApi.restApiId}.execute-api.${this.region}.amazonaws.com`, { originPath: '/prod' }),
          // allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
          // viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          // cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          // originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
        
        origin: new origins.S3Origin(websiteBucket), 
        cachePolicy,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(`${zedApi.restApiId}.execute-api.${this.region}.amazonaws.com`, { originPath: '/prod' }),
          allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },        
        'api/*': {
          origin: new origins.HttpOrigin(`${zedApi.restApiId}.execute-api.${this.region}.amazonaws.com`, { originPath: '/prod' }),
          allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        }
      },
      domainNames: [domainName],
      certificate,
      defaultRootObject: 'index.html',
      enableLogging: true,
      // logBucket: logBucket,
    });
    
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./website-dist')],
      destinationBucket: websiteBucket,
    });
  }
}

module.exports = { GoptimizepocStack }


