"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _app = require('firebase/app'); var _app2 = _interopRequireDefault(_app);
require('firebase/firestore');
require('firebase/auth');

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

_app2.default.initializeApp(firebaseConfig);

const db = _app2.default.firestore();

_app2.default
  .auth()
  .signInWithEmailAndPassword(
    process.env.firebase_admin_email,
    process.env.firebase_admin_password
  )
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    // ...
  });

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

  async store(req, res) {
    const { id } = req.params;
    const { songs } = req.body;

    if (songs && songs.length) {
      const artistRef = await db.collection('artists').doc(id);

      const artists = await artistRef.get();
      if (!artists.exists) {
        await db
          .collection('artists')
          .doc(id)
          .set({
            songs,
          });
        return res.status(200).json({ artist: id, songs });
      }
      const updatedSongs = [...artists.data().songs];
      songs.forEach(newSong => {
        if (!updatedSongs.find(song => song.id === newSong.id)) {
          updatedSongs.push(newSong);
        }
      });
      await db
        .collection('artists')
        .doc(id)
        .set({
          songs: updatedSongs,
        });
      return res.status(200).json({ artist: id, songs: updatedSongs });
    }
    return res.status(400);
  }

  async update(req, res) {
    const { id } = req.params;
    const { oldSongTitle, newSongTitle, videoId, lyrics } = req.body;

    if ((oldSongTitle, newSongTitle, id, lyrics)) {
      const artistSongs = await db
        .collection('artists')
        .doc(id)
        .get();
      const { songs } = await artistSongs.data();
      if (songs.find(song => song.title === oldSongTitle && !song.lyrics)) {
        let updatedSongs = songs.filter(song => song.title !== oldSongTitle);
        const newSong = {
          title: newSongTitle,
          id: videoId,
          lyrics,
        };
        updatedSongs = [newSong, ...updatedSongs];
        await db
          .collection('artists')
          .doc(id)
          .update({
            songs: updatedSongs,
          });
        return res.status(200).json(newSong);
      }
      return res.status(200);
    }
    return res.json(400);
  }

  async delete(req, res) {
    const { id } = req.params;
    const { videoId } = req.body;

    if (videoId) {
      const artistSongs = await db
        .collection('artists')
        .doc(id)
        .get();
      const { songs } = artistSongs.data();
      if (songs.find(song => song.id === videoId)) {
        const updatedSongs = songs.filter(song => song.id !== videoId);
        await db
          .collection('artists')
          .doc(id)
          .update({
            songs: updatedSongs,
          });
        return res.status(200).json(updatedSongs);
      }
      return res.status(200);
    }
    return res.json(400);
  }
}

exports. default = new SongbookController();
