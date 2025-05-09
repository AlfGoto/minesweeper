import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Request body is required' }),
      };
    }

    const { userId, status, successTime } = JSON.parse(event.body);

    if (!userId || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'userId and status are required' }),
      };
    }

    const timestamp = new Date().toISOString();
    const item = {
      userId,
      timestamp,
      status,
      ...(successTime && { successTime }),
    };

    await dynamoDB
      .put({
        TableName: TABLE_NAME,
        Item: item,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Game result stored successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}; 