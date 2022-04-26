import { createAttrs, putItem, Attributes, getItems } from "./common"
import { IdGroup, TransactAttrs, TransactParamGroup } from "../types/types";

export const getTransactions = async (transactionParams: TransactParamGroup) => {
  const transactionIdGroup = new IdGroup("transactionId", transactionParams);
  return getItems(transactionIdGroup, "all");
  
  // const partitionKey = reduceIds({
  //   userId: transInfo.userId,
  //   budgetId: transInfo.budgetId,
  // });
  // const sortKey = reduceIds(transInfo);
  // const params = {
  //   TableName: constants.tableName,
  //   ExpressionAttributeValues: {
  //     ":pk": partitionKey,
  //     ":sk": sortKey,
  //   },
  //   ExpressionAttributeNames: {
  //     "#value": "value",
  //   },
  //   KeyConditionExpression: "PK = :pk AND begins_with ( SK, :sk )",
  //   ProjectionExpression: "SK, trans_date, #value, is_outflow",
  // };

  // try {
  //   const data = await database.send(new QueryCommand(params));
  //   console.log("Fetch success!");
  //   if (data.Count === 0) {
  //     return "No results for transactionid=" + transInfo.transactionId;
  //   }
  //   return data.Items;
  // } catch (err) {
  //   console.log("Error fetching: " + err);
  //   return "Error fetching: " + err;
  // }
};

export const putTransaction = async (transaction: TransactParamGroup, body: any) => {
  const attrs: TransactAttrs = createAttrs(body, Attributes.transactionAttrs);
  return putItem<TransactAttrs>(new IdGroup("transactionId", transaction), attrs);
}
