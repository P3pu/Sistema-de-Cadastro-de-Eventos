import fastifyMongodb from "@fastify/mongodb";
import dotenv from "dotenv";

dotenv.config()

export default async function dbConfig(fastify, options) {
  // ✅ SEM await aqui!
  fastify.register(fastifyMongodb, {
    url: process.env.MONGO_URL,
    forceClose: true
  })
  
}