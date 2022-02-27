import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AWS_REGION } from "../config.js";

const ddbClient = new DynamoDBClient({ region: AWS_REGION });
export { ddbClient };


