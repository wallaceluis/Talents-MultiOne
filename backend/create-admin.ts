import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email: 'admin@multione.digital' }
    });

    if (existing) {
      console.log('✅ Usuário admin já existe!');
      return;
    }

    // Buscar uma empresa existente
    const company = await prisma.company.findFirst();
    
    if (!company) {
      console.log('❌ Nenhuma empresa encontrada. Criando uma...');
      
      // Criar plano
      const plan = await prisma.plan.create({
        data: {
          name: 'Básico',
          type: 'BASIC',
          maxUsers: 5,
          maxCandidates: 50,
          maxVacancies: 10,
          price: 99.90,
          features: ['5 usuários', '50 candidatos'],
          isActive: true,
        },
      });

      // Criar empresa
      const newCompany = await prisma.company.create({
        data: {
          name: 'Tech Solutions',
          domain: 'techsolutions.com',
          status: 'ACTIVE',
          planId: plan.id,
        },
      });

      // Criar usuário
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@multione.digital',
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          companyId: newCompany.id,
        },
      });

      console.log('✅ Usuário admin criado com sucesso!');
    } else {
      // Criar usuário com empresa existente
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@multione.digital',
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          companyId: company.id,
        },
      });

      console.log('✅ Usuário admin criado com sucesso!');
    }

    console.log('');
    console.log('🔑 Credenciais:');
    console.log('   Email: admin@multione.digital');
    console.log('   Senha: Admin@123');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
