# tyba-restaurant-api
Simple API Rest for consulting restaurants near a place.

##Requirements:
Docker
docker-compose

##Usage:
First time: docker-compose up --build -d


##API CALLS:
This is a simple list of existing API calls.
URL: http://localhost:3000/

###GET 
/user: Returns existing user's data
/search: Search restaurants near the given place
/historial: Returns the search historial for an user
/logout: Logout the user

###POST
/user: Store new user data
/login: Logins an existing user
