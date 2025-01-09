const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-admin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(bodyParser.json());
app.use(cors());

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach user information to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

app.get('/api/test', (req,res) =>{
  console.log("test");
  res.json({"response":"Hello World!"});
  res.status(200);
});

app.post('/api/create', verifyFirebaseToken, async (req,res) => {
    const docref = db.collection("users").doc(req.user.uid);
    const doc = await docref.get();
    console.log(req.body.role);
    if(!doc.exists){
      const userData = {
        "email": req.user.email ? req.user.email : "undefined_email",
        "role": req.body.role,
        "history": []
      }

      docref.set(userData);
      res.json({"Status:": "Created"});
      res.status(200);
    }
    else{
      res.json({"Status:":"Already exists"});
    }

});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
