import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path'
import { fileURLToPath } from 'url';
import { eventosRoutes } from './routes/events.js';
import { cadastroUsers } from './routes/cadastroRoutes.js';
import { loginUsers } from './routes/loginRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
    logger:{
        transport:{
            target: 'pino-pretty'
        }
    }
});

await fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'), // Ajuste o caminho
    prefix: '/' // Mantém a URL que você usa no HTML
});

fastify.register(loginUsers)
fastify.register(eventosRoutes)
fastify.register(cadastroUsers)

fastify.listen({
    host:'0.0.0.0',
    port:4000
}, (err,address) =>{ 
    if(err){
        fastify.log.info(err);
        process.exit(1);
    }
    fastify.log.info('Servidor rodando em: '+address);
})