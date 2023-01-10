.PHONY: build run start-postgresql

build:
	docker build -t garaje-course-docker .

run:
	docker run -it -v $(PWD)/app -p "3000:3000" garaje-course-docker

start-postgresql:
	docker run --rm --name local-postgres -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=local -p "5555:5432" postgres
