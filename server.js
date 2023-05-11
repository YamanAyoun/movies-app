'use strict'

const express = require('express');
const server = express();
const axios = require('axios');
let PORT = process.env.PORT || 3000; 
const cors = require('cors');
require('dotenv').config();
const pg = require('pg');
const APIKey = process.env.APIKey;
server.use(cors())
const data = require('./Movie Data/data.json');

server.use(express.json())
const client = new pg.Client(process.env.DATABASE_URL)

server.get('/', homeHandler)
server.get('/favorite', favoriteHandler)
server.get('/trending', trendingHandler)
server.get('/search', searchHandler)
server.get('/genres', genresHandler)
server.get('/popular', popularHandler)
server.get('/getMovies', getMoviesHandler)
server.post('/addMovie', addMoviesHandler)
server.put('/UPDATE/:id',updateHandler)
server.delete('/DELETE/:id',deleteHandler)
server.get('/getMovies/:id', getMovieById)
server.get('/error', Error500)
server.get('*', Error400)


function homeHandler(req, res) {
  let home = new movie(data.title, data.poster_path, data.overview)

  res.status(200).send(home);
  ;
}

function movie(title, poster_path, overview) {
  this.title = title,
    this.poster_path = poster_path,
    this.overview = overview

}

function favoriteHandler(req, res) {
  let str = 'Welcome to Favorite Page'
  res.status(200).send(str)
}

function Error500(req, res) {
  let err5 = {
    "status": 500,

    "responseText": 'Sorry, something went wrong'
  }
  res.status(err5.status).send(err5);
};

function Error400(req, res) {
  res.status(404).send('page not found error')
};


function trendingHandler(req, res) {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}`

  axios.get(url)
    .then(result => {

      let mapResult = result.data.results.map(item => {
        let singleResult = new dataTrending(item.id, item.title, item.release_date, item.poster_path, item.overview);
        return singleResult;
      })
      console.log(mapResult)
      res.send(mapResult)

    })

    .catch((error) => {
      console.log('sorry you have something error', error)
      res.status(500).send(error);
    })

};

function searchHandler(req, res) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`

  axios.get(url)
    .then(result => {
      let mapResult = result.data.results.map(item => {
        let singleResult = new dataSearch(item.id, item.title);
        return singleResult;
      })
      console.log(mapResult)
      res.send(mapResult)

    })
    .catch((error) => {
      console.log('sorry you have something error', error)
      res.status(500).send(error);
    })
}


function genresHandler(req, res) {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=fd0e5badbd55e349db3527d6cef8ad87&language=en-US`

  axios.get(url)
    .then(result => {
      let mapResult = result.data.genres.map(item => {
        let singleResult = new dataGenres(item.id, item.name);
        return singleResult;
      })
      console.log(mapResult)
      res.send(mapResult)

    })
    .catch((error) => {
      console.log('sorry you have something error', error)
      res.status(500).send(error);
    })

}

function popularHandler(req, res) {
  const url = `https://api.themoviedb.org/3/person/popular?api_key=fd0e5badbd55e349db3527d6cef8ad87&language=en-US&page=1`

  axios.get(url)
    .then(result => {
      let mapResult = result.data.results.map(item => {
        let singleResult = new dataPopular(item.name, item.gender);
        return singleResult;
      })
      console.log(mapResult)
      res.send(mapResult)

    })
    .catch((error) => {
      console.log('sorry you have something error', error)
      res.status(500).send(error);
    })

}


function getMoviesHandler(req, res){
  const sql = `SELECT * FROM addMovie`;
  client.query(sql)
  .then(data=>{
      res.send(data.rows);
  })

  .catch((error)=>{
    Error500(error,req,res)
  })
}

function addMoviesHandler(req, res){
  const movie = req.body;
    console.log(movie);
    const sql = `INSERT INTO addMovie (title, mins)
    VALUES ($1, $2);`
    const values = [movie.title , movie.mins]; 
    client.query(sql,values)
    .then(data=>{
        res.send("The data has been added successfully");
    })
    .catch((error)=>{
      Error500(error,req,res)
    })
}

function updateHandler(req,res){
    
  const {id} = req.params;
  console.log(req.body);
  const sql = `UPDATE addMovie
  SET title = $1, mins = $2
  WHERE id = ${id};`
  const {title, mins} = req.body;
  const values = [title, mins];
  client.query(sql,values).then((data)=>{
      res.send(data)
  })
  .catch((error)=>{
    Error500(error,req,res)
  })
}

function deleteHandler(req,res){
  const id = req.params.id;
  console.log(req.params);
  const sql = `DELETE FROM addMovie WHERE id=${id};`
  client.query(sql)
  .then((data)=>{
    res.status(202).send(data)
  })
  .catch((error)=>{
    Error500(error,req,res)
  })
}


function getMovieById(req, res) {
  const {id} = req.params;
  console.log(id)
  const sql = `SELECT * FROM addMovie
  WHERE id=${id};`;
  client.query(sql)
  .then(data=>{
      res.send(data.rows);
  })

  .catch((error)=>{
    Error500(error,req,res)
  })
}

function dataTrending(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

function dataSearch(id, title) {
  this.id = id;
  this.title = title;
}

function dataGenres(id, name) {
  this.id = id;
  this.name = name;
}

function dataPopular(name ,gender) {
  this.name = name;
  this.gender = gender;
}

client.connect()
.then(()=>{
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}: I'm ready`)
  })
})
