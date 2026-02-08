const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://harika-hostel:tallamharika@hostelcluster.omh6car.mongodb.net/?retryWrites=true&w=majority&appName=HostelCluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected. Sending ping...");
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. Successfully connected!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

run();
