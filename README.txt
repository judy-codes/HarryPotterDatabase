1. A list of the files you are including with your submission and what those files contain.
./style.css --> CSS file for the entire website 
./index.html --> HTML file for the front page 
./app.js --> JS file to start the node server and connect to the Mongo and Postgres DBs. This is also where all of the queries are located

./psql/index.html --> HTML file for the PostGres interface 
./psql/table.js --> JS file that calls queries and organizes the information 

./mongo/index.html --> HTML file for the Mongo interface 
./mongo/table.js --> JS file that calls Mongo queries and organizes the information 

./images --> Folder holding all of the images, but there is only one photo in there at the moment
./ddl.sql --> DDL file from HW 4

Instructions for how to access your web interface
http://165.106.10.170:9999/

Instructions for how to restart your Node.js instance should the server reboot.
After doing npm i, npm i express, npm i pg, npm i mongodb home directory active app.js by:
node app.js 
