import express from 'express';

const router = express.Router();

router.post('/api/users/signup', (req, res) => {
    res.send('Hiiii  sign UP');
});

export {router as signUpRouter};