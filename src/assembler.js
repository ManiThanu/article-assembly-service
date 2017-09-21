/* eslint-disable key-spacing, consistent-return */

import messaging    from 'msyn-messaging';
import Wardenclyffe from './wardenclyffe';

/**
 * Asset Assembler
 */

// Alias Senders/Receivers
const Connection = messaging.connections.Default;
const Receiver   = messaging.receivers.Default;
const Sender     = messaging.senders.Default;

// Alias Wardenclyffe Helpers
const { fetchAsset } = Wardenclyffe;

async function run() {
  try {
    const connection = new Connection();

    // Publishes Assembled Assets to Asset Service
    const sender = new Sender({
      connection,
      destination: process.env.ASSET_SAVE_DESTINATION,
    });
    await sender.connect();

    // Assembles Newly Ingested Assets
    const receiver = new Receiver({
      connection,
      // TODO: abstract out header name inside msyn-messaging
      headers: { 'activemq.prefetchSize': JSON.parse(process.env.ASSET_ASSEMBLE_MAX_FETCH || 100) },
      destination: process.env.ASSET_ASSEMBLE_DESTINATION,
      acknowledge: JSON.parse(process.env.ASSET_ASSEMBLE_ACK || true),
      processor: async (message) => {
        // Parse
        const { headers, payload: { id, type, originalPayload } } = message;

        // Log
        console.log(`Assembling Asset: {type: ${type}, id: ${id}}...`);

        // Process
        const asset = await fetchAsset(type, id, originalPayload);

        // Send To Asset Service
        return await sender.send(asset, {
          correlation_id: headers.correlation_id,
          asset_type: type,
        });
      },
    });
    await receiver.connect();
    await receiver.receive();
  } catch (e) {
    console.log('Uncaught Error:', e.message);
  }
}

run();
