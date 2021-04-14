import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    // To remove all data from cookie we'll use cookie-session package
    req.session = null;

    res.send({}); 
});

export {router as signoutRouter};