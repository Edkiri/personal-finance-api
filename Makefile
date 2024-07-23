prepare:
	docker exec personal-finance-api npm run db:migrate
	docker exec personal-finance-api npm run seed