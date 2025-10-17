import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeds...');

  // Limpar dados existentes
  console.log('🗑️  Limpando dados antigos...');
  await prisma.auditLog.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.vacancySkill.deleteMany();
  await prisma.vacancy.deleteMany();
  await prisma.candidateSkill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.plan.deleteMany();

  // 1. Criar Planos
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
      features: ['5 usuários', '50 candidatos', '10 vagas', 'Suporte por email'],
      isActive: true,
    },
  });

  const planPremium = await prisma.plan.create({
    data: {
      name: 'Premium',
      type: 'PREMIUM',
      maxUsers: 20,
      maxCandidates: 200,
      maxVacancies: 50,
      price: 299.90,
      features: ['20 usuários', '200 candidatos', '50 vagas', 'Suporte prioritário', 'Relatórios avançados'],
      isActive: true,
    },
  });

  // 2. Criar Empresas
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
      planId: planPremium.id,
    },
  });

  // 3. Criar Skills
  console.log('🛠️  Criando skills...');
  const skillJS = await prisma.skill.create({
    data: { name: 'JavaScript', category: 'Frontend' },
  });

  const skillReact = await prisma.skill.create({
    data: { name: 'React', category: 'Frontend' },
  });

  const skillNode = await prisma.skill.create({
    data: { name: 'Node.js', category: 'Backend' },
  });

  const skillPython = await prisma.skill.create({
    data: { name: 'Python', category: 'Backend' },
  });

  const skillSQL = await prisma.skill.create({
    data: { name: 'SQL', category: 'Database' },
  });

  console.log('✅ Seeds concluídos!');
  console.log('');
  console.log('📊 Resumo:');
  console.log(`   • Planos: 3`);
  console.log(`   • Empresas: 2`);
  console.log(`   • Skills: 5`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seeds:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
