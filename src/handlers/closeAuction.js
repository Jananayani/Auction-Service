import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const closeAuction = async(auction) => {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'Closed',
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        }
    };

    const result = await dynamoDb.update(params).promise();
    return result;
}