// FOR REMOVAL
import express from "express";
import { authenticate } from "../services/authService";

export const router = express.Router();

export default function () {
  router.post('/', async (req, res) => {
    authenticate(req.body.email, req.body.password,
      (session) => {
        res.status(200).json({
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken()
        });
      },
      (err) => {
        console.error(err.message || JSON.stringify(err));
        res.status(401).json({
          msg: err.message || JSON.stringify(err)
        })
      });
  });

  return router;
}
