const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const mongoUri = process.env.MONGO_URL || "mongodb://mongouser:password@mongodb:27017";
let db;

MongoClient.connect(mongoUri)
  .then(client => {
    db = client.db("microserviceDB");
    console.log("✅ Connected to MongoDB");
  })
  .catch(err => console.error("❌ MongoDB Connection Failed:", err));

// Create
app.post('/data', async (req, res) => {
  const result = await db.collection("items").insertOne(req.body);
  res.send(result);
});

// Read
app.get('/data', async (req, res) => {
  const items = await db.collection("items").find().toArray();
  res.send(items);
});

// Update
app.put('/data/:id', async (req, res) => {
  const result = await db.collection("items").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
});

// Delete
app.delete('/data/:id', async (req, res) => {
  const result = await db.collection("items").deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

app.listen(port, () => {
  console.log(`🚀 App running on port ${port}`);
});
