import bcrypt from 'bcrypt'

export async function loginUsers(app) {
    app.get('/', async (request, reply) => {
        try{
            const userId = request.session.get('userId')
            if(userId){
                return reply.redirect('/eventos')
            }
            return reply.status(200).sendFile('login.html')
        }catch(error){
            return reply.status(500).send({message:'Rota de Login', error: error.message})
        }
    })
    app.post('/', async (request, reply) => {
        try {
            const { email, password } = request.body

            if (!email || !password) {
                alert('Dados Inválidos')
                //return reply.status(400).send({ message: 'Dados Inválidos' })
            }

            const db = app.mongo.client.db()
            const user = await db.collection('users').findOne({
                email: email.toLowerCase()
            })

            if (!user) {
                alert('Dados Inválidos')

                // return reply.status(401).send({ message: "Dados Inválidos" })
            }

            const passwordCheck = await bcrypt.compare(password, user.password)

            if (!passwordCheck) {
                alert('Dados Inválidos')

                //return reply.status(401).send({ message: "Dados Inválidos" })
            }

            request.session.set('userId', user._id.toString());
            request.session.set('userName', user.nome);
            request.session.set('userEmail', user.email);
            return reply.redirect('/eventos')
        } catch (error) {
            return reply.status(500).send({ message: `Error ao logar: ${error.message}` })
        }
    })

}