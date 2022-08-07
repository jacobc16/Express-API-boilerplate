const jwt = require('../jwt');

module.exports = (req, res, next) => {
	function fail() {
		res.status(401);
		res.send("Not authorized");
	}

	if(!req.headers.authorization) {
		fail();
		return;
	}

	const auth = req.headers.authorization.split(' ');
	if(auth.length !== 2 || auth[0] !== 'Bearer') {
		fail();
		return;
	}

	const token = auth[1];

	try {
		const decoded = jwt.verify(token);
		next();
	} catch (err) {
		fail();
	}
}
