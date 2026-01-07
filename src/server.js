import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import fastifyMongodb from '@fastify/mongodb';
import fastifyFormbody from '@fastify/formbody'; // ✅ Adicione
import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url';
import { cadastroUsers } from './routes/cadastroRoutes.js';
import { loginUsers } from './routes/loginRoutes.js';
import { eventosUsers } from './routes/eventosRoutes.js';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import authPlugin from './plugins/auth.js';

dotenv.config();

const PORT = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
});

async function start() {
  try {
    // 1. CORS
    await fastify.register(fastifyCors, {
      origin: true
    });

    // 2. ✅ Parser de formulários (ADICIONE ISSO!)
    await fastify.register(fastifyFormbody);

    // 3. Static files
    await fastify.register(fastifyStatic, {
      root: path.join(__dirname, 'public'),
      prefix: '/'
    });

    await fastify.register(fastifyCookie)
    await fastify.register(fastifySession,{
      secret: process.env.SESSION_SECRET,
      cookie: {
        secure: false,
        httpOnly:true,
        maxAge: 1000 * 60 * 60,
        sameSite:'lax'
      }

    })

    // 4. MongoDB
    console.log('🔍 Conectando ao MongoDB...')
    
    await fastify.register(fastifyMongodb, {
      url: process.env.MONGO_URL,
      forceClose: true
    });
    console.log(fastify.printRoutes());
    await fastify.register(authPlugin)
    // 5. Registrar rotas
    console.log('📍 Registrando rotas...')
    await fastify.register(loginUsers);
    await fastify.register(cadastroUsers);
    await fastify.register(eventosUsers);
    
    // 6. Hook para criar índice
    fastify.addHook('onReady', async () => {
      try {
        const db = fastify.mongo.client.db();
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        console.log('✅ Índice criado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao criar índice:', error);
      }
    });

    // 7. Iniciar servidor
    fastify.listen({
      host: '0.0.0.0',
      port: PORT
    });

    console.log('🚀 Servidor rodando em: http://localhost:4000');
    console.log('✅ MongoDB conectado');
    
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    fastify.log.error(err);
    process.exit(1);
  }
}

start();