import AWS from 'aws-sdk';
import middy from '@middy/core';
// import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getAuctionById = async (id)=>{
    let auction;
    
    try{
        console.log(id);
        const result = await dynamoDb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: {id}
        }).promise();

        auction= result.Item;
    }catch(error){
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    if(!auction){
        throw new createError.NotFound(`Auction with Id "${id}" not found`)
    }

    return auction;

}

const getAuction = async (event) => {

    const {id} = event.pathParameters;
    console.log('id-getAuction',id);
    const auction = await getAuctionById(id);
   
    return {
        statusCode: 200,
        body: JSON.stringify({ auction }),
    };
};

export const handler = middy(getAuction)
//   .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
