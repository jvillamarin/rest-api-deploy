const express = require('express')
const movies = require('./movies.json')
const cors = require('cors')
const app = express()
const crypto = require('node:crypto')
const { validateMovie } = require('./schemas/movies')
const { validateParcialMovie } = require('./schemas/movies')

app.disable('x-powered-by')
app.use(express.json())
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGIN = ['http://localhost:1234', 'http://localhost:8081', 'https://movies.com']

    if (ACCEPTED_ORIGIN.includes(origin) || !origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))

const PORT = process.env.PORT ?? 1234

// const ACCEPTED_ORIGIN = ['http://localhost:1234', 'http://localhost:8080', 'https://movies.com']

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/movies', (req, res) => {
//   const origin = req.headers.origin
//   if (ACCEPTED_ORIGIN.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//   }
  // definir el header de acceso a los datos de la api desde cualquier origen - CORS

  //   res.header('Access-Control-Allow-Origin', '*')
  console.log('get movies')

  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))

    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (!movie) {
    res.status(404).send('Movie Not Found')
  } else {
    res.json(movie)
  }
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    res.status(422).json({ error: JSON.parse(result.error.message) })
    return
  }

  const newMovie = {

    id: crypto.randomUUID(), // generar un id aleatorio UUID v4
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  console.log(req.body)
  const result = validateParcialMovie(req.body)

  const { id } = req.params

  if (!result.success) {
    return res.status(404).json({ error: 'Movie Not Found' })
  }
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie Not Found' })
  }
  const updatedMovie = { ...movies[movieIndex], ...result.data }
  console.log(updatedMovie)
  console.log(movies[movieIndex])

  movies[movieIndex] = updatedMovie
  return res.json(updatedMovie)
})
app.delete('/movies/:id', (req, res) => {
//   const origin = req.headers.origin
//   if (ACCEPTED_ORIGIN.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//   }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie Not Found' })
  }
  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted successfully' })
})

app.options('/movies/:id', (req, res) => {
//   const origin = req.headers.origin
//   if (ACCEPTED_ORIGIN.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
//     res.header('Access-Control-Allow-Headers', 'Content-Type')
//   }

  res.send(200)
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
