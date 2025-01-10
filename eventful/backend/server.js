const express = require('express');
const bodyParser = require('body-parser');
const app = express();
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

app.get('/api/test', (req, res) => {
  console.log("test");
  res.json({ "response": "Hello World!" });
  res.status(200);
});

// Endpoint to create a user or update their role if they don't exist
app.post('/api/create', verifyFirebaseToken, async (req, res) => {
  const userDocRef = db.collection("users").doc(req.user.uid);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    const userData = {
      "email": req.user.email || "undefined_email",
      "role": req.body.role || "submitter",
      "history": []
    };

    await userDocRef.set(userData);
    res.json({ "Status": "User created" });
  } else {
    res.json({ "Status": "User already exists" });
  }
});

// Endpoint to create an event
app.post('/api/events', verifyFirebaseToken, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    const eventData = {
      title,
      description,
      userId: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('events').add(eventData);
    res.status(201).json({ message: 'Event created successfully!' });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch user-specific events
app.get('/api/events', verifyFirebaseToken, async (req, res) => {
  try {
    const userEventsRef = db.collection('events').where('userId', '==', req.user.uid).orderBy('createdAt', 'desc');
    const snapshot = await userEventsRef.get();

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
