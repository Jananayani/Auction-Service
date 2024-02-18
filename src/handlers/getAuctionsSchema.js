import AWS from 'aws-sdk';
import middy from '@middy/core';
// import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const schema = {
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['Open', 'Closed'],
                    default: 'Open'
                }
            }
        },
    },
    required:[
        'queryStringParameters'
    ]
}

export const handler = middy(schema)
//   .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());