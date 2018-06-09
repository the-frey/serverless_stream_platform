# Serverless Stream Platform

An example with project structure for building out a stream platform using the Serverless framework.

## Getting started

    npm install -g kinesalite
    npm install
    npm run offline

The service should be accessible at `localhost:3000` in your browser.

If you change handlers, they will be hot reloaded. However, if you change any of the configuration `.yml` files, you will need to kill and restart `sls offline`.

To test an endpoint that supports POST requests, you can use cURL:

```
curl -v -X POST \
     -H "Content-Type: application/json" \
     localhost:3000 \
     --data '{"foo": "bar"}'
```

## Project structure

Producer lambdas are in `producer-functions.yml`.

Consumer lambdas are in `consumer-functions.yml`.

### Configuration variables

In `./config/env.yml` you can place configuration that is picked up elsewhere. 

This works in the following way - if you

    sls offline start --stage dev

Then everything under the `dev` key in the env file will be loaded in `serverless.yml`.

It's worth noting that 

    sls offline start

Works because `dev` is set as the default stage by the line `stage: ${opt:stage, 'dev'} # default to dev` in `serverless.yml`.

## Kinesis

For more information on what's going on in terms of Kinesis config, [the docs are here](https://serverless.com/framework/docs/providers/aws/events/streams/).
