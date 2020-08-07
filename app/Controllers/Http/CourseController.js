'use strict'

const Course = use('App/Models/Course')

class CourseController {
  async store({ request, response }) {
    try {
      const { name } = request.only( ['name'] )

      if( await Course.findBy('name', name ) ) {
        return response.badRequest({ message: 'Curso já cadastrado'} )
      }

      const createCourse = request.only( ['name', 'description', 'url', 'price'] )
      return await Course.create( createCourse )

    } catch (e) {
      return response.internalServerError( { message: 'Falha ao cadastrar o curso'} )
    }
  }

  async index( { request } ) {
    const page = request.get().page || 1
    return await Course.query().paginate( page );
  }

  async show({ params, response }) {
    try {
      return await Course.find(params.id)
    } catch (e) {
      return response.notFound({ message: 'Curso não encontrado' })
    }
  }

  async update({ params, request, response }) {
    try {
      const course = await Course.findOrFail(params.id)
      const createCourse = request.only(['name', 'description', 'url', 'price'])
      course.merge(createCourse)

      await course.save()

      return course
    } catch (e) {
      return response.badRequest({ message: 'Falha ao atualizar registro' })
    }
  }

  async delete({ params, response }) {
    try {
      const course = await Course.findOrFail(params.id)
      await course.delete()

    } catch (error) {
      return response.badRequest({ message: 'Falha ao remover o curso' })
    }
  }
}

module.exports = CourseController
