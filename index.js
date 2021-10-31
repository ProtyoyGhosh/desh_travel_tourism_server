const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000

// middlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mja99.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('desh_travel');

        const packageCollection = database.collection('packages');
        const ordersCollection = database.collection('my_orders');

        // GET product API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        // add order to db
        app.post('/addorder', async (req, res) => {
            console.log(req.body)
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        })

        // get my orders
        app.get('/myorders/:email', async (req, res) => {
            // console.log(req.params.email);

            const result = await ordersCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        // delete order
        app.delete('/deleteproduct/:id', async (req, res) => {
            // console.log(req.params.id);
            const deleteItem = req.params.id;
            const result = await ordersCollection.deleteOne({ _id: deleteItem });
            res.send(result);
        });

        // add package
        app.post('/addpackage', async (req, res) => {
            const result = await packageCollection.insertOne(req.body);
            res.send(result.insertedId)
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('lets travel')
})

app.listen(port, () => {
    console.log('assignment-11 running on port', port)
})