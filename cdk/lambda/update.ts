import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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
  const body = JSON.parse(event.body || "{}");

  if (!event.pathParameters || !event.pathParameters.id) {
    return lambdaResponse(
      400,
      JSON.stringify({
        message: "Invalid request. 'id' path parameter is required.",
      })
    );
  }

  const id = event.pathParameters.id;

  if (!body || !body.uid || !body.messageJson || !body.sentDate) {
    return lambdaResponse(
      400,
      JSON.stringify({
        message:
          "Invalid request. 'uid', 'messageJson', and 'sentDate' are required.",
      })
    );
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
    UpdateExpression:
      "SET uid = :uid, messageJson = :messageJson, sentDate = :sentDate",
    ExpressionAttributeValues: {
      ":uid": body.uid,
      ":messageJson": body.messageJson,
      ":sentDate": body.sentDate,
    },
  };

  try {
    await dynamoDbDocumentClient.send(new UpdateCommand(params));
    logger.info("Item successfully updated in the DynamoDB table.");
    return lambdaResponse(
      200,
      JSON.stringify({
        message: "Item successfully updated in the DynamoDB table.",
      })
    );
  } catch (error) {
    logger.error("Error updating item in the DynamoDB table:", { error });
    return lambdaResponse(
      500,
      JSON.stringify({
        message: "An error occurred while updating the item in the table.",
      })
    );
  }
}
