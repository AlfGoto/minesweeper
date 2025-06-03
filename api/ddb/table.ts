import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Table as ddbTable } from "dynamodb-toolbox";

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient());

export const Table = new ddbTable({
  name: process.env.TABLE_NAME,
  partitionKey: { name: "userId", type: "string" },
  sortKey: { name: "timestamp", type: "string" },
  documentClient,
  indexes: {
    "status-time-index": {
      type: "global",
      partitionKey: { name: "status", type: "string" },
      sortKey: { name: "time", type: "number" },
    },
  },
});
