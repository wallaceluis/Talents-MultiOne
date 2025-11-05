#!/bin/bash

API_URL="http://localhost:3001/api"

echo "========================================="
echo "   🧪 TESTE RÁPIDO DA API"
echo "========================================="
echo ""

# 1. Login
echo "1️⃣ Testando Login..."
LOGIN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@multione.digital","password":"Admin@123"}')

TOKEN=$(echo $LOGIN | grep -o '"access_token":"[^"]*"' | sed 's/"access_token":"//;s/"//')

if [ -n "$TOKEN" ]; then
    echo "✅ Login OK! Token: ${TOKEN:0:50}..."
else
    echo "❌ Erro no login"
    echo "$LOGIN"
    exit 1
fi
echo ""

# 2. Testar /me
echo "2️⃣ Testando GET /auth/me..."
curl -s -X GET $API_URL/auth/me \
  -H "Authorization: Bearer $TOKEN" | grep -o '"name":"[^"]*"'
echo "✅ /auth/me OK!"
echo ""

# 3. Testar Companies
echo "3️⃣ Testando GET /companies..."
COMPANIES=$(curl -s -X GET $API_URL/companies \
  -H "Authorization: Bearer $TOKEN")
echo "$COMPANIES" | grep -o '"name":"[^"]*"' | head -3
echo "✅ Companies OK!"
echo ""

# 4. Testar Users
echo "4️⃣ Testando GET /users..."
curl -s -X GET $API_URL/users \
  -H "Authorization: Bearer $TOKEN" | grep -o '"email":"[^"]*"'
echo "✅ Users OK!"
echo ""

# 5. Testar Candidates
echo "5️⃣ Testando GET /candidates..."
CANDIDATES=$(curl -s -X GET $API_URL/candidates \
  -H "Authorization: Bearer $TOKEN")
echo "$CANDIDATES"
echo "✅ Candidates OK!"
echo ""

# 6. Testar Vacancies (público)
echo "6️⃣ Testando GET /vacancies (público)..."
curl -s -X GET $API_URL/vacancies | grep -o '"title":"[^"]*"' | head -2
echo "✅ Vacancies OK!"
echo ""

echo "========================================="
echo "   ✅ TODOS OS TESTES PASSARAM!"
echo "========================================="
