import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeds...');

  // Limpar dados
  console.log('🗑️  Limpando dados antigos...');
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.plan.deleteMany();

  // Criar Planos
  console.log('📦 Criando planos...');
  const planFree = await prisma.plan.create({
    data: {
      name: 'Free',
      type: 'FREE',
      maxUsers: 2,
      maxCandidates: 10,
      maxVacancies: 2,
      price: 0,
      features: ['2 usuários', '10 candidatos', '2 vagas'],
      isActive: true,
    },
  });

  const planBasic = await prisma.plan.create({
    data: {
      name: 'Básico',
      type: 'BASIC',
      maxUsers: 5,
      maxCandidates: 50,
      maxVacancies: 10,
      price: 99.90,
      features: ['5 usuários', '50 candidatos', '10 vagas', 'Suporte'],
      isActive: true,
    },
  });

  // Criar Empresas
  console.log('🏢 Criando empresas...');
  const company1 = await prisma.company.create({
    data: {
      name: 'Tech Solutions',
      domain: 'techsolutions.com',
      status: 'ACTIVE',
      planId: planBasic.id,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'Innovation Corp',
      domain: 'innovationcorp.com',
      status: 'ACTIVE',
      planId: planFree.id,
    },
  });

  // Criar Usuários
  console.log('👥 Criando usuários...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@multione.digital',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      companyId: company1.id,
    },
  });

  // Master
  const master = await prisma.user.create({
    data: {
      name: 'Master User',
      email: 'master@multione.digital',
      password: hashedPassword,
      role: 'MANAGER',
      status: 'ACTIVE',
      companyId: company1.id,
    },
  });

  // Recruiter
  const recruiter = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@techsolutions.com',
      password: await bcrypt.hash('senha123', 10),
      role: 'RECRUITER',
      status: 'ACTIVE',
      companyId: company1.id,
    },
  });

  // Viewer
  const viewer = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@innovationcorp.com',
      password: await bcrypt.hash('senha123', 10),
      role: 'VIEWER',
      status: 'ACTIVE',
      companyId: company2.id,
    },
  });

  console.log('✅ Seeds concluídos!');
  console.log('');
  console.log('📊 Resumo:');
  console.log(`   • Planos: 2`);
  console.log(`   • Empresas: 2`);
  console.log(`   • Usuários: 4`);
  console.log('');
  console.log('🔑 Credenciais de Teste:');
  console.log(`   Admin: admin@multione.digital / admin123`);
  console.log(`   Master: master@multione.digital / admin123`);
  console.log(`   Recruiter: joao@techsolutions.com / senha123`);
  console.log(`   Viewer: maria@innovationcorp.com / senha123`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
