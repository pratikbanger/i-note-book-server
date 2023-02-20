const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get All the notes using: GET "/api/notes/fetchallnotes". login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {

        const notes = await Note.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal server error!")
    }
})

// ROUTE 2: Add a new note using: POST "/api/notes/addnote". login required
router.post('/addnote', fetchuser, [
    body('title', 'Title must be atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body
        // If there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote);

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal server error!")

    }
})

// ROUTE 3: Update an existing note using: POST "/api/notes/updatenote". login required
// We use PUT request for updation, POST request can also be used.
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {

        const { title, description, tag } = req.body
        // Creating a newNote object
        const newNote = {};

        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        // Find the note to update it.
        let note = await Note.findById(req.params.id);
        if(!note) {return res.status(404).send("Not Found")}

        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json({note});
        
    } catch (error) {
        
        console.error(error.message);
        res.status(500).send("Internal server error!")
        
    }
})

// ROUTE 4: Delete note using: DELETE "/api/notes/deletenote". login required
// We use DELETE request to delete notes, POST request can also be used.
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    
    try {
        
        // Find the note to delete it.
        let note = await Note.findById(req.params.id);
        if(!note) {return res.status(404).send("Not Found")}
        
        // Allow deletion only if the user own this note
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": note.title + " has been deleted"});
        
    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal server error!")
        
    }
})

module.exports = router;