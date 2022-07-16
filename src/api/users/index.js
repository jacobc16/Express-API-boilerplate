const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.get('/', (req, res) => {
	async function main() {
		const users = await prisma.user.findMany();
		res.json(users);
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
