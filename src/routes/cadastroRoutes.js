export const users = []

export async function cadastroUsers(app) {
   app.get('/cadastro', async (request,reply)=>{
        return reply.status(200).sendFile('cadastro.html')
   }) 

   app.post('/cadastro',async(request,reply)=>{
        const {nome,email,password} = request.body
        console.log(request.headers)
        console.log(request.body)
        const newUser = {
            id: users.length + 1,
            nome: nome,
            email: email, 
            password: password
        }
        users.push(newUser)
        console.log(users)
        return reply.status(201).send({mensagem:users})
   })
}  