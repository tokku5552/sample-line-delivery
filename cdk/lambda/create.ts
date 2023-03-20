import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import * as UUID from "uuid";

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
    return {
      statusCode: 400,
      body: JSON.stringify({
        message:
          "Invalid request. 'uid', 'messageJson', and 'sentDate' are required.",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
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
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item successfully added to the DynamoDB table.",
      }),
    };
  } catch (error) {
    logger.error("Error adding item to the DynamoDB table:", { error });
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while adding the item to the table.",
      }),
    };
  }
}
