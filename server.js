const express = require('express');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://geraimahasiswa-8d67b.appspot.com'
});

const bucket = admin.storage().bucket();

// Create a new file
app.post('/photos/:folderName', upload.single('photo'), (req, res) => {
  const folderName = req.params.folderName;
  const file = req.file;
  const fileName = `${folderName}/${file.originalname}`;

  bucket.upload(file.path, {
    destination: fileName,
    metadata: {
      contentType: 'image/jpeg',
      metadata: {
        originalName: file.originalname,
        size: file.size
      }
    }
  })
    .then(() => {
      console.log('Photo uploaded successfully.');
      res.send('Photo uploaded successfully.');
    })
    .catch((error) => {
      console.error('Error uploading photo:', error);
      res.status(500).send('Error uploading photo.');
    });
});

// Read a photo
app.get('/photos/:folderName/:photoName', async (req, res) => {
  const folderName = req.params.folderName;
  const photoName = `${folderName}/${req.params.photoName}`;

  const file = bucket.file(photoName);
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-17-2023'
  });

  res.send({ url });
});

// Update a photo
app.put('/photos/:folderName/:photoName', upload.single('photo'), (req, res) => {
  const folderName = req.params.folderName;
  const photoName = `${folderName}/${req.params.photoName}`;
  const file = req.file;

  bucket.upload(file.path, {
    destination: photoName,
    metadata: {
      contentType: 'image/jpeg',
      metadata: {
        originalName: file.originalname,
        size: file.size
      }
    }
  })
    .then(() => {
      console.log('Photo updated successfully.');
      res.send('Photo updated successfully.');
    })
    .catch((error) => {
      console.error('Error updating photo:', error);
      res.status(500).send('Error updating photo.');
    });
});

// Delete a photo
app.delete('/photos/:folderName/:photoName', (req, res) => {
  const folderName = req.params.folderName;
  const photoName = `${folderName}/${req.params.photoName}`;

  bucket.file(photoName).delete()
    .then(() => {
      console.log('Photo deleted successfully.');
      res.send('Photo deleted successfully.');
    })
    .catch((error) => {
      console.error('Error deleting photo:', error);
      res.status(500).send('Error deleting photo.');
    });
});

app.listen(3000, () => {
  console.log('Server started on port 3000.');
});
