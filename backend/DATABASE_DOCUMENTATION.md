# 📚 Documentação do Banco de Dados - Talents-MultiOne

## 📊 Resumo

- **Total de Tabelas:** 13
- **Total de Enums:** 14
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL

---

## 🗂️ Tabelas

### 1. Plans (Planos)
Gerencia os planos de assinatura disponíveis.

**Campos:**
- `id`: UUID (PK)
- `name`: Nome do plano
- `type`: Tipo (FREE, BASIC, PREMIUM, ENTERPRISE)
- `maxUsers`: Máximo de usuários
- `maxCandidates`: Máximo de candidatos
- `maxVacancies`: Máximo de vagas
- `price`: Preço (Decimal)
- `features`: Lista de funcionalidades
- `isActive`: Ativo/Inativo

**Relacionamentos:**
- `1:N` com Companies

---

### 2. Companies (Empresas)
Empresas cadastradas no sistema.

**Campos:**
- `id`: UUID (PK)
- `name`: Nome da empresa
- `domain`: Domínio único
- `status`: Status (ACTIVE, INACTIVE, SUSPENDED)
- `planId`: ID do plano (FK)

**Relacionamentos:**
- `N:1` com Plan
- `1:N` com Users
- `1:N` com Candidates
- `1:N` com Vacancies

---

### 3. Users (Usuários)
Usuários do sistema (recrutadores, admins, etc).

**Campos:**
- `id`: UUID (PK)
- `name`: Nome
- `email`: Email único
- `password`: Senha (hash)
- `role`: Papel (ADMIN, RECRUITER, MANAGER, VIEWER)
- `status`: Status (ACTIVE, INACTIVE, SUSPENDED)
- `companyId`: ID da empresa (FK)

**Relacionamentos:**
- `N:1` com Company
- `1:N` com Interviews
- `1:N` com AuditLogs

---

### 4. Candidates (Candidatos)
Candidatos cadastrados.

**Campos:**
- `id`: UUID (PK)
- `name`: Nome
- `email`: Email
- `phone`: Telefone (opcional)
- `resume`: Link do currículo (opcional)
- `status`: Status
- `companyId`: ID da empresa (FK)

**Relacionamentos:**
- `N:1` com Company
- `1:N` com CandidateSkills
- `1:N` com Experiences
- `1:N` com Educations
- `1:N` com Applications

---

### 5. Skills (Habilidades)
Skills técnicas e comportamentais.

**Campos:**
- `id`: UUID (PK)
- `name`: Nome da skill (único)
- `category`: Categoria (opcional)

**Relacionamentos:**
- `1:N` com CandidateSkills
- `1:N` com VacancySkills

---

### 6. CandidateSkills
Relacionamento entre candidatos e suas skills.

