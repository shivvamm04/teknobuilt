const cheerio = require('cheerio');
const axios = require('axios');
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    password: '1234',
    port: 5432
});

async function createTable() {
    await client.connect();
    await client.query(`
    CREATE TABLE IF NOT EXISTS imdb (
      rank INT NOT NULL,
      title TEXT,
      rating FLOAT,
      year INT,
      url TEXT
    );
  `);
}

createTable();

const url = 'https://www.imdb.com/chart/top/?ref_=nv_mv_250';

let movies = [];
axios.get(url).
then((response) => {

    let $ = cheerio.load(response.data);
    $('.lister-list tr').each(function(el , index){
        let url = $(this).find('td.titleColumn a').attr('href');
        let title = $(this).find('td.titleColumn a').text();
        let rank = $(this).find('td.titleColumn').text().trim().split('.')[0];
        let rating = $(this).find('td.imdbRating').text().trim();
        let _year = $(this).find('td.titleColumn .secondaryInfo').text().split('(')[1].split(')')[0];

        movies.push({rank:rank, title: title, rating: rating ,year:_year, url : url});
        client.query(`
        INSERT INTO imdb VALUES(${rank},'${title}', ${rating},${_year},'${url}');`).then(() => {
    console.log('got the data');
}).catch((err)=>{
    console.log(err);
})
    
    });
    console.log(movies);

}).catch((error)=>{
    console.log(error);
});