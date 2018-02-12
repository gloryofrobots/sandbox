This is web terminal for evaluation of scheme code. 
I used customized version of https://pypi.python.org/pypi/SchemePy for evaluation
ZeroMQ used as message broker. Backend server built with Tornado. 
Frontend is React application with JQuery terminal.
PostgreSql used as database for user authentication

How to run
* install or init PostgreSql
* inside app/server/sql there is file create.sql with needed database structure. You can run it in psql with ```\i path_to_sql_file```

* init if you need virtual env in root directory
* init if you need nvm 
* ```pip install -r app/requirements.txt```
* create ```log``` directory in the project root or edit ```app/server/config.py```
* run ZeroMQ endpoint with ```python app/scm/scmserver.py```
* run Tornado middleware with ```python app/server/server.py```
* inside app/client
* ```npm install```
* ```npm run start```

Application configs are in ```app/server/config.py``` and ```app/client/src/CONF.js```
Inside web application  type ```auth user1 user1```, or register new user with ```register {username} {password}```
Authentication is based on Json Web Tokens
After succesful authentication you can use scm command to run scheme code, for example ```scm (- (+ 1 1))```

