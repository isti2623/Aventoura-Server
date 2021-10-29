const express = require('express');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


//MongoDb Part

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sovrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("TourList");
        const tourCollection = database.collection("tour");
        const orderCollection = database.collection("orders");
        //GET API
        app.get('/services', async (req, res) => {
            const cursor = tourCollection.find({});
            const events = await cursor.toArray();
            console.log(events);
            res.send(events);
        })
        //GET all Orders API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const events = await cursor.toArray();
            console.log(events);
            res.send(events);
        })

        // delete my Order

        app.delete("/allOrders/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });
        // delete manage all Order

        app.delete("/orders/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });
        // my orders

        app.get("/myOrders/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        //add product
        app.post("/addServices", (req, res) => {
            console.log(req.body);
            tourCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        //add Order
        app.post("/orders", (req, res) => {
            console.log(req.body);
            orderCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });


        //Update get
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await orderCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        })

        //update product
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const updatedName = req.body;
            console.log(updatedName);
            const filter = { _id: ObjectId(id) };

            orderCollection
                .updateOne(filter, {
                    $set: {
                        phone: updatedName.phone,
                        address: updatedName.address,
                    },
                })
                .then((result) => {
                    res.send(result);
                });
        });





    } finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})