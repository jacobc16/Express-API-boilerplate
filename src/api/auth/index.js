const express = require('express');
const jwt = require('../../jwt');

const router = express.Router();

router.get('/', (req, res) => {
	let token;
	try {
		token = jwt.sign({ userId: 1, email: "something@example.com" });
	} catch (err) {
		console.log(new Error("Error! Something went wrong."));
	}
	res.json({
		token: token
	});
});

module.exports = router;
