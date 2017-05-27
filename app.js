const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const pg = require('pg');
const app = express();
const connect = "postgres://siteuser:siteuser@localhost:5432/sitedb";
//Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
//Set public folder
app.use(express.static(path.join(__dirname, 'public')));
//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Routes
app.get('/', function(req, res){
	pg.connect(connect, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query('Select * from todo_item order by id', function(err, result){
			if(err){
				return console.error('error running query', err);
			}
			res.render('index', {items: result.rows});
			done();
		});
	});
});
app.post('/add_todo', function(req, res){
	pg.connect(connect, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query("Insert into todo_item(subject_name, todo_definition, todo_due) values($1, $2, $3)", [req.body.subject_name,req.body.definition, req.body.due_date]) // Placeholders($1, $2, $3)
		done();
		res.redirect('/');
	});
})
//Delete a To-do Item 
app.delete('/delete/:id', function(req, res){
		pg.connect(connect, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query("Delete from todo_item where id = $1", [req.params.id]);
		done();
		res.sendStatus(200);
	});
});
//Edit a To-do Item
app.post('/edit_todo', function(req, res){
	pg.connect(connect, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query("Update todo_item set subject_name=$1, todo_definition=$2, todo_due=$3 where id=$4", [req.body.subject_name, req.body.definition, req.body.due_date, req.body.id]);
		done();
		res.redirect('/');
	});
});

app.listen(3500, function() {
	console.log('Server started on port: 3500');
})