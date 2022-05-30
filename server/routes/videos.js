const jwt = require("jsonwebtoken");
const { connection } = require("../controlers/db");
const router = require("express").Router();
const cloudinary = require('cloudinary').v2;

router.get('/', (req, res) => {
    console.log("from get videos");
    connection.query(`SELECT * FROM videos`, (error, result, fields) => {
        console.log("error videos", error);
        if (error || result.length < 1) return res.status(401).json({ error: error || 'there is not avalible videos' });
        console.log("result videos", result);
        return res.status(200).json(result);
    })
})

router.get('/publish/:ID/:status', (req, res) => {
    var { ID, status } = req.params;
    console.log("video id from publish router", ID);
    connection.query(`UPDATE videos SET publish = ${status} WHERE ID = ${ID}`, (error, result, fields) => {
        console.log('error', error);
        console.log('result', result);
        if (error) return res.status(401).json(error)
        return res.status(200).send(result);
    })
})

router.delete('/delete/:ID', (req, res) => {
    const { ID } = req.params;
    console.log("video id from delete router", ID);
    connection.query(`SELECT publicID FROM videos WHERE ID = ${ID}; DELETE FROM videos WHERE ID = ${ID}`, (error, result, fields) => {
        console.log('new error', error);
        console.log('new result', result[0][0].publicID);
        cloudinary.uploader.destroy(result[0][0].publicID, {resource_type: 'video'}, (err,response) => {
            console.log("response||err after delete", response||err)
        });
        if (error) return res.status(401).json(error)
        return res.status(200).send(result);

    })
})

module.exports = router;