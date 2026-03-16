# FaceRecognition

Projeto de demonstração de autenticação por reconhecimento facial e credenciais.

Conteúdo
- `face-auth/`: frontend React + Vite que usa `face-api.js` para capturar e extrair descriptors faciais.
- `server/`: backend Node (Express) em TypeScript, sqlite para armazenar usuários.

Requisitos
- Node.js (>=16)

Como rodar (desenvolvimento)

1) Backend

```bash
cd server
npm install
npm run dev
# API disponível em http://localhost:3333
```

2) Frontend

```bash
cd face-auth
npm install
npm run dev
```

Observações sobre HTTPS / Mixed content
- O frontend roda em HTTPS (se você gerar certificados locais em `face-auth/certs`).
- Para evitar mixed-content o Vite está configurado para proxy `/api` → `VITE_API_TARGET` (por padrão `http://localhost:3333`).
- Exemplo para apontar para outro host:

```bash
VITE_API_TARGET=http://localhost:3333 npm run dev
```

Gerar certificados (opcional, Fedora / mkcert)

```bash
# instale mkcert e gere certs na raiz do projeto face-auth
mkcert -install
mkdir -p face-auth/certs
mkcert -key-file face-auth/certs/localhost.key -cert-file face-auth/certs/localhost.crt localhost 127.0.0.1 ::1
```

Modelos do face-api
- Os pesos ficam em `face-auth/public/models/` já incluídos no repositório.

API endpoints principais
- `POST /auth/register` — registra usuário com `name, email, password, descriptor` (descriptor é array de números).
- `POST /auth/login` — login por descriptor (face).
- `POST /auth/login-credentials` — login por `email` + `password`.
- `GET /debug/users` — lista de usuários (apenas dev).

Notas de segurança
- Senhas são armazenadas em texto neste protótipo. NÃO usar em produção. Recomenda-se hashear (bcrypt) antes de persistir.
- NÃO comite chaves privadas (`certs/localhost.key`). Adicione `certs/` ao `.gitignore`.

Melhorias recomendadas
- Hash de senhas com `bcrypt` no backend.
- Autenticação com sessão/JWT para persistência de login.
- Validação de payloads com `zod`/`joi`.

Contato
- Repositório: https://github.com/Otavio-Emanoel/FaceRecognition
