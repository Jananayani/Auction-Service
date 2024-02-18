import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getEndedAuctions = async()=>{
    const now = new Date().toISOString();
    console.log('now date',now)
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endingAt <= :now',
        ExpressionAttributeValues: {
            ':status': 'Open',
            ':now': now,
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        }
    }

    const result = await dynamoDb.query(params).promise();
    return result.Items;
}