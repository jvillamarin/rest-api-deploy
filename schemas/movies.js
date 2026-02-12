const { z } = require('zod')

// validar el schema
const movieSchema = z.object({
  title: z.string({ required_error: 'El título es obligatorio' },
    { invalid_type_error: 'El título debe ser una cadena de texto' }
  ),
  year: z.number({ required_error: 'El año es obligatorio' },
    { invalid_type_error: 'El año debe ser un número' }
  ).int({ message: 'El año debe ser un número entero' }).positive({ message: 'El año debe ser un número positivo' }),
  director: z.string({ required_error: 'El director es obligatorio' },
    { invalid_type_error: 'El director debe ser una cadena de texto' }
  ),
  duration: z.number({ required_error: 'La duración es obligatoria' },
    { invalid_type_error: 'La duración debe ser un número' }
  ).positive({ message: 'La duración debe ser un número positivo' }),
  poster: z.string().url({ required_error: 'El poster es obligatorio' }, { invalid_type_error: 'El poster debe ser una URL válida' }),
  genre: z.array(z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-fi'], { message: 'Género no válido' }), { required_error: 'El género es obligatorio' }),
  rate: z.number().min(0).max(10, { message: 'La puntuación debe estar entre 0 y 10' })
})

function validateMovie (movie) {
  return movieSchema.safeParse(movie)
}

function validateParcialMovie (movie) {
  return movieSchema.partial().safeParse(movie)
}

module.exports = {
  validateMovie,
  validateParcialMovie
}
