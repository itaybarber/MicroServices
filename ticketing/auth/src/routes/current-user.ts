import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    if (!req.session?.jwt) {
        return res.send({currentUser: null});
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);  // The ! says to TS "don't worry, this var is defined"
    }
    catch (err) {
        res.send({currentUser: null});
    }
});

export {router as currentUserRouter};