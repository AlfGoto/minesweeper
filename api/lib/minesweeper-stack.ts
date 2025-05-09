import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as ln from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';

export class MinesweeperStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Enhanced DynamoDB table with additional indexes for querying
    const gamesTable = new dynamodb.Table(this, 'GamesTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // Add TimeToLive for auto-cleanup of old records (optional)
      timeToLiveAttribute: 'ttl',
    });

    // Global Secondary Index for getting fastest win times (leaderboard)
    gamesTable.addGlobalSecondaryIndex({
      indexName: 'status-time-index',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'time', type: dynamodb.AttributeType.NUMBER },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Lambda function with properly specified entry point
    const gamesHandler = new ln.NodejsFunction(this, 'GamesHandler', {
      entry: path.join(__dirname, '../lambda/api.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: gamesTable.tableName,
        STATUS_TIME_INDEX: 'status-time-index',
      },
      bundling: {
        minify: true,
        sourceMap: false,
        externalModules: [],
        target: 'es2020',
        nodeModules: [
          '@aws-sdk/client-dynamodb',
          '@aws-sdk/lib-dynamodb',
        ],
      },
    });

    // Grant the Lambda function read/write access to the DynamoDB table
    gamesTable.grantReadWriteData(gamesHandler);

    // API Gateway with CORS support
    const api = new apigateway.RestApi(this, 'MinesweeperApi', {
      restApiName: 'Minesweeper Game Service',
      description: 'API for storing and retrieving Minesweeper game results',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Resource for games endpoints
    const games = api.root.addResource('games');
    
    // POST method to save game results
    games.addMethod('POST', new apigateway.LambdaIntegration(gamesHandler));
    
    // GET method to retrieve game results
    games.addMethod('GET', new apigateway.LambdaIntegration(gamesHandler));
    
    // Resource for leaderboard endpoint
    const leaderboard = api.root.addResource('leaderboard');
    leaderboard.addMethod('GET', new apigateway.LambdaIntegration(gamesHandler));
    
    // Resource for user stats endpoint
    const userStats = api.root.addResource('stats');
    const userStatsWithId = userStats.addResource('{userId}');
    userStatsWithId.addMethod('GET', new apigateway.LambdaIntegration(gamesHandler));

    // Output the API endpoints
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: '🚀 API Gateway URL',
    });

    new cdk.CfnOutput(this, 'ApiDocsUrl', {
      value: `${api.url}docs`,
      description: '📝 API Documentation',
    });

    new cdk.CfnOutput(this, 'GamesEndpoint', {
      value: `${api.url}games`,
      description: '🎮 Games Endpoint',
    });
    
    new cdk.CfnOutput(this, 'LeaderboardEndpoint', {
      value: `${api.url}leaderboard`,
      description: '🏆 Leaderboard Endpoint',
    });
  }
} 