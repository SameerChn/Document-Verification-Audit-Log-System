import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI || process.env.AZURE_COSMOS_DB_CONNECTION_STRING

  if (!uri) {
    throw new Error("Please define MONGODB_URI or AZURE_COSMOS_DB_CONNECTION_STRING environment variable")
  }

  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db(process.env.MONGODB_DB_NAME || "document-verification")

  cachedClient = client
  cachedDb = db

  return { client, db }
}
