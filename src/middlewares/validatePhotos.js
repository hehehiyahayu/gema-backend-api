const validatePhotos = (req, res, next) => {
    if(!req.file) {
        return res.status(400).send('No file uploaded')
    }

    if(req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/png') {
        return res.status(400).send('Invalid file type')
    }
    next()
}

module.exports = validatePhotos