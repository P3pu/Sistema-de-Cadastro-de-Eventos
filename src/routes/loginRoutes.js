import { users } from "./cadastroRoutes.js"


export async function loginUsers(app) {
   app.get('/',async(request,reply)=>{
         users.forEach((user,index) => {
           console.log(user[index]) 
        });
       return reply.status(200).sendFile('login.html')
   })
   
    app.post('/login',async (request,reply)=>{
        const {email,password} = request.body
        users.forEach((user,index) => {
            console.log(user[index].nome)
        });
        return reply.status(200).send({mensagem:users})
    })
}