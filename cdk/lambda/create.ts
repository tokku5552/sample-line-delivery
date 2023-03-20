import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME || "";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // Lambda function logic

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello, World!",
    }),
  };
}
