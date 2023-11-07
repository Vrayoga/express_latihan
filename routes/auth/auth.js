const express = require ('express');
const jwt = require ('jsonwebtoken');
const {body, validationResult, Result } = require ('express-validator');
const router = express.Router();
const connection = require('../../config/db');

const secretKey = 'kunciAndaAman';


router.post('/register',[
    body('username').notEmpty().withMessage('harap diisi'),
    body('password').notEmpty().withMessage('harap diisi'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({error: errors.array()});
    }
    const {username, password} = req.body;
    const checkUserQuery = 'select * from users where username = ?';
    connection.query(checkUserQuery, [username], (err, Result) => {
        if (err){
            return res.status(500).json({error: 'server error'});
        }
        if(Result.length > 0){
            return res.status(409).json ({error: 'pengguna sudah terdaftar'});
        }
    const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?) ';
    connection.query(insertUserQuery, [username,password], (err, Result) => {
        if(err){
            return res.status(409).json({error:'pengguna sudah terdaftar'});
        }
    const payload = {userID: Result.insertId, username};
    const token = jwt.sign(payload,secretKey);
    const updateTokenQuery = 'UPDATE users SET token = ? WHERE id = ?';
    connection.query(updateTokenQuery, [token, Result.insertId], (err, Result)=>{
        if (err) {
            return res.status(500).json({error : 'server error'});
        }
        res.json({ token});
    })
    })
    })
}

);

router.post('/login', (req, res) =>{
    const {username,password} = req.body;
    connection.query('SELECT * FROM users WHERE username = ?', [username], (error, Result) =>{
        if (error){
            return res.status(500).json({ error : 'server error'});
        }
        if (Result.length === 0){
            return res.status(401).json ({error : 'gagal masuk'});
        }
        if (user.token){
            const token = user.token;
            res.json({ token});
        }else {
            const payload = {userId: user.id,username};
            const token = jwt.sign(payload,secretKey);
            const updateTokenQuery = 'update users SET token = ? where id = ?';
            connection.query(updateTokenQuery,[token,user.id], (err,updateResult) =>{
                if (err) {
                    return res.status (500).json({error :'Server error'});
                }
                res.json({token});
            })
        }
    })

} )



module.exports = router;