const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	function fail() {
		res.status(403);
		res.send("Not authorized");
	}

	if(!req.headers.authorization) {
		fail();
		return;
	}

	const token = req.headers.authorization.split(' ')[1];

	if(!token || token.length === 0) {
		fail();
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (err) {
		fail();
	}
}