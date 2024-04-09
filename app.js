let express = require('express')
let app = express()
app.use(express.json())
let path = require('path')
let {open} = require('sqlite')
let sqlite3 = require('sqlite3')
let path_drive = path.join(__dirname, 'moviesData.db')

let db = null

let initiazing_server_and_db = async () => {
  try {
    db = await open({
      filename: path_drive,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Server runnin on port 3000')
    })
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

initiazing_server_and_db()

app.get('/movies/', async (request, response) => {
  let query = `
 SELECT 
 * FROM 
  MOVIE
 `

  let db_response = await db.all(query)
  response.send(
    db_response.map(eacharray => ({
      movieName: eacharray.movie_name,
    })),
  )
})

app.post('/movies/', async (request, response) => {
  let movies_deatailes = request.body

  let {directorId, movieName, leadActor} = movies_deatailes

  let query_post = `
INSERT INTO MOVIE(director_id,movie_name,lead_actor)
values( ${directorId} ,
    '${movieName}',
  '${leadActor}')

`
  let db_res = await db.run(query_post)
  response.send('Movie Successfully Added')
  
})

app.get('/movies/:movieId/', async (request, response) => {
  let {movieId} = request.params

  let query = `
  SELECT 
  *
  FROM 
  MOVIE
  WHERE
  movie_id=${movieId}
  `
  let db_response = await db.get(query)
  //response.send(db_response)
  response.send(
    db_response.map(eacharray => ({
      movieId: eacharray.movie_id,
      directorId: eacharray.director_id,
      movieName: eacharray.movie_name,
      leadActor: eacharray.lead_actor,
    })),
  )
})

app.put('/movies/:movieId/', async (request, response) => {
  let {movieId} = request.params
  let movie_detailes = request.body
  let {directorId, movieName, leadActo} = movie_detailes

  let query_update = `
  UPDATE 
   
  MOVIE 
  SET 
  director_id=${directorId},
  movie_name='${movieName}',
  lead_actor='${leadActor}'
  WHERE
  movie_id=${movieId}
  
  `
  let db_reponse = await db.run(query_update)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  let {movieId} = request.params
  let query = `
    DELETE FROM
    movie 
    where 
    movie_id=${movieId}
    `
  let del_response = await db.run(query)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  let query = `
SELECT 
*
FROM 
director

`
  let db_response = await db.all(query)
  response.send(
    db_response.map(eacharray => ({
      directorId: eacharray.director_id,
      directorName: eacharray.director_name,
    })),
  )
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  let query = `
SELECT movie_name
FROM

movie

`
  let db_reponse = await db.all(query)
  response.send(
    db_reponse.map(eacharray => ({
      movieName: eacharray.movie_name,
    })),
  )
})

module.exports = app
