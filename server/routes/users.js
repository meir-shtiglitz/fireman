const express = require('express');
const { connection } = require('../controlers/db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isRoleAdmin } = require('../controlers/isRoleAdmin');
const User = require('../models/user');

router.get('/', isRoleAdmin, (req,res) => {
    User.find({}, (error, users) => {
        console.log("error || users",error||users);
        if(error || !users || !users.length) return res.status(401).send({error:error, reason: "we didn't find users"});
        return res.status(200).send(users);
    })
})

router.post('/login', (req, res) => {
    console.log("req.body",req.body);
    const {email, password} = req.body;
    User.findOne({email}, (error,user) => {
        console.log("user || error",user || error);
        if(error || !user || !user.checkPassword(password)) return res.status(401).send({error:error, reason: "email or password is didn't match"});
        const {_id, role} = user;
        const token = jwt.sign(_id.toJSON(), process.env.TOKEN_SECRET);
        return res.status(200).json({token, user:{email ,role}});
    });
})

router.post('/register', (req, res) => {
    console.log("req.body register",req.body);
    const newUser = new User(req.body);
    newUser.save((error, result) => {
        console.log("result || error", error || result);
        if(error || !result) return res.status(401).send({error:error, reason: "sumthing went bad..."});
        const token = jwt.sign(result._id.toJSON(), process.env.TOKEN_SECRET);
        return res.status(200).json({token, user:{email:result.email,role:1}});
    })
})

// login by token
router.post('/login/token/:token', (req, res) => {
    // console.log("req.params",req.params);
    const {token} = req.params;
    const crackedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("crackedToken",crackedToken);
    User.findById(crackedToken, (error, user) => {
        console.log("error || user",error || user);
        if(error || !user) return res.status(401).send({error:error, reason: "invalid token"});
        const {email, role} = user;
        return res.status(200).json({token, user:{email ,role}});
    })
})

router.post('/role', isRoleAdmin, (req, res) => {
    // console.log("req.body",req.body);
    // const {email, password} = req.body;
    // const secret = uuidv4();
    // console.log("secret",secret);
    // const hashpass = cryptoJS.HmacSHA1(password, secret);
    // console.log("hashpass",hashpass);
    // connection.query(`INSERT INTO users (email, hashpass, secret) VALUES ("${email}","${hashpass}","${secret}")`, (err, result, fields) => {
    //     console.log("err",err); 
    //     console.log("result",result);
    //     if(err || !result) return res.status(401).send({error:error, reason: "sumthing went bad..."});
    //     return res.status(200).json(result);
    // })
})

module.exports = router;