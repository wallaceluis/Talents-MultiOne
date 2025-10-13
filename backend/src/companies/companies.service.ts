import { Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
    constructor(private readonly prisma: PrismaService) {}

    // Criar nova empresa
    async create(createCompanyDto: CreateCompanyDto) {
            return await this.prisma.company.create({
                data: {
                    name: createCompanyDto.name,
                    domain: createCompanyDto.domain,
                },
            });
        }  

     //Listar todas as empresas
     async findAll() {
        return await this.prisma.company.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
     }

     // Buscar uma empresa específica por ID
     async findOne(id: string) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });

        if (!company) {
            throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
        }

        return company;
    }

    //Atualizar empresa
     async update(id: string, updateCompanyDto: UpdateCompanyDto) {
        await this.findOne(id); // verifica se a empresa existe

            return await this.prisma.company.update({
                where: { id },
                data: updateCompanyDto,
            });
        }   

     //remover empresa
     async remove(id: string) {
        await this.findOne(id); // verifica se a empresa existe

        await this.prisma.company.delete({
            where: { id },
        });
            
        return {
            message: 'Empresa removida com sucesso',
            id
        };
    }
}    