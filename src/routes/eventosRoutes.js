
export  async function eventosUsers(app,opt) {
    app.get('/eventos',(request,reply)=>{
        return reply.status(200).sendFile('eventos.html')
    })
}