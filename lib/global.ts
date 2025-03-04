import { PrismaClient } from '@prisma/client';

const prismaSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaSingleton();

const global = { prisma };
export default global;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
