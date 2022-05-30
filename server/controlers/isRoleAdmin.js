const { connection } = require("./db");
const jwt = require("jsonwebtoken");

module.exports.isRoleAdmin = (res, req, next) => {
    const id = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
    connection.query(`SELECT * FROM users WHERE ID = ${id}`, (err, result, fields) => {
        if(err || !result || result.length < 1 || result[0].role < 3) return res.status(401).send('you can not access to this information');
        next();
    })
}