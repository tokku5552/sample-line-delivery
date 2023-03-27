import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Client } from "@line/bot-sdk";
import { Context, EventBridgeEvent, ScheduledEvent } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME || "";
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN || "";
const CHANNEL_SECRET = process.env.CHANNEL_SECRET || "";

const dynamoDbDocumentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({})
);

const logger = new Logger();

const lineClient = new Client({
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET,
});

const updateItemIsSent = async (id: string) => {
  const updateParams = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
    UpdateExpression: "SET isSent = :isSent",
    ExpressionAttributeValues: {
      ":isSent": true,
    },
  };

  try {
    await dynamoDbDocumentClient.send(new UpdateCommand(updateParams));
    logger.info("Item isSent updated to true", { id });
  } catch (error) {
    logger.error("Error updating isSent in the DynamoDB table:", { error });
  }
};

export async function handler(
  event: EventBridgeEvent<"ScheduledEvent", ScheduledEvent>,
  context: Context
): Promise<void> {
  logger.info("EventBridge event received", { event, context });
  const today = new Date();
  const todayISOString = today.toISOString();

  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "isSent = :isSent AND sentDate <= :today",
    ExpressionAttributeValues: {
      ":isSent": false,
      ":today": todayISOString,
    },
  };

  logger.info("Showing params", { params });

  try {
    const result = await dynamoDbDocumentClient.send(new ScanCommand(params));
    logger.info("Items successfully retrieved from the DynamoDB table.", {
      result,
    });

    if (result.Items) {
      await Promise.all(
        result.Items.map(async (item) => {
          const { id, uid, messageJson } = item;
          const message = JSON.parse(messageJson);
          logger.info("Sending push message", { id, uid, message });
          try {
            await lineClient.pushMessage(uid, message);
            await updateItemIsSent(id);
          } catch (error) {
            logger.error("Error sending push message or updating isSent", {
              error,
            });
          }
        })
      );
    } else {
      logger.warn("No items found in the DynamoDB table.");
    }
  } catch (error) {
    logger.error("Error retrieving items from the DynamoDB table:", { error });
  }
}
