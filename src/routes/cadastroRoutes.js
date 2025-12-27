import bcrypt from 'bcrypt'

export async function cadastroUsers(fastify, options) {

  fastify.get('/cadastro', async (request, reply) => {
    try {
      const userId = request.session.get('userId');
      if (userId) {
        return reply.redirect('/eventos');
      }
      return reply.status(200).sendFile('cadastro.html')
    } catch (error) {
      return reply.status(500).send({ message: 'Rota de Cadastro', error: error.message })
    }
  })

  fastify.post('/cadastro', async (request, reply) => {
    try {
      const { nome, email, password } = request.body

      if (!nome || !email || !password) {
        return reply.status(400).send({ message: 'Dados inválidos' })
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return reply.status(400).send({ message: 'Email Inválido' })
      }

      if (password.length < 4) {
        return reply.status(400).send({ message: 'Senha deve ter no mínimo 4 caracteres' })
      }

      const db = fastify.mongo.client.db();

      const userExist = await db.collection('users').findOne({
        email: email.toLowerCase()
      })

      if (userExist) {
        return reply.status(409).send({ message: 'Usuário já existe!' })
      }

      const hashPassword = await bcrypt.hash(password, 10)

      const user = {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        password: hashPassword,
        criadoEm: new Date()
      }

      const results = await db.collection('users').insertOne(user)

      request.session.set('userId', resultado.insertedId.toString());
      request.session.set('userName', nome);
      request.session.set('userEmail', email);
      return reply.status(201).send({
        message: 'Usuário criado com sucesso!',
        userId: results.insertedId
      })

    } catch (error) {
      console.error('❌ Erro no cadastro:', error)

      if (error.code === 11000) {
        return reply.status(409).send({ error: 'Usuário já existe' })
      }

      return reply.status(500).send({
        error: 'Erro interno na rota de cadastro',
        message: error.message
      })
    }
  })
}