import { MongoClient } from 'mongodb'

const options = {}

let client: MongoClient

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable.')
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }

    return global._mongoClientPromise
  }

  client = new MongoClient(uri, options)
  return client.connect()
}

export async function getDatabase() {
  const connectedClient = await getClientPromise()
  return connectedClient.db(process.env.MONGODB_DB || 'barbergo')
}
