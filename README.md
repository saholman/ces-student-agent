# ces-student-agent

A Student Agent provides all the API services and user interface necessary to access profile data, learning experiences stored in a Learning Record Store (LRS), provide proofs about Verifiable Claims, and manage policies administered by the student through a user interface.

## Local build and run commands

* cd mongodb
* docker build -t lrs_mongo .
* docker run -d --name db -p 27017:27017 -p 28017:28017  lrs_mongo
* cd ../lrs
* docker build -t lrs .
* docker run --name lrs --link db:mongo -p 80:80 lrs
* docker exec -it lrs_webapp bash # if necessary for debugging