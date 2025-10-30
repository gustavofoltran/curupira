# Curupira Frontend

Aplicação frontend desenvolvida com React + TypeScript + Vite.

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js 20 ou superior
- Yarn

### Desenvolvimento local

1. Instalar dependências:
```bash
yarn install
```

2. Rodar em modo desenvolvimento:
```bash
yarn dev
```

3. Acessar: `http://localhost:3000`

### Build para produção

```bash
yarn build:prod
```

### Docker

1. Build e execução com Docker Compose:
```bash
docker compose up --build
```

2. Ou com Docker direto:
```bash
docker build -t curupira-frontend .
docker run -p 3000:3000 curupira-frontend
```

3. Acessar: `http://localhost:3000`

## 📝 Scripts disponíveis

- `yarn dev` - Modo desenvolvimento
- `yarn build:dev` - Build para desenvolvimento
- `yarn build:hml` - Build para homologação
- `yarn build:prod` - Build para produção
- `yarn preview` - Preview do build de produção
- `yarn lint` - Executar linter
- `yarn prettier` - Formatar código
