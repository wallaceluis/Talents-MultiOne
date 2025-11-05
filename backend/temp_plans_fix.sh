# Remover linhas que referenciam type e isActive que não existem
sed -i '14d' src/plans/plans.service.ts  # Remove linha do type
sed -i '19,20d' src/plans/plans.service.ts  # Remove throw com type
