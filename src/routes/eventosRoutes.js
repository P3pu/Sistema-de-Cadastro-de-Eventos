import { ObjectId } from "@fastify/mongodb";

export async function eventosUsers(fastify, opt) {
  // Hook para proteger todas as rotas deste arquivo
  fastify.addHook('preHandler', async (request, reply) => {
    await fastify.authenticate(request, reply);
  });

  fastify.get('/eventos', async (request, reply) => {
    return reply.sendFile('eventos.html');
  });
  // retorna todo o conteudo da collection eventos
  fastify.get('/dados/eventos', async (request, reply) => {
    try {
      const db = fastify.mongo.client.db()
      const eventos = await db.collection('eventos').find().toArray()
      reply.status(200).send({ message: 'Sucesso ao buscar dados', Data: eventos })
      return eventos;
    } catch (err) {
      return reply.status(500).send({ message: 'Error ao buscar dados do banco de dados' })
    }
  })

  // retorna conteudos especificos da collection
  fastify.get('/eventos/:id', opt, async (request, reply) => {
    const { id } = request.params;

    const db = fastify.mongo.client.db()

    const result = await db.collection('eventos').findOne({
      _id: ObjectId.createFromHexString(id)
    })

    return reply.send({
      message: 'Evento encontrado com sucesso',
      evento: result
    })

  })


  // Rota para criar novo evento
  fastify.post('/eventos', async (request, reply) => {
    try {
      const eventData = request.body;
      console.log(eventData)
      // Adicionar informações do usuário autenticado
      const evento = {
        ...eventData,
        user: request.userId,
        userName: request.userName || request.session.get('userName'),
        userEmail: request.userEmail || request.session.get('userEmail'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Salvar no MongoDB
      const db = fastify.mongo.client.db();
      const novoEvento = await db.collection('eventos').insertOne(evento)

      return reply.status(201).send({
        success: true,
        message: 'Evento criado com sucesso',
        data: novoEvento,
        id: novoEvento.insertedId
      });

    } catch (error) {
      request.log.error('Erro ao criar evento:', error);
      // Erro de validação do Mongoose
      if (error.name === 'ValidationError') {
        return reply.status(400).send({
          error: 'Dados inválidos',
          details: Object.values(error.errors).map(e => e.message)
        });
      }

      return reply.status(500).send({
        error: 'Erro ao criar evento',
        message: error.message
      });
    }
  });


  fastify.put('/eventos/:id', opt, async (request, reply) => {
    try {
      const { id } = request.params;
      const dadosAtualizados = request.body;

      // Validação básica
      if (!dadosAtualizados.eventInfo || !dadosAtualizados.eventInfo.eventName) {
        return reply.status(400).send({
          success: false,
          message: 'Nome do evento é obrigatório'
        });
      }

      // Preparar dados para atualização
      const eventoAtualizado = {
        ...dadosAtualizados,
        updatedAt: new Date(),
        updatedBy: request.userId
      };

      // Atualizar no MongoDB
      const db = await fastify.mongo.client.db();
      const result = await db.collection('eventos').updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: eventoAtualizado }
      );

      // Verificar se o evento foi encontrado e atualizado
      if (result.matchedCount === 0) {
        return reply.status(404).send({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      // Buscar o evento atualizado para retornar
      const eventoRetorno = await db.collection('eventos').findOne({
        _id: ObjectId.createFromHexString(id)
      });

      return reply.status(200).send({
        success: true,
        message: 'Evento atualizado com sucesso',
        data: eventoRetorno
      });

    } catch (error) {
      request.log.error('Erro ao atualizar evento:', error);

      return reply.status(500).send({
        success: false,
        message: 'Erro ao atualizar evento',
        error: error.message
      });
    }
  });

  // deletar eventos especificos
  fastify.delete('/eventos/:id', opt, async (request, reply) => {
    const { id } = request.params;

    const db = await fastify.mongo.client.db()

    const result = await db.collection('eventos').deleteOne({
      _id: ObjectId.createFromHexString(id)
    })

    return reply.send({
      message: 'Evento deletado com sucesso',
      evento: result
    }
    )

  })
}