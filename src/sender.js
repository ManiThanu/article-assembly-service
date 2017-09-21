import minimist  from 'minimist';
import messaging from 'msyn-messaging';
import './env.loader';

const Connection = messaging.connections.Default;
const Sender     = messaging.senders.Default;

async function main() {
  try {
    const args        = minimist(process.argv.slice(2));
    const message     = args.m;
    const destination = args.d;

    if (!message || !destination) {
      throw new Error('Invalid message or destination.');
    }

    const connection = new Connection();
    const sender     = new Sender({ destination, connection });

    await sender.connect();
    await sender.send(message);
    await sender.channel.close();

    console.log(`Sent ${message} to ${destination}.`);
  } catch (e) {
    console.log(e);
  }
}

main();

// Example Usage:
// $ NODE_ENV=development babel-node ./src/utilities/sender.js --m 'foobar' --d '/queue/test'
