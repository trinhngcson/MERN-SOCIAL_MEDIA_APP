const express = require("express");
const { register, login } = require("../controllers/user");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").get(login);

module.exports = router;
