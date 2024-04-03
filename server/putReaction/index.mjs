// 6_Notification - putReaction
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({});
const { DYNAMO_TABLE_NAME } = process.env;

export const handler = async function (event) {
  const body = event.body;
  console.log("[From Client]: ", body);

  try {
    const inputData = JSON.parse(body);
    if (!inputData) {
      throw new Error("No content provided");
    }

    const { messageId, timestamp, reaction } = inputData;
    const type = reaction.liked ? "liked" : "disliked";
    const command = new UpdateItemCommand({
      TableName: DYNAMO_TABLE_NAME,
      Key: {
        id: {
          N: String(messageId),
        },
        timestamp: {
          N: String(timestamp),
        },
      },
      UpdateExpression: `SET ${type} = :value`,
      ExpressionAttributeValues: {
        ":value": {
          BOOL: true,
        },
      },
      ReturnValues: "ALL_NEW",
    });

    await client.send(command);
    return done(null, true);
  } catch (err) {
    return done(err);
  }
};

function done(err, res) {
  if (err) {
    console.error(err);
  }
  return {
    statusCode: err ? "400" : "200",
    body: err ? JSON.stringify(err) : JSON.stringify(res),
    headers: {
      "Content-Type": "application/json",
    },
  };
}
