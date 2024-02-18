import middy from '@middy/core';
// import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const handler = middy()
    .use(httpEventNormalizer())
    .use(httpErrorHandler());

export default handler;