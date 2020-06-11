import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.firebase_apiKey,
  authDomain: process.env.firebase_authDomain,
  databaseURL: process.env.firebase_databaseURL,
  projectId: process.env.firebase_projectId,
  storageBucket: process.env.firebase_storageBucket,
  messagingSenderId: process.env.firebase_messagingSenderId,
  appId: process.env.firebase_appId,
  measurementId: process.env.firebase_measurementId,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

class SongbookController {
  async show(req, res, next) {
    let artistsList = [];
    await db
      .collection('artists')
      .get()
      .then(artists => {
        artistsList = artists.docs.map(doc => ({
          name: doc.id,
          songs: doc.data().songs,
        }));
      });

    if (!artistsList.length) {
      return res.status(404).json({ error: 'Cant access Songbook' });
    }
    res.locals.data = artistsList;
    return next();
  }
}

export default new SongbookController();
