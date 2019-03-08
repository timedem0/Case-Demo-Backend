// SETUP required modules, settings and headers

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');

const filePath = __dirname + "/" + "categories.json";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {
    "use strict";
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// WEB SERVICE ENDPOINTS (REST API services)

// hello
app.get('/hello', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Hello World from Node.js Back-end");
});

// GET category/all
app.get('/category/all', function (req, res) {
    jsonfile.readFile(filePath)
    .then((obj) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(JSON.stringify(obj));
        console.log("Reading server side JSON file OK.\n" + JSON.stringify(obj));
    })
    .catch(() => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end();
        console.error("Reading server side JSON file failed.");
        }
    );
});

// GET category based on ID
app.get('/category', function (req, res) {
	let id = req.query.id;
	if (!id) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end();
		console.error("Reading server side JSON file failed.\n" + "No ID supplied in query.");
	} else if (isNaN(id)) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end();
		console.error("Reading server side JSON file failed.\n" + "The supplied ID is not a number.");
	} else {
		fetchItemBasedOnId(res, id);
	}
});

// POST category (id, name, budget)
app.post('/add_category', function (req, res) {
    let id = req.body.id;
    let name = req.body.name;
    let budget = req.body.budget;
    let newItem = { id, name, budget };
    addItemToJsonArrayFile(res, newItem);
});

// DELETE category?id=1001
app.delete('/delete_category', function (req, res) {
	let id = req.query.id;
	if (!id) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end();
		console.error("Reading server side JSON file failed.\n" + "No ID supplied in query.");
	} else if (isNaN(id)) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end();
		console.error("Reading server side JSON file failed.\n" + "The supplied ID is not a number.");
	} else {
		deleteItemBasedOnId(res, id);
	}	
});


// HELPER FUNCTIONS

function fetchItemBasedOnId (res, id) {
    let item = null;
    jsonfile.readFile(filePath)
    .then((obj) => {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].id === Number(id)) {
                item = obj[i];
            }
        };
        if (item) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(item));
            console.log("Reading server side JSON file OK.\n" + "Item found: " + JSON.stringify(item));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end();
            console.log("Reading server side JSON file OK.\n" + "No item found with ID = " + id + ".");
        };
    })
    .catch(() => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end();
        console.error("Reading server side JSON file failed.");
        }
    );
};

function deleteItemBasedOnId (res, id) {
    let item = null;
    jsonfile.readFile(filePath)
    .then((obj) => {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].id === Number(id)) {
                item = obj.splice(i, 1);
            }
        };
        if (item) {
            jsonfile.writeFile(filePath, obj)
            .then(() => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end();
                console.log("Writing JSON to server file system OK.\n" + "Item deleted: " + JSON.stringify(item));
            })
            .catch(() => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end();
                console.error("Writing JSON to server file system failed.");
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end();
            console.log("Reading server side JSON file OK.\n" + "No item found with ID = " + id + ".");
        };
    })
    .catch(() => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end();
        console.error("Reading server side JSON file failed.");
        }
    );
};

function addItemToJsonArrayFile (res, newItem) {
    jsonfile.readFile(filePath)
    .then((obj) => {
        obj.push(newItem);
        jsonfile.writeFile(filePath, obj)
        .then(() => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end();
            console.log("Writing JSON to server file system OK.\n" + "Item added: " + JSON.stringify(newItem));
        })
        .catch(() => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end();
            console.error("Writing JSON to server file system failed.");
        });
    })
    .catch(() => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end();
        console.error("Reading server side JSON file failed.");
        }
    );
};


// START SERVER

var server = app.listen(3001, function () {
    "use strict";
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});
