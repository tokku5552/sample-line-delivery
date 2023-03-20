import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

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
