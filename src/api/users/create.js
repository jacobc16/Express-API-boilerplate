const express = require('express');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.post('/create', (req, res) => {
	async function main() {
		const response = await axios.get('https://randomuser.me/api/');
		const randomUser = response.data.results[0];
		const name = `${randomUser.name.first} ${randomUser.name.last}`;
		const email = randomUser.email;

		await prisma.user.create({
			data: {
				name,
				email
			},
		})
		res.json({
			message: `User ${name} created with email ${email}`,
		});
	}

	main()
		.catch((e) => {
			throw e;
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
});

module.exports = router;
