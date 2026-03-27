import * as cdk from "aws-cdk-lib"
import * as apigw from "aws-cdk-lib/aws-apigatewayv2"
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations"
import * as ddb from "aws-cdk-lib/aws-dynamodb"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as levs from "aws-cdk-lib/aws-lambda-event-sources"
import * as ln from "aws-cdk-lib/aws-lambda-nodejs"
import * as logs from "aws-cdk-lib/aws-logs"
import { Construct } from "constructs"

export interface MinesweeperBffProps extends cdk.StackProps {
  serviceName: string
  stage: string
}

export class MinesweeperBff extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MinesweeperBffProps) {
    super(scope, id, props)

    const table = new ddb.TableV2(this, "MinesweeperBffTable", {
      partitionKey: { name: "PK", type: ddb.AttributeType.STRING },
      sortKey: { name: "SK", type: ddb.AttributeType.STRING },
      dynamoStream: ddb.StreamViewType.NEW_AND_OLD_IMAGES,
      billing: ddb.Billing.onDemand(),
      removalPolicy: props.stage === "prod" ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY
    })

    table.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: { name: "GSI1PK", type: ddb.AttributeType.STRING },
      sortKey: { name: "GSI1SK", type: ddb.AttributeType.STRING }
    })

    const trigger = new ln.NodejsFunction(this, "Trigger", {
      entry: `${__dirname}/functions/trigger.ts`,
      environment: {
        STAGE: props.stage,
        SERVICE: props.serviceName,
        TABLE_NAME: table.tableName
      },
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      logRetention: logs.RetentionDays.THREE_DAYS,
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.minutes(5),
      memorySize: 512,
      events: [
        new levs.DynamoEventSource(table, {
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          retryAttempts: 3
        })
      ]
    })
    table.grantReadWriteData(trigger)

    const api = new apigw.HttpApi(this, "MinesweeperBffApi", {
      corsPreflight: {
        allowHeaders: ["Content-Type", "Authorization", "Content-Length", "X-Requested-With"],
        allowMethods: [apigw.CorsHttpMethod.ANY],
        allowOrigins: ["*"],
        allowCredentials: false
      }
    })
    const apiFunction = new ln.NodejsFunction(this, "ApiFunction", {
      entry: `${__dirname}/functions/api/index.ts`,
      environment: {
        STAGE: props.stage,
        SERVICE: props.serviceName,
        NODE_OPTIONS: "--enable-source-maps",
        TABLE_NAME: table.tableName
      },
      bundling: { minify: true, sourceMap: true },
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      logRetention: logs.RetentionDays.THREE_DAYS,
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(30),
      memorySize: 512
    })
    table.grantReadWriteData(apiFunction)

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url ?? ""
    })

    const apiIntegration = new integrations.HttpLambdaIntegration("ApiIntegration", apiFunction)

    api.addRoutes({
      path: "/{proxy+}",
      methods: [
        apigw.HttpMethod.GET,
        apigw.HttpMethod.PUT,
        apigw.HttpMethod.POST,
        apigw.HttpMethod.PATCH,
        apigw.HttpMethod.DELETE
      ],
      integration: apiIntegration,
      authorizer: undefined
    })
  }
}
