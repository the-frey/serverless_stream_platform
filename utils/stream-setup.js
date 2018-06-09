'use strict';
const envYaml = require('./env-yaml.js');
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

// you are now about to witness the strength of api knowledge
// straight outta documentation
// crazy motherf***er named the-frey

const kinesisClient = kinesis.createClient(defaultOpts());
var streamOpts = { ShardCount: 1, StreamName: 'events' }

kinesis.createStream(kinesisClient, streamOpts).on('complete', (response) => {
  console.log("Bootstrapper: stream created");
});
