const eventos = [
    {
        content: "Evento 1",
    }
]

export async function eventosRoutes(app) {
    app.get('/eventos',async(request,reply)=>{
        return reply.status(200).send({eventos})
    })
}