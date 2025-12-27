export async function eventosUsers(app, opt) {
    // Hook para proteger todas as rotas deste arquivo
    app.addHook('onRequest', app.authenticate);
    
    // ✅ Adicione async aqui
    app.get('/eventos', async (request, reply) => {
        return reply.sendFile('eventos.html');
    });
}