import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedCandidates() {
  console.log('👥 Criando candidatos...');

  // Buscar empresas
  const companies = await prisma.company.findMany();
  if (companies.length === 0) {
    console.log('⚠️  Nenhuma empresa encontrada. Pulando seeds de candidatos.');
    return;
  }

  const company1 = companies[0];

  // Criar Skills
  const skills = await Promise.all([
    prisma.skill.upsert({
      where: { name: 'JavaScript' },
      update: {},
      create: { name: 'JavaScript', category: 'Frontend' },
    }),
    prisma.skill.upsert({
      where: { name: 'React' },
      update: {},
      create: { name: 'React', category: 'Frontend' },
    }),
    prisma.skill.upsert({
      where: { name: 'Node.js' },
      update: {},
      create: { name: 'Node.js', category: 'Backend' },
    }),
    prisma.skill.upsert({
      where: { name: 'Python' },
      update: {},
      create: { name: 'Python', category: 'Backend' },
    }),
    prisma.skill.upsert({
      where: { name: 'SQL' },
      update: {},
      create: { name: 'SQL', category: 'Database' },
    }),
  ]);

  // Criar Candidatos
  const candidate1 = await prisma.candidate.create({
    data: {
      name: 'Carlos Eduardo',
      email: 'carlos@email.com',
      phone: '+55 11 98765-4321',
      status: 'ACTIVE',
      companyId: company1.id,
      candidateSkills: {
        create: [
          {
            skillId: skills[0].id,
            level: 'ADVANCED',
            yearsOfExperience: 5,
          },
          {
            skillId: skills[1].id,
            level: 'EXPERT',
            yearsOfExperience: 4,
          },
        ],
      },
      experiences: {
        create: [
          {
            company: 'Tech Solutions',
            position: 'Senior Frontend Developer',
            description: 'Desenvolvimento de aplicações React',
            startDate: new Date('2020-01-01'),
            isCurrent: true,
          },
          {
            company: 'StartupXYZ',
            position: 'Frontend Developer',
            description: 'Desenvolvimento web',
            startDate: new Date('2018-01-01'),
            endDate: new Date('2019-12-31'),
            isCurrent: false,
          },
        ],
      },
      educations: {
        create: [
          {
            institution: 'USP',
            degree: 'Ciência da Computação',
            fieldOfStudy: 'Engenharia de Software',
            level: 'BACHELOR',
            status: 'COMPLETED',
            startDate: new Date('2014-01-01'),
            endDate: new Date('2017-12-31'),
          },
        ],
      },
    },
  });

  const candidate2 = await prisma.candidate.create({
    data: {
      name: 'Ana Paula Silva',
      email: 'ana.silva@email.com',
      phone: '+55 11 91234-5678',
      status: 'IN_PROCESS',
      companyId: company1.id,
      candidateSkills: {
        create: [
          {
            skillId: skills[2].id,
            level: 'INTERMEDIATE',
            yearsOfExperience: 2,
          },
          {
            skillId: skills[3].id,
            level: 'ADVANCED',
            yearsOfExperience: 3,
          },
        ],
      },
      experiences: {
        create: [
          {
            company: 'Data Corp',
            position: 'Backend Developer',
            description: 'Desenvolvimento de APIs',
            startDate: new Date('2022-01-01'),
            isCurrent: true,
          },
        ],
      },
      educations: {
        create: [
          {
            institution: 'UNICAMP',
            degree: 'Engenharia de Software',
            level: 'MASTER',
            status: 'IN_PROGRESS',
            startDate: new Date('2023-01-01'),
          },
        ],
      },
    },
  });

  console.log(`✅ Candidatos criados: ${candidate1.name}, ${candidate2.name}`);
  return { candidate1, candidate2 };
}

async function main() {
  console.log('🌱 Iniciando seeds...');
  console.log('');
  console.log('⚠️  =============================================');
  console.log('⚠️  ATENÇÃO: Usando senhas FRACAS para DESENVOLVIMENTO');
  console.log('⚠️  NUNCA use essas senhas em PRODUÇÃO!');
  console.log('⚠️  =============================================');
  console.log('');

  // Limpar dados
  console.log('🗑️  Limpando dados antigos...');
  await prisma.application.deleteMany();
  await prisma.candidateSkill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.skill.deleteMany();
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
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@multione.digital',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      companyId: company1.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Master User',
      email: 'master@multione.digital',
      password: hashedPassword,
      role: 'MANAGER',
      status: 'ACTIVE',
      companyId: company1.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@techsolutions.com',
      password: await bcrypt.hash('Senha@123', 10),
      role: 'RECRUITER',
      status: 'ACTIVE',
      companyId: company1.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@innovationcorp.com',
      password: await bcrypt.hash('Senha@123', 10),
      role: 'VIEWER',
      status: 'ACTIVE',
      companyId: company2.id,
    },
  });

  // Criar Candidatos
  await seedCandidates();

  console.log('✅ Seeds concluídos!');
  console.log('');
  console.log('📊 Resumo:');
  console.log(`   • Planos: 2`);
  console.log(`   • Empresas: 2`);
  console.log(`   • Usuários: 4`);
  console.log(`   • Candidatos: 2`);
  console.log(`   • Skills: 5`);
  console.log('');
  console.log('🔑 Credenciais de Teste (DESENVOLVIMENTO):');
  console.log(`   Admin: admin@multione.digital / Admin@123`);
  console.log(`   Master: master@multione.digital / Admin@123`);
  console.log(`   Recruiter: joao@techsolutions.com / Senha@123`);
  console.log(`   Viewer: maria@innovationcorp.com / Senha@123`);
  console.log('');
  console.log('⚠️  LEMBRE-SE: Altere essas senhas em PRODUÇÃO!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
