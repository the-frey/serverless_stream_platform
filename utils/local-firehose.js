const run = require('@rabblerouser/local-kinesis-lambda-runner');
const envYaml = require('./env-yaml.js');
// utility pinched and slightly reworked from https://github.com/tarwn/serverless-examples/blob/master/OfflineHttpAndKinesis/utility/runOfflineStreamHandlers.js

// load yaml before aws
envYaml.config('config/env.yml','dev');
const kinesis = require('kinesis-client')

// define some default opts
var defaultLocalOpts = () => {
  return defaultOpts = {
    endpoint: `${process.env.KINESIS_HOST}:${process.env.KINESIS_PORT}`,
    region: process.env.KINESIS_REGION,
    apiVersion: '2013-12-02',
    sslEnabled: false,
    accessKeyId: '-',
    secretAccessKey: '-',
  };
};

// init Kinesis
const kinesisClient = kinesis.createClient(defaultLocalOpts());

const initialize = (kinesis, functions) => {
  functions.forEach((f) => { 
    run(cacheInvalidated(f), { kinesis: kinesis, streamName: f.kinesisStreamName, console: getLog(f.funName) });
  });
}

const getLog = (functionName) => {
  return {
    log: (m) => { 
      console.log(`\n${functionName}: ${m}`)
    },
    error: (e) => { 
      console.error(`\n${functionName}:`, e.message, e.stack)
    }
  };
}

const cacheInvalidated = (functionOptions) => {
  return (kinesisEvent, context, callback) => { 
    const handler = createHandler(functionOptions, {});
    handler(kinesisEvent, context, callback);
  };
}

const createHandler = (functionOptions, options) => {
  const handler = require(functionOptions.handlerPath)[functionOptions.handlerName];

  if (!options.skipCacheInvalidation) {
    for (const key in require.cache) {
      // Require cache invalidation... danger zone!
      if (!key.match('node_modules')) { delete require.cache[key]; }
    }
  }

  if (typeof handler !== 'function') {
    throw new Error(`Serverless_offline: handler '${functionOptions.funName}' is not a function`);
  }

  return handler;
}

const functions = [
  { funName: 'Sink', handlerPath: '../consumers/consumers.js', handlerName: 'sink', kinesisStreamName: 'events' }
];

initialize(kinesisClient, functions);
