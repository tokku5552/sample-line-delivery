import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
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
    const result = await dynamoDbDocumentClient.send(new GetCommand(params));
    if (result.Item) {
      logger.info("Item successfully retrieved from the DynamoDB table.");
      return lambdaResponse(
        200,
        JSON.stringify({
          message: "Item successfully retrieved from the DynamoDB table.",
          item: result.Item,
        })
      );
    } else {
      logger.warn("Item not found in the DynamoDB table.");
      return lambdaResponse(
        404,
        JSON.stringify({
          message: "Item not found in the DynamoDB table.",
        })
      );
    }
  } catch (error) {
    logger.error("Error retrieving item from the DynamoDB table:", { error });
    return lambdaResponse(
      500,
      JSON.stringify({
        message: "An error occurred while retrieving the item from the table.",
      })
    );
  }
}
