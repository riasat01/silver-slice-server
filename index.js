const express = require("express");
const cors = require("cors");
require('dotenv').config();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1xv3maf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db('SilverSlice');
    
    app.get('/brands', async (req, res) => {
        const banner = database.collection('headerInfo');
        const cursor = banner.find();
        const results = await cursor.toArray();
        const result = results.filter(item => item.name !== 'banner');
        // console.log(result);
        res.send(result);

    })

    app.get('/brands/:name', async (req, res) => {
        const name = req.params.name
        console.log(name);
        const banner = database.collection('headerInfo');
        const query = {name : name};
        const result = await banner.findOne(query);
        // console.log(result);
        res.send(result);

    })

    app.get('/products/:name', async (req, res) => {
        const name = req.params.name
        console.log(name);
        const banner = database.collection('products');
        const query = {brand : name};
        const cursor = banner.find(query);
        const result = await cursor.toArray();
        console.log(result);
        res.send(result);

    })

    app.post('/products/:name', async (req, res) => {
        const product = req.body
        console.log(product);
        const banner = database.collection('products');
        const result = await banner.insertOne(product);
        // console.log(result);
        res.send(result);

    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is rinnung');
})

app.listen(port, () => {
    console.log('Server created successfuly');
})