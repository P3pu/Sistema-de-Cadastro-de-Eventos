export async function eventosUsers(fastify, opt) {
    // Hook para proteger todas as rotas deste arquivo
     fastify.addHook('preHandler', async (request, reply) => {
    await fastify.authenticate(request, reply);
  });
    
    // ✅ Adicione async aqui
    fastify.get('/eventos', async (request, reply) => {
        return reply.sendFile('eventos.html');
    });

    fastify.get('/dados/eventos', async(request, reply)=>{
      try{
        const db = fastify.mongo.client.db()
        const eventos = await db.collection('eventos').find().toArray()
        reply.status(200).send({message:'Sucesso ao buscar dados', Data: eventos})
        return eventos;
      } catch(err){
        return reply.status(500).send({message:'Error ao buscar dados do banco de dados'})
      }
    })
  // Rota para criar novo evento
  fastify.post('/eventos', async (request, reply) => {  
    try {
      const eventData = request.body;
        console.log(eventData)
      // Adicionar informações do usuário autenticado
      const evento = {
        ...eventData,
        user: request.userId ,
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
        data: novoEvento
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
}