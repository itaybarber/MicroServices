import express from 'express';
import { currentUser } from "../middelwares/current-user";

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    if (!req.session?.jwt) {
        return res.send({currentUser: null});
    }

    res.send({currentUser: req.currentUser || null}); // The || statment is to aviod sending undefined if user is not logged in
    }
);

export {router as currentUserRouter};