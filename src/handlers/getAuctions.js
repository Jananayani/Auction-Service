import AWS from 'aws-sdk';
import middy from '@middy/core';
// import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import createError from 'http-errors';
import './getAuctionsSchema.js';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event) => {
    console.log('event',event);
    const { status } = event.queryStringParameters;
    let auctions;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
            ':status': status
        },
        ExpressionAttributeNames: { 
            '#status': 'status' 
        } 
    }

    try{
        const result = await dynamoDb.query(params).promise();
        auctions = result.Items;
    }catch(error){
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ auctions }),
    };
};

export const handler = middy(getAuctions)
//   .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
