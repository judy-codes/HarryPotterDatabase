/** 
 * Very simple site for serving static pages 
 * and performing one simple query on the rocket database
 * 
 * To start: UNIX> nohup node app6.js &
 *           where apps6.js is the name of this file
 *           nohup allows things to run in background, smoothly
 */

const path = require('path')
const express = require('express')
// require("./mongo/table")
const { Pool } = require('pg') // connecting to postgres
const { CommandCompleteMessage, closeComplete } = require('pg-protocol/dist/messages')

const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1/judywang";
const client = new MongoClient(uri); 


// Connection to postgres parameters
const pool = new Pool({
    user: 'dbuser',
    host: 'localhost',
    database: 'rocket',
    password: '12345678',
    port: 5432
})

const harry = new Pool({
    user: 'dbuser',
    host: 'localhost',
    database: 'jwang6',
    password: '12345678',
    port: 5432
})

console.log("Created pool ", pool)

const app = express()
const port = 9999

app.use("/", express.static(path.join(__dirname)));

// ______________________________________________________________________PSQL Stuff___________________________________________________________

// do a query to Postgres and return the result as JSON
function pgPopulateChapter(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');
        return;
    }
    let movie_name = req.body;
    let query = 'select chapter_name from chapter natural join movie where movie=\'' + movie_name['movie'] +'\';'
    client.query(query, function (dberr, dbres) {
        done()
        if (dberr) {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');

        } else {
            res.json(dbres.rows);
        }
    });
};

// do a query to Postgres and return the result as JSON
function pgGetData(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');
        return;
    }
    values = req.body;
    movie = values['movie']
    chapter = values['chapter']
    
    let query = 'select release_year, runtime, budget, box_office, place_category, species, gender, house, patronus, wand_wood, wand_core, character_name, place_name, dialogue from chapter natural join movie natural join dialogue natural join place natural join character where movie=\'' + movie + '\' and chapter_name=\'' + chapter +'\';'

    client.query(query, function (dberr, dbres) {
        done()
        if (dberr) {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');

        } else {
            res.json(dbres.rows);
        }
    });
};

function pgTitle(dberr, client, done, req, res) {
    if (dberr) {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');
        return;
    }
    values = req.body;
    movie = values['movie']
    
    let query = 'select * from movie where movie=\'' + movie + '\';'

    client.query(query, function (dberr, dbres) {
        done()
        if (dberr) {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: ' + dberr.code + ' ..\n');

        } else {
            res.json(dbres.rows);
        }
    });
};

app.post('/pgGetData', express.json({ type: '*/*' }), function (req, res) {
    harry.connect(function (dberr, client, done) {
        pgGetData(dberr, client, done, req, res);
    });
});

app.post('/pgTitle', express.json({ type: '*/*' }), function (req, res) {
    harry.connect(function (dberr, client, done) {
        pgTitle(dberr, client, done, req, res);
    });
});

app.post('/pgChapter', express.json({ type: '*/*' }), function (req, res) {
    harry.connect(function (dberr, client, done) {
        pgPopulateChapter(dberr, client, done, req, res);
    });
});

// start the Node server
app.listen(port, function (error) {
    if (error) throw error
    console.log(`Server created Successfully on port ${port}`);
})


// ______________________________________________________________________Mongo Stuff___________________________________________________________

async function mongoPopulateChapter(dberr, client, done, req, res) {
    let movie_name = req.body;
    let movie = movie_name['movie']
    let results = await client.db().collection('movie_collection').find(movie).toArray();
    res.json(results[0][movie]);
}

async function mongoGetData(dberr, client, done, req, res) {
    let values = req.body;
    let movie = values['movie']
    let chapter = values['chapter']
    let results = await client.db().collection('movie_collection').find(movie).toArray();
    res.json(results[0][movie][chapter]);
}

async function mongoTitle(dberr, client, done, req, res) {
    let values = req.body;
    let movie = values['movie']
    let results = await client.db().collection('movie_collection').find(movie).toArray();
    let json = {"Release Year" : results[0][movie]['Release Year'], "Runtime" : results[0][movie]['Runtime'], "Budget": results[0][movie]['Budget'], "Box Office": results[0][movie]['Box Office']};
    res.json(json);
}

app.post('/mongoChapter', express.json({ type: '*/*' }), function (req, res) {
    client.connect((function (dberr, client, done) {
        mongoPopulateChapter(dberr, client, done, req, res);
    }));
});

app.post('/mongoGetData', express.json({ type: '*/*' }), function (req, res) {
    client.connect((function (dberr, client, done) {
        mongoGetData(dberr, client, done, req, res);
    }));
});

app.post('/mongoGetTitle', express.json({ type: '*/*' }), function (req, res) {
    client.connect((function (dberr, client, done) {
        mongoTitle(dberr, client, done, req, res);
    }));
});

