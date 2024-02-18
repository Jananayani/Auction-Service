import AWS from 'aws-sdk';
import middy from '@middy/core';
// import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

import { getAuctionById } from './getAuction.js';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event) => {

    console.log('event',event)
    const {id} = event.pathParameters;
    const body = JSON.parse(event.body);
    console.log('body',body);
    
    const { amount } = body;
    const auction = await getAuctionById(id);
    
    if(auction.status !== 'Open'){
        throw new createError.Forbidden(`You cannot bid on closed auctions`);
    }

    if(amount<= auction.highestBid.amount){
        throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id},
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
        ':amount': amount,
        },
        // ConditionExpression: 'attribute_not_exists(highestBid)',
        ReturnValues: 'ALL_NEW'
    };

    let updatedAuction;

    try{
        const result = await dynamoDb.update(params).promise();
        updatedAuction = result.Attributes;

    }catch(error){
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ updatedAuction }),
    };
};

export const handler = middy(placeBid)
//   .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
