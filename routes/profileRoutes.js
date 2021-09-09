const express = require("express");
const router = express.Router();
const { profile, logout } = require("../controller/profileController");
const { auth } = require("../middleware/auth");


router.get('/profile', auth, profile)
router.get("/logout",logout)


module.exports  = router;