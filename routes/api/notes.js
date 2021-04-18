const express = require('express');
const {check, validationResult} = require('express-validator/check');
const Note = require('../../models/Note');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const router = express.Router();

router.get('/', auth, async(req, res)=>{
    try {
        const notes = await Note.find().select('-content -user').sort({date: -1});
        res.json(notes);
    } catch (error) {
        console.error(error.messgae);
        res.status(500).json({msg:'Server Error'});
    }
    
});
router.get('/:id', auth, checkObjectId('id'), async(req, res)=>{
  try{
    const note = await Note.findById(req.params.id);
    if(!note)
        return res.status(404).json({msg: 'Note not found'});
    res.json(note);
  }catch(error){
      console.error(error.message);
      res.status(500).json('Server Error');
  }
});
router.post('/', [auth, 
    check('title', 'Title is required').notEmpty(),
    ], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        res.status(400).json({errors:errors.array()});
    try {
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content,
            user: req.user.id
        });

    const note =  await newNote.save();
    res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', [auth, checkObjectId('id'), check('title', 'Title is required').notEmpty()], async(req, res)=>{
    try{
        const updateNote = { title: req.body.title,
            content:req.body.content,
            date: Date.now()
        }
        const note = await Note.findOneAndUpdate(req.user.id, {$set: updateNote},{ new: true, upsert: true, setDefaultsOnInsert: true });
        res.json(note);
    }catch(error){
        console.error(error.message);
        res.status(500).json('Server Error');
    }
  });


router.delete('/:id', [auth, checkObjectId('id')], async(req, res)=>{
    try{
        const note = await Note.findById(req.params.id);
        if(!note)
            return res.status(404).json({msg: 'Note not found'});
        if(note.user.toString() !== req.user.id)
            return res.status(401).json({msg: 'User not authorized'});
        await note.remove();
        res.json({msg:'Note removed'});
    }catch(error){
        console.error(error.message);
        res.status(500).json('Server Error');
    }
  });

module.exports = router;