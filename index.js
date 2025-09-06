const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2i3rf8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.2i3rf8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const coffeesCollections = client.db('coffeeDB').collection('coffees');
    const usersCollections =  client.db('coffeeDB').collection('users')
  
    app.get('/coffees', async(req,res) =>{
      // const cursor = coffeesCollections.find();
      // const result = await cursor.toArray()
      const result = await coffeesCollections.find().toArray();
      res.send(result)
    })
    app.get('/coffees/:id',async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeesCollections.findOne(query)
      res.send(result)
    })

    app.post('/coffees', async(req, res) =>{
      const newCoffeeData = req.body;
      console.log(newCoffeeData)
      const result = await coffeesCollections.insertOne(newCoffeeData)
      res.send(result)
    })
    app.put('/coffees/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const updatedDocs = {
        $set: updatedCoffee
      }
      const result = await coffeesCollections.updateOne(filter,updatedDocs,options)
      res.send(result)
    })
    app.delete('/coffees/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeesCollections.deleteOne(query)
      res.send(result)
    })
    //User Api 
    app.get('/users', async(req, res) =>{
      const result = await usersCollections.find().toArray();
      res.send(result)
    })

    app.post('/users', async(req, res) =>{
      const usersProfile = req.body;
      console.log(usersProfile);
      const result =  await usersCollections.insertOne(usersProfile)
      res.send(result)
    })
    app.patch('/users', async(req, res) =>{
      const {email,lastSignInTime} = req.body;
      const filter = {email: email};
      const UpdateDoc ={
        $set:{
          lastSignInTime:lastSignInTime
        }
      }
      const result = await usersCollections.updateOne(filter,UpdateDoc)

    })
    app.delete('/users/:id',async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersCollections.deleteOne(query)
      res.send(result)
      
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


app.get('/', (req, res)=>{
    res.send('Coffee server is getting hotter r');

})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})