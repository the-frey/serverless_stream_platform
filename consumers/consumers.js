'use strict';

module.exports.sink = (event, context, callback) => {

  console.log(event.body);

  event.Records.map((record) => {
    const payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
    console.log("Received an event: " + payload);
    });

  callback(null, `Successfully processed ${event.Records.length} events.`);

};
