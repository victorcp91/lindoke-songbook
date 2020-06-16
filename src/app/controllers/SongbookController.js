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

  async store(req, res) {
    const { id } = req.params;
    const { songs } = req.body;

    if (songs && songs.length) {
      const artistRef = await db.collection('artists').doc(id);

      const artist = await artistRef.get();
      if (artist.data().songs.length < songs.length) {
        await artistRef.update({
          songs,
        });
        return res.status(200).json(songs);
      }

      return res.status(200).json(songs);
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
      const { songs } = artistSongs.data();
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
}

export default new SongbookController();
