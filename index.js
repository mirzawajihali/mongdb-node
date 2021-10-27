const { MongoClient } = require('mongodb');

var express = require('express')
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId
var app = express();
const port = 5000;

// user = mydbuser1
// password = M5Q9vZLexjdLLMnl

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://mydbuser1:M5Q9vZLexjdLLMnl@cluster0.sk4ge.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// OLD SYSTEM 

// client.connect(err => {
//     const collection = client.db("gym").collection("users");
//     // perform actions on the collection object
//     console.log("hitting the data base")
//     console.error(err)
//     const user = { name: "wajih", gmail: "wajih@gmail.com" }
//     collection.insertOne(user)
//         .then(() => console.log("inserted"))
//     // client.close();
// });



async function run() {
    try {
        await client.connect();
        const database = client.db("gym");
        const usersCollection = database.collection("users");


        // create a document to insert
        // const doc = {
        //     name: "Mirza Aliya poi poi",
        //     email: "aliyaPOi8@gmail.com",
        // }
        //
        // console.log(`A document was inserted with the _id: ${result.insertedId}`);


        // GET API 
        app.get("/users", async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })
        app.get("/users/:id", async (req, res) => {
            const id = req.params.id
            console.log("gogo", id)
            const query = { _id: ObjectId(id) }
            const user = await usersCollection.findOne(query)
            res.json(user)
        })

        // POST API 
        app.post("/users", async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log(req.body);
            console.log("added user", result)
            res.json(result)
        });

        // PUT/UPDATE API 
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };

            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log("updating", id);
            res.json(result)
        })

        // DELETE API 

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query)
            console.log("deleting id", result);
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("running my crud server")
})

app.listen(port, () => {
    console.log("running server on port", port)
}

)