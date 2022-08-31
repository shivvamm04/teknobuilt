const express = require('express');
const path = require('path');
//! importing the pg module
const { Client } = require('pg');

const client = new Client({ user: 'postgres',
password: '1234',
port: 5432 });

async function connectTable() {
  await client.connect();
}

connectTable();

const app = express();

app.use(express.urlencoded({ extended: true }));

// app.get('/', function (request, response) {
//   response.sendFile(path.resolve('index.html'));
// });

// app.post('/send-here', function (request, response) {
//   const qParametrized = 'INSERT INTO userdata VALUES ($1, $2) RETURNING *';

//   client
//     .query(qParametrized, [request.body.fullname, request.body.age])
//     .then(() => {
//       response.status(201).end('got the data');
//     });
// });

app.get('/data', function (req, res) {
  //! when sortBy not given sortBy = ''
//   console.log(req.query.order);
//   console.log(req.query.sortBy);
  let sortBy = req.query.sortBy || '';
  let orderBy = req.query.order || '';
  
  //! when sortBy is random, set sortBy = 'name'
  if (!['rank', 'title','rating','year'].includes(sortBy.toLowerCase())) {
      sortBy = 'rank';
    }
    orderBy = orderBy.toUpperCase();
  if(orderBy !== 'DESC' && orderBy !== 'ASC'){
      orderBy = 'ASC';
  }

  let sql = `SELECT * FROM imdb ORDER BY ${sortBy} ${orderBy}`;

  client.query(sql).then((result) => {
    res.json(result.rows);
  });
});

app.get('/data/:title', function (req, res) {
  console.log(req.params);
  const title = req.params.title;

  const sql = 'SELECT * FROM imdb WHERE title = $1';
  client.query(sql, [title]).then((result) => {
    res.json(result.rows);
  });
});

let PORT = 5345;
app.listen(PORT);