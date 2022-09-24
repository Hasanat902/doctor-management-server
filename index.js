const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbbmihn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('doctor_management').collection('services');
        const bookingCollection = client.db('doctor_management').collection('bookings');

        app.get('/service', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/booking', async(req, res) => {
            const booking = req.body;
            const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient};
            const exists = await bookingCollection.findOne(query);
            if(exists){
              return res.send({success: false, booking: exists});
            }
            const result = await bookingCollection.insertOne(booking);
            res.send({success: true, result});
        })
       
    }
    finally{

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello from doctor management server!');
})

app.listen(port, () => {
  console.log(`Doctor management server listening on port ${port}`);
})