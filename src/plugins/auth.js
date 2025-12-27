import fp from 'fastify-plugin';

async function authPlugin(fastify, opts) {
    // Decorator para verificar autenticação
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            const userId = request.session.get('userId');
            
            if (!userId) {
                return reply.redirect('/');
            }
            
            // Adiciona userId ao request para uso nas rotas
            request.userId = userId;
            request.userName = request.session.get('userName');
            request.userEmail = request.session.get('userEmail');
            
        } catch (error) {
            return reply.redirect('/');
        }
    });
}

export default fp(authPlugin);