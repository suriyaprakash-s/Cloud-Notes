const express = require('express');
const {check, validationResult} = require('express-validator/check');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User')
const router = express.Router();

router.post('/register', [
    check('email', 'Enter vaild Email').isEmail(),
    check('password', 'Enter a password with6 or more characters').isLength({min:6})
], async(req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty())
        return res.status(400).json({errors:error.array()});
    const {email, password} = req.body;

    try{
        let user = await User.findOne({email});
        if(user)
            return res.status(400).json({errors:[{msg:'User already exists'}]});
        
        user = new User({email, password});
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        await user.save();

        const payload  = {
            user:{
                id: user.id
            }
        };
        jwt.sign(payload, 'sampleSecretCode', {expiresIn: 3600}, (err, token)=>{
            if(err)
                throw err;
            res.json(token);
        });
    }catch(error){
        console.error(error.messsage);
        res.status(500).json('Server error');
    }
});

router.post('/login', [
    check('email', 'Enter valid Email').isEmail(),
    check('password', 'Password required').exists()],
    async(req, res)=>{
        const error = validationResult(req);
        if(!error.isEmpty())
            res.status(400).json({errors: error.array()});
        
        const {email, password} = req.body;

        try {
            const user = await User.findOne({email}); 
            if(!user)
                res.status(401).json({errors:[{msg: 'Invalid credentials'}]});
            const isMatch = await bcryptjs.compare(password, user.password);
            if(!isMatch)
                res.status(401).json({errors:[{msg: 'Invalid credentials'}]});
            const payload = {
                user:{
                    id: user.id
                }
            }
            jwt.sign(payload, 'sampleSecretCode', {expiresIn:3600}, (err, token)=>{
                if(err)
                    throw err;
                res.json(token);
            });
        } catch (error) {
            
        }

    });


module.exports = router;