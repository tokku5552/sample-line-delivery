import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
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
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const result = await dynamoDbDocumentClient.send(new ScanCommand(params));
    logger.info("Items successfully retrieved from the DynamoDB table.");
    return lambdaResponse(
      200,
      JSON.stringify({
        message: "Items successfully retrieved from the DynamoDB table.",
        items: result.Items,
      })
    );
  } catch (error) {
    logger.error("Error retrieving items from the DynamoDB table:", { error });
    return lambdaResponse(
      500,
      JSON.stringify({
        message: "An error occurred while retrieving the items from the table.",
      })
    );
  }
}
