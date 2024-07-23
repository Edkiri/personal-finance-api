up: 
	docker-compose up -d

down: 
	docker-compose down

prepare:
	docker exec personal-finance-api npm run db:migrate
	docker exec personal-finance-api npm run seed