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
        //GET API
        app.get('/services', async (req, res) => {
            const cursor = tourCollection.find({});
            const events = await cursor.toArray();
            console.log(events);
            res.send(events);
        })

        //add product
        app.post("/addServices", (req, res) => {
            console.log(req.body);
            tourCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        // get single prodcut

        app.get("/services/:id", (req, res) => {
            console.log(req.params.id);
            tourCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray((err, results) => {
                    res.send(results[0]);
                });
        });

        // get all order by email query
        app.get("/addServices/:email", (req, res) => {
            console.log(req.params);
            eventCollection
                .find({ email: req.params.email })
                .toArray((err, results) => {
                    res.send(results);
                });
        });

        //DELETE API
        app.delete('/allEvents/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await eventCollection.deleteOne(query);
            res.json(result);
        })

        //Update get
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await eventCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        })

        //update product
        app.put("/users/:id", async (req, res) => {
            const id = req.params.id;
            const updatedName = req.body;
            console.log(updatedName);
            const filter = { _id: ObjectId(id) };

            eventCollection
                .updateOne(filter, {
                    $set: {
                        title: updatedName.title,
                        image: updatedName.image,
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