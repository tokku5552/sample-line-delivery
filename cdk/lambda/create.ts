import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import * as UUID from "uuid";
import { lambdaResponse } from "./utils";

const TABLE_NAME = process.env.TABLE_NAME || "";

const dynamoDbClient = new DynamoDBClient({});
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

const logger = new Logger();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || "{}");

  if (!body || !body.uid || !body.messageJson || !body.sentDate) {
    return lambdaResponse(
      400,
      JSON.stringify({
        message:
          "Invalid request. 'uid', 'messageJson', and 'sentDate' are required.",
      })
    );
  }

  const isSent = false;
  const id = UUID.v4();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id,
      uid: body.uid,
      messageJson: body.messageJson,
      sentDate: body.sentDate,
      isSent,
    },
  };

  try {
    await dynamoDbDocumentClient.send(new PutCommand(params));
    logger.info("Item successfully added to the DynamoDB table.");
    return lambdaResponse(
      200,
      JSON.stringify({
        message: "Item successfully added to the DynamoDB table.",
      })
    );
  } catch (error) {
    logger.error("Error adding item to the DynamoDB table:", { error });
    return lambdaResponse(
      500,
      JSON.stringify({
        message: "An error occurred while adding the item to the table.",
      })
    );
  }
}
