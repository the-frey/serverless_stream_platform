'use strict';
const envYaml = require('../utils/env-yaml.js');
envYaml.config('config/env.yml','dev');
const kinesis = require('kinesis-client')

var defaultOpts = () => {
  return defaultOpts = {
    endpoint: `${process.env.KINESIS_HOST}:${process.env.KINESIS_PORT}`,
    region: process.env.KINESIS_REGION,
    apiVersion: '2013-12-02',
    sslEnabled: false,
    accessKeyId: '-',
    secretAccessKey: '-',
  };
};

module.exports.source = (event, context, callback) => {
  const kinesisClient = kinesis.createClient(defaultOpts());
  var streamName = 'events';

  var callbackFn = (err, data) => { 
    if (err) {
      callback(err, {statusCode: 500, body: "Error writing to stream"});
    }
    else { 
      callback(null, {statusCode: 202, body: "ok" });
    }
  }

  console.log(event.body);

    kinesisClient.putRecord(
                    {
                     Data: JSON.stringify(event.body),
                     PartitionKey: '0', // change this!
                     StreamName: streamName
                    },
                    callbackFn);

};
