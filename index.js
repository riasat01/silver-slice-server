const express = require("express");
const cors = require("cors");
require('dotenv').config();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    //  client.connect();
    // await client.connect();

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
      // console.log(name);
      const brands = database.collection('headerInfo');
      const query = { name: name };
      const result = await brands.findOne(query);
      // console.log(result);
      res.send(result);

    })

    app.get('/products/:name', async (req, res) => {
      const name = req.params.name
      // console.log(name);
      const products = database.collection('products');
      const query = { brand: name };
      const cursor = products.find(query);
      const result = await cursor.toArray();
      // console.log(result);
      res.send(result);

    })

    app.post('/products/:name', async (req, res) => {
      const product = req.body
      // console.log(product);
      const products = database.collection('products');
      const result = await products.insertOne(product);
      // console.log(result);
      res.send(result);

    })

    app.get('/product-details/:id', async (req, res) => {
      const product = req.params.id
      // console.log(product);
      const productDetails = database.collection('products');
      const query = { _id: new ObjectId(product) }
      const result = await productDetails.findOne(query);
      // console.log(result);
      res.send(result);

    })

    app.put('/product-details/:id', async (req, res) => {
      const id = req.params.id
      const product = req.body;
      // console.log(product);
      const productDetails = database.collection('products');
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: false };
      const updatedProduct = {
        $set: {
          photo: product.photo,
          name: product.name,
          brand: product.brand,
          type: product.type,
          price: product.price,
          rating: product.rating,
          description: product.description
        }
      }
      const result = await productDetails.updateOne(filter, updatedProduct, options);
      // console.log(result);
      res.send(result);

    })

    app.get('/cart/:email', async (req, res) => {
      const email = req.params.email
      // console.log(name);
      const cart = database.collection('cart');
      const query = { email: email };
      const cursor = cart.find(query);
      const result = await cursor.toArray();
      // console.log(result);
      res.send(result);

    })

    app.post('/cart/:email', async (req, res) => {
      const email = req.params.email;
      const product = req.body;
      // console.log(product);
      const cart = database.collection('cart');
      const result = await cart.insertOne(product);
      // console.log(result);
      res.send(result);

    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const cart = database.collection('cart');
      const query = {_id: id}
      const result = await cart.deleteOne(query);
      // console.log(result);
      res.send(result);

    })

    app.get('/reviews', async (req, res) => {
      const reviews = database.collection('reviews');
      const result = await reviews.findOne();
      // const results = await cursor.toArray();
      console.log(result);
      res.send(result);

    })


    // Send a ping to confirm a successful connection
    //  client.db("admin").command({ ping: 1 });
    // await client.db("admin").command({ ping: 1 });
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