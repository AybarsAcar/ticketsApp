import nats, { Stan } from 'node-nats-streaming';

/* 
Singleton class
we can connect in index.ts and access anywhere from our application
*/
class NatsWrapper {
  // create a client -- which is sometimes undefined
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS Client before connecting');
    }
    return this._client;
  }

  // to create an actual instance of nats client
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
