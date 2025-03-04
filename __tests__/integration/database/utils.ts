import global from '@/lib/global';

const prisma = global.prisma;

export async function clearAllData() {
  return prisma.user.deleteMany();
}
