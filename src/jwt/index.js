const jwt = require("jsonwebtoken");

function sign(payload, timeToLive) {
	timeToLive = timeToLive || process.env.JWT_EXPIRATION_DURATION;
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: timeToLive });
}

function verify(token) {
	return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
	sign,
	verify
};