**Campos:**
- `id`: UUID (PK)
- `candidateId`: ID do candidato (FK)
- `skillId`: ID da skill (FK)
- `level`: Nível (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `yearsOfExperience`: Anos de experiência

---

### 7. Experiences (Experiências)
Experiências profissionais dos candidatos.

**Campos:**
- `id`: UUID (PK)
- `candidateId`: ID do candidato (FK)
- `company`: Nome da empresa
- `position`: Cargo
- `description`: Descrição (opcional)
- `startDate`: Data de início
- `endDate`: Data de término (opcional)
- `isCurrent`: Trabalho atual?

---

### 8. Educations (Educação)
Formação acadêmica dos candidatos.

**Campos:**
- `id`: UUID (PK)
- `candidateId`: ID do candidato (FK)
- `institution`: Instituição
- `degree`: Curso
- `fieldOfStudy`: Área de estudo (opcional)
- `level`: Nível (HIGH_SCHOOL, BACHELOR, MASTER, etc)
- `status`: Status (IN_PROGRESS, COMPLETED, INCOMPLETE)
- `startDate`: Data de início
- `endDate`: Data de término (opcional)

---

### 9. Vacancies (Vagas)
Vagas abertas pelas empresas.

**Campos:**
- `id`: UUID (PK)
- `title`: Título da vaga
- `description`: Descrição
- `type`: Tipo (CLT, PJ, INTERNSHIP, etc)
- `workModel`: Modelo (REMOTE, ONSITE, HYBRID)
- `status`: Status (DRAFT, OPEN, CLOSED, CANCELLED)
- `salary`: Salário (opcional)
- `location`: Localização (opcional)
- `companyId`: ID da empresa (FK)
- `closedAt`: Data de fechamento (opcional)

**Relacionamentos:**
- `N:1` com Company
- `1:N` com VacancySkills
- `1:N` com Applications

---

### 10. VacancySkills
Skills requeridas para cada vaga.

**Campos:**
- `id`: UUID (PK)
- `vacancyId`: ID da vaga (FK)
- `skillId`: ID da skill (FK)
- `isRequired`: Obrigatória?
- `minimumLevel`: Nível mínimo

---

### 11. Applications (Candidaturas)
Candidaturas dos candidatos às vagas.

**Campos:**
- `id`: UUID (PK)
- `candidateId`: ID do candidato (FK)
- `vacancyId`: ID da vaga (FK)
- `status`: Status (PENDING, IN_REVIEW, etc)
- `notes`: Notas (opcional)
- `appliedAt`: Data da candidatura

**Relacionamentos:**
- `N:1` com Candidate
- `N:1` com Vacancy
- `1:N` com Interviews

---

### 12. Interviews (Entrevistas)
Entrevistas agendadas.

**Campos:**
- `id`: UUID (PK)
- `applicationId`: ID da candidatura (FK)
- `interviewerId`: ID do entrevistador (FK)
- `type`: Tipo (PHONE, VIDEO, IN_PERSON, etc)
- `status`: Status (SCHEDULED, COMPLETED, etc)
- `scheduledAt`: Data agendada
- `duration`: Duração em minutos
- `location`: Local (opcional)
- `notes`: Notas (opcional)

**Relacionamentos:**
- `N:1` com Application
- `N:1` com User (entrevistador)

---

### 13. AuditLogs (Logs de Auditoria)
Rastreamento de ações no sistema.

**Campos:**
- `id`: UUID (PK)
- `userId`: ID do usuário (FK)
- `action`: Ação realizada
- `entity`: Entidade afetada
- `entityId`: ID da entidade (opcional)
- `oldData`: Dados antigos (JSON, opcional)
- `newData`: Dados novos (JSON, opcional)
- `ip`: IP do usuário (opcional)
- `userAgent`: User Agent (opcional)
- `createdAt`: Data/hora da ação

**Relacionamentos:**
- `N:1` com User

---

## 📋 Enums

1. **UserRole:** ADMIN, RECRUITER, MANAGER, VIEWER
2. **UserStatus:** ACTIVE, INACTIVE, SUSPENDED
3. **PlanType:** FREE, BASIC, PREMIUM, ENTERPRISE
4. **CompanyStatus:** ACTIVE, INACTIVE, SUSPENDED
5. **CandidateStatus:** ACTIVE, IN_PROCESS, HIRED, REJECTED, INACTIVE
6. **VacancyStatus:** DRAFT, OPEN, CLOSED, CANCELLED
7. **VacancyType:** CLT, PJ, INTERNSHIP, TEMPORARY, FREELANCE
8. **WorkModel:** REMOTE, ONSITE, HYBRID
9. **ApplicationStatus:** PENDING, IN_REVIEW, INTERVIEW_SCHEDULED, APPROVED, REJECTED, WITHDRAWN
10. **InterviewType:** PHONE, VIDEO, IN_PERSON, TECHNICAL, HR
11. **InterviewStatus:** SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED, NO_SHOW
12. **SkillLevel:** BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
13. **EducationLevel:** HIGH_SCHOOL, TECHNICAL, ASSOCIATE, BACHELOR, MASTER, DOCTORATE
14. **EducationStatus:** IN_PROGRESS, COMPLETED, INCOMPLETE

---

## 🔗 Diagrama de Relacionamentos
```
Plan (1) ─── (N) Company (1) ─┬─ (N) User
                               ├─ (N) Candidate ─┬─ (N) CandidateSkill ─── (N) Skill
                               │                 ├─ (N) Experience
                               │                 ├─ (N) Education
                               │                 └─ (N) Application ─── (N) Interview
                               └─ (N) Vacancy ─── (N) VacancySkill ─── (N) Skill
```

---

## 🚀 Comandos Úteis

### Ver tabelas:
```bash
npx prisma studio
```

### Criar nova migration:
```bash
npx prisma migrate dev --name nome_da_migration
```

### Resetar banco (CUIDADO!):
```bash
npx prisma migrate reset
```

### Executar seeds:
```bash
npx prisma db seed
```

---

## 📝 Notas

- Todas as datas são UTC
- IDs são UUID v4
- Senhas são armazenadas com bcrypt (hash)
- Delete cascade ativo em alguns relacionamentos
- Campos opcionais marcados com `?`

---

**Criado por:** Pessoa 1  
**Data:** $(date +%Y-%m-%d)  
**Versão:** 1.0
