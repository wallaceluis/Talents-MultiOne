import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpar dados existentes
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.vacancySkill.deleteMany();
  await prisma.candidateSkill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.vacancy.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.plan.deleteMany();

  // 1. Criar Skills
  const jsSkill = await prisma.skill.create({ data: { name: 'JavaScript' } });
  const reactSkill = await prisma.skill.create({ data: { name: 'React' } });
  const nodeSkill = await prisma.skill.create({ data: { name: 'Node.js' } });
  const pythonSkill = await prisma.skill.create({ data: { name: 'Python' } });
  const sqlSkill = await prisma.skill.create({ data: { name: 'SQL' } });
  console.log('✅ Skills criadas');

  // 2. Criar Planos
  const freePlan = await prisma.plan.create({
    data: { name: 'FREE', maxVacancies: 2, maxCandidates: 10, maxUsers: 2, price: 0 },
  });
  const basicPlan = await prisma.plan.create({
    data: { name: 'BASIC', maxVacancies: 10, maxCandidates: 50, maxUsers: 5, price: 99.90 },
  });
  const premiumPlan = await prisma.plan.create({
    data: { name: 'PREMIUM', maxVacancies: 50, maxCandidates: 200, maxUsers: 20, price: 299.90 },
  });
  console.log('✅ Planos criados');

  // 3. Criar Empresas
  const multione = await prisma.company.create({
    data: { name: 'Multione Marketing', domain: 'multione.digital', status: 'ACTIVE', planId: premiumPlan.id },
  });
  const techsolutions = await prisma.company.create({
    data: { name: 'Tech Solutions', domain: 'techsolutions.com', status: 'ACTIVE', planId: basicPlan.id },
  });
  console.log('✅ Empresas criadas');

  // 4. Criar Usuários
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('Senha@123', 10);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@multione.digital',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      companyId: multione.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Master User',
      email: 'master@multione.digital',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      companyId: multione.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@techsolutions.com',
      password: userPassword,
      role: 'RECRUITER',
      status: 'ACTIVE',
      companyId: techsolutions.id,
    },
  });
  console.log('✅ Usuários criados');

  // 5. Criar Candidatos
  const candidate1 = await prisma.candidate.create({
    data: {
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      phone: '(11) 98765-4321',
      status: 'ACTIVE',
      companyId: multione.id,
      experiences: {
        create: [
          {
            company: 'Tech Corp',
            position: 'Desenvolvedor Full Stack',
            description: 'Desenvolvimento de aplicações web',
            startDate: new Date('2020-01-01'),
            current: true,
          },
          {
            company: 'StartUp XYZ',
            position: 'Desenvolvedor Junior',
            startDate: new Date('2018-01-01'),
            endDate: new Date('2019-12-31'),
            current: false,
          },
        ],
      },
      educations: {
        create: [
          {
            institution: 'Universidade Federal',
            degree: 'Bacharelado',
            field: 'Engenharia de Software',
            startDate: new Date('2014-01-01'),
            endDate: new Date('2018-12-31'),
            current: false,
          },
        ],
      },
    },
  });

  await prisma.candidateSkill.createMany({
    data: [
      { candidateId: candidate1.id, skillId: jsSkill.id },
      { candidateId: candidate1.id, skillId: reactSkill.id },
      { candidateId: candidate1.id, skillId: nodeSkill.id },
    ],
  });

  const candidate2 = await prisma.candidate.create({
    data: {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      phone: '(11) 91234-5678',
      status: 'ACTIVE',
      companyId: techsolutions.id,
      experiences: {
        create: [
          {
            company: 'Data Corp',
            position: 'Cientista de Dados',
            startDate: new Date('2019-01-01'),
            current: true,
          },
        ],
      },
      educations: {
        create: [
          {
            institution: 'USP',
            degree: 'Mestrado',
            field: 'Ciência da Computação',
            startDate: new Date('2017-01-01'),
            endDate: new Date('2019-12-31'),
            current: false,
          },
        ],
      },
    },
  });

  await prisma.candidateSkill.createMany({
    data: [
      { candidateId: candidate2.id, skillId: pythonSkill.id },
      { candidateId: candidate2.id, skillId: sqlSkill.id },
    ],
  });
  console.log('✅ Candidatos criados');

  // 6. Criar Vagas
  const vacancy1 = await prisma.vacancy.create({
    data: {
      title: 'Desenvolvedor Full Stack Senior',
      description: 'Vaga para desenvolvedor experiente em React e Node.js. Mínimo 3 anos de experiência.',
      location: 'São Paulo - SP',
      type: 'FULL_TIME',
      status: 'OPEN',
      salary: 10000,
      companyId: multione.id,
    },
  });

  await prisma.vacancySkill.createMany({
    data: [
      { vacancyId: vacancy1.id, skillId: jsSkill.id },
      { vacancyId: vacancy1.id, skillId: reactSkill.id },
      { vacancyId: vacancy1.id, skillId: nodeSkill.id },
    ],
  });
  console.log('✅ Vagas criadas');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
