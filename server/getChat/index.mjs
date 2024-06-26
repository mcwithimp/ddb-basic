import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({});
const { DYNAMO_TABLE_NAME } = process.env;
console.log({ DYNAMO_TABLE_NAME });

export const handler = async function (event) {
  try {
    const command = new ScanCommand({
      TableName: DYNAMO_TABLE_NAME,
      Select: "ALL_ATTRIBUTES",
    });
    const result = await client.send(command);
    console.log("[DynamoDB Scan Result]: result");
    const items =
      result.Items?.map((item) => {
        return {
          id: Number(item.id.N),
          sender: item.sender.S,
          text: item.text.S,
          timestamp: Number(item.timestamp.N),
          liked: item.liked?.BOOL,
          disliked: item.disliked?.BOOL,
        };
      }) || [];
    return done(null, items);
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
