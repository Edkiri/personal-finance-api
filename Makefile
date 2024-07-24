up: 
	docker-compose up -d

down: 
	docker-compose down

logs:
	docker-compose logs app -f

prepare:
	docker exec personal-finance-api npm run db:migrate
	docker exec personal-finance-api npm run seed