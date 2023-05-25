const admin = require('firebase-admin')
const { Timestamp, FieldValue } = require('firebase-admin/firestore')
const { getStorage } = require("firebase/storage")
const adsModel = require("../models/adsModel")
const credentials = require("../../key.json")
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const upload = multer({ dest: 'uploads/adsPhotos' });

try {
    admin.initializeApp({
        credential: admin.credential.cert(credentials),
        storageBucket: 'gs://geraimahasiswa-8d67b.appspot.com'
    })
} catch (e) {
    admin.app()
}

const db = admin.firestore()
const bucket = admin.storage().bucket();

const storage = multer.memoryStorage()

function getDayPlusOne(){
    let today = new Date();
    let dd = String(today.getDate() + 1).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;

    return today
}

const readAllAd = async (req, res) => {
    try {
        const adsRef = db.collection("ads")
        const response = await adsRef.get()
        let adsList = [];
        if(response.empty){
            res.status(400).send("No Data Available")
        } else {
            response.forEach(async (doc) => {
                let adsPhotoName = `adsPhotos/adsPhoto_${doc.data().ad_id}`
                let adsPhotoFile = bucket.file(adsPhotoName)
                try {
                    let [url] = await adsPhotoFile.getSignedUrl({
                        action: 'read',
                        expires: getDayPlusOne()
                    })

                    console.log(url)
                    try {
                        let updateAdRef = db.collection("ads").doc(doc.data().ad_id).update({
                            image: url
                        })
                        console.log(updateAdRef)
                    } catch (e) {
                        console.log(e)
                    }
                } catch (e) {
                    console.log(e)
                }
            })

            response.forEach(doc => {
                try {
                    const ads = new adsModel(
                        doc.data().ad_id,
                        doc.data().category_id,
                        doc.data().condition_id,
                        doc.data().description,
                        doc.data().image,
                        doc.data().nim,
                        doc.data().price,
                        doc.data().status_id,
                        doc.data().title,
                        doc.data().ad_type_id,
                        doc.data().timestamp
                    )
                    adsList.push(doc.data())
                } catch (e) {
                    console.log(e)
                }
            })
            res.send(adsList)
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetailAd = async (req, res) => {
    try {
        try {
            const id = req.params.ad_id
            const adsPhotoName = `adsPhotos/adsPhoto_${id}`
            const adsPhotoFile = bucket.file(adsPhotoName)
            const [url] = await adsPhotoFile.getSignedUrl({
                action: 'read',
                expires: getDayPlusOne()
            })

            const adRef = db.collection("ads").doc(id)

            const updateAdRef = adRef.update({
                image : url
            })
    
            const response = await adRef.get()
            res.send(response.data())

        } catch (e) {
            console.error('Error reading photo:', e);
            res.status(500).send('Error reading photo.');
        }
    } catch (e) {
        res.send(e)
    }
}

const readDetail = async (req, res) => {
    try {
        const adId = req.params.ad_id;
        const adDoc = await db.collection("ads").doc(adId).get()
        const adData = adDoc.data();
        
        // Get the category document
        const categoryId = adData.category_id;
        const categoryQuerySnapshot = await db.collection('categories').where('category_id', '==', categoryId).get();
        const categoryDoc = categoryQuerySnapshot.docs[0];
        const categoryData = categoryDoc.data();

        // Get the ad type document
        const adTypeId = adData.ad_type_id;
        const adTypeDoc = await db.collection('ad_types').doc(adTypeId).get();
        const adTypeData = adTypeDoc.data();
        
        const userId = adData.nim;
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        
        const conditionId = adData.condition_id;
        const conditionDoc = await db.collection('conditions').doc(conditionId).get();
        const conditionData = conditionDoc.data();

        const result = {
            ad_id: adData.ad_id,
            ad_type_id: adData.ad_type_id,
            category_id: adData.category_id,
            condition_id: adData.condition_id,
            description: adData.description,
            image: adData.image,
            nim: adData.nim,
            price: adData.price,
            status_id: adData.status_id,
            title: adData.title,
            ad_type_name: adTypeData.ad_type_name,
            category_name: categoryData.category_name,
            full_name: userData.full_name,
            avatar: userData.avatar,
            condition_name: conditionData.condition_name,
        };

        res.send([result])
    } catch (e) {
        res.send(e)
    }
}

const addAd = async (req, res) => {
    try{
        try {
            if(!req.file) {
                return res.status(400).send('No file uploaded')
            }else{
                console.log(req.file)
            }
        
            if(req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'application/octet-stream') {
                return res.status(400).send('Invalid file type!')
            }
    
            if(req.file.size > 1000000){
                return res.status(400).send('File is too large')
            }

            const id = uuidv4()
            const folderName = "adsPhotos"
            const file = req.file
            const fileName = `${folderName}/adsPhoto_${id}`
    
            bucket.upload(file.path, {
                destination: fileName,
                metadata: {
                    contentType: `${req.file.mimetype}`,
                    metadata: {
                        originalName: fileName,
                        size: file.size
                    }
                }
            })

            try {
                const adsPhotoName = `adsPhotos/adsPhoto_${id}`
                const adsPhotoFile = bucket.file(adsPhotoName)
                const [url] = await adsPhotoFile.getSignedUrl({
                    action: 'read',
                    expires: getDayPlusOne()
                })

                // console.log(req.body)
                const adJson = {
                    ad_id: id,
                    category_id: req.body.category_id,
                    condition_id: req.body.condition_id,
                    description: req.body.description,
                    image: url,
                    nim: req.body.nim,
                    price: req.body.price,
                    status_id: req.body.status_id,
                    title: req.body.title,
                    ad_type_id: req.body.ad_type_id,
                    timestamp: FieldValue.serverTimestamp()
                }
                const response = await db.collection("ads").doc(id).set(adJson)
                res.send(response)
            } catch (e) {
                console.error('Error reading photo:', e);
                res.status(500).send('Error reading photo.');
            }
        } catch (e) {
            console.error('Error uploading photo:', e);
            res.status(500).send('Error uploading photo.');
        }
    } catch(e) {
        res.send(e)
    }
}

const updateDetailAd = async (req, res) => {
    try {
      const id = req.params.ad_id;
      
      if (req.file) {
        if (
          req.file.mimetype !== 'image/jpeg' &&
          req.file.mimetype !== 'image/jpg' &&
          req.file.mimetype !== 'image/png' &&
          req.file.mimetype !== 'application/octet-stream'
        ) {
          return res.status(400).send('Invalid file type');
        }
  
        if (req.file.size > 1000000) {
          return res.status(400).send('File is too large');
        }
  
        const folderName = 'adsPhotos';
        const file = req.file;
        const fileName = `${folderName}/adsPhoto_${id}`;
  
        await bucket.upload(file.path, {
          destination: fileName,
          metadata: {
            contentType: req.file.mimetype,
            metadata: {
              originalName: fileName,
              size: file.size,
            },
          },
        });
  
        const adsPhotoName = `adsPhotos/adsPhoto_${id}`;
        const adsPhotoFile = bucket.file(adsPhotoName);
        const [url] = await adsPhotoFile.getSignedUrl({
          action: 'read',
          expires: getDayPlusOne(),
        });
  
        const updateData = {
          ad_id: id,
          category_id: req.body.category_id,
          condition_id: req.body.condition_id,
          description: req.body.description,
          nim: req.body.nim,
          price: req.body.price,
          status_id: req.body.status_id,
          title: req.body.title,
          ad_type_id: req.body.ad_type_id,
          image: url, // Update the image URL if it exists
        };
  
        const adsRef = await db.collection('ads').doc(id).update(updateData);
        res.send(adsRef);
      } else {
        const updateData = {
          ad_id: id,
          category_id: req.body.category_id,
          condition_id: req.body.condition_id,
          description: req.body.description,
          nim: req.body.nim,
          price: req.body.price,
          status_id: req.body.status_id,
          title: req.body.title,
          ad_type_id: req.body.ad_type_id,
        };
  
        const adsRef = await db.collection('ads').doc(id).update(updateData);
        res.send(adsRef);
      }
    } catch (error) {
      console.error('Error occurred while updating ad:', error);
      res.status(500).send('Error occurred while updating ad.');
    }
  };

const deleteAd = async (req, res) => {
    try {
        const photoName = `adsPhotos/adsPhoto_${req.params.ad_id}`

        bucket.file(photoName).delete()
            .then(() => {
                console.log('Photo deleted successfully.');
            })
            .catch((e) => {
                console.error('Error deleting photo:', e);
                res.status(500).send('Error deleting photo.');
            })

        const responseUser = await db.collection("ads").doc(req.params.ad_id).delete()
        res.send(responseUser)
    } catch (e) {
        res.send(e)
    }
}

module.exports = {
    readAllAd,
    readDetailAd,
    readDetail,
    addAd,
    updateDetailAd,
    deleteAd
}