const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uivsb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true });
client.connect(err => {
  const apartmentCollection = client.db("apartmentHuntDB").collection("apartmentCollection");
  const adminCollection = client.db("apartmentHuntDB").collection("adminCollection");
  const bookingCollection = client.db("apartmentHuntDB").collection("bookingCollection");

  console.log("db connected");

  app.post('/addApartment',(req, res) => {
    const apartment = req.body;
    console.log(apartment);
    apartmentCollection.insertOne(apartment)
    .then(result =>{
     res.send(result.insertedCount)
    })
  })
  //home
  app.get('/apartment',(req, res)=>{
    apartmentCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  //booking list
  app.post('/addBooking',(req, res) => {
    const booking = req.body;
    console.log(booking);
    bookingCollection.insertOne(booking)
    .then(result =>{
     res.send(result.insertedCount)
    })
  })
  //booking list
  app.get('/allBooking',(req, res)=>{
    bookingCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  // my rent 
  app.get('/rentDetails', (req, res) => {
    bookingCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

});


app.get('/', (req, res) => {
  res.send('Hello Apartment Hunt DB!')
})

app.listen(process.env.PORT || port);