import fastify from 'fastify';
import { eventosRoutes } from './routes/events.js';

const app = fastify({
    logger:{
        transport:{
            target: 'pino-pretty'
        }
    }
});

app.get('/',async(request,reply)=>{
    return reply.status(200).send({message:'Servidor rodando!'})
})

app.register(eventosRoutes)

app.listen({
    host:'0.0.0.0',
    port:4000
}, (err,address) =>{ 
    if(err){
        app.log.info(err);
        process.exit(1);
    }
    app.log.info('Servidor rodando em: '+address);
})