const express = require('express');
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get('/', (req, res) => {
	let token;
	try {
		token = jwt.sign(
			{ userId: 1, email: "something@example.com" },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
	} catch (err) {
		console.log(new Error("Error! Something went wrong."));
	}
	res.json({
		token: token
	});
});

module.exports = router;
