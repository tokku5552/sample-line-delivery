import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { lambdaResponse } from "./utils";

const TABLE_NAME = process.env.TABLE_NAME || "";

const dynamoDbDocumentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({})
);

const logger = new Logger();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  if (!event.pathParameters || !event.pathParameters.id) {
    return lambdaResponse(
      400,
      JSON.stringify({
        message: "Invalid request. 'id' path parameter is required.",
      })
    );
  }

  const id = event.pathParameters.id;

  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };

  try {
    await dynamoDbDocumentClient.send(new DeleteCommand(params));
    logger.info("Item successfully deleted from the DynamoDB table.");
    return lambdaResponse(
      200,
      JSON.stringify({
        message: "Item successfully deleted from the DynamoDB table.",
      })
    );
  } catch (error) {
    logger.error("Error deleting item from the DynamoDB table:", { error });
    return lambdaResponse(
      500,
      JSON.stringify({
        message: "An error occurred while deleting the item from the table.",
      })
    );
  }
}
