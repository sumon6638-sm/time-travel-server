const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

const uri = "mongodb+srv://sumon6638:xvZxPzdSEL3qcZyN@cluster0.yi4wr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect(); // connect this with my db
        // console.log('connected to database');    // check is it properly connected with my db

        // create data base or find out it.. if it not found then it make it self
        const database = client.db('travelPackage')
        const packagesCollection = database.collection('packages');
        const bookedCollection = database.collection('booked');
        const travellersCollection = database.collection('travellers');
        const blogsCollection = database.collection('blogs');

        // GET API -- get all data from my db
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages)
        });

        app.get('/travellers', async (req, res) => {
            const cursor = travellersCollection.find({});
            const travellers = await cursor.toArray();
            res.send(travellers)
        });

        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs)
        });

        // GET Single Package
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific package', id);
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
        })

        // POST API -- add data on my db by using UI
        app.post('/packages', async (req, res) => {
            const package = req.body;
            console.log("hit the post api", package);

            const result = await packagesCollection.insertOne(package);
            console.log(result);

            res.json(result)
        });

        // GET PURCHASE TOUR
        app.get('/booked', async (req, res) => {
            const cursor = bookedCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking)
        });

        // GET MY ORDERS
        app.get("/myOrders/:email", async (req, res) => {
            // console.log(req.params.email);
            const result = await bookedCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        })

        // BOOKED API -- add tour on my db by using UI
        app.post('/booked', async (req, res) => {
            const book = req.body;
            console.log("hit the post api", book);

            const result = await bookedCollection.insertOne(book);
            console.log(result);

            res.json(result)
        });

        // Use POST to get data by id
        app.post('/booked/packageId', async (req, res) => {
            console.log(req.body);
            res.send('hitting post')
        })

        // UPDATE API
        // Update Package
        app.put('/packages/:id', async (req, res) => {
            const id = req.params.id;
            console.log(req);
            const updatedAction = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedAction.name,
                    price: updatedAction.price
                },
            };
            const result = await packagesCollection.updateOne(filter, updateDoc, options)

            // console.log(req);
            res.json(result);
        })

        app.put('/booked/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const updatedAction = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedAction.status
                },
            };
            const result = await bookedCollection.updateOne(filter, updateDoc, options)

            // console.log(req);
            res.json(result);
        })

        // DELETE API
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packagesCollection.deleteOne(query);
            res.json(result);
        })

        app.delete('/booked/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookedCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel server is running');
})

app.listen(port, () => {
    console.log('Server running at port ', port);
})