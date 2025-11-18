# APIs Curupira

Estrutura de APIs TypeScript baseada na documentação OpenAPI do backend.

## Estrutura

```
apis/
├── types/
│   └── index.ts          # Tipos TypeScript baseados no schema OpenAPI
├── activities.api.ts      # Cliente de API para Activities
├── categories.api.ts     # Cliente de API para Categories
├── activityEmission.api.ts # Cliente de API para Activity Emission
├── test.api.ts           # Cliente de API para endpoints de teste
└── index.ts              # Exportações centralizadas
```

## Uso

### Importar APIs e tipos

```typescript
import {
  activitiesApi,
  categoriesApi,
  activityEmissionApi,
  testApi,
  type Activity,
  type Category,
} from '~/apis'
```

### Exemplos de uso

#### Activities API

```typescript
// Listar todas as atividades
const activities = await activitiesApi.list()

// Obter uma atividade específica
const activity = await activitiesApi.get(1)

// Criar uma nova atividade
const newActivity = await activitiesApi.create({
  name: 'Viagem de carro',
  category: { id: 1, name: 'Transporte' },
  unitType: 'distance',
  unit: 'km',
  source: 'IPCC',
  region: 'BR',
  notes: 'Emissão por km rodado',
})

// Atualizar uma atividade
const updated = await activitiesApi.update(1, {
  name: 'Viagem de carro atualizada',
  category: { id: 1, name: 'Transporte' },
  unitType: 'distance',
  unit: 'km',
})

// Atualização parcial
const partiallyUpdated = await activitiesApi.partialUpdate(1, {
  name: 'Novo nome',
})

// Deletar uma atividade
await activitiesApi.delete(1)
```

#### Categories API

```typescript
// Listar todas as categorias
const categories = await categoriesApi.list()

// Obter uma categoria específica
const category = await categoriesApi.get(1)

// Criar uma nova categoria
const newCategory = await categoriesApi.create({
  name: 'Transporte',
})

// Atualizar uma categoria
const updated = await categoriesApi.update(1, {
  name: 'Transporte Atualizado',
})

// Atualização parcial
const partiallyUpdated = await categoriesApi.partialUpdate(1, {
  name: 'Novo nome',
})

// Deletar uma categoria
await categoriesApi.delete(1)
```

#### Activity Emission API

```typescript
// Obter dados de emissão
const emissionData = await activityEmissionApi.get({
  id: 1,
  value1: '100',
  value2: '200',
})
```

#### Test API

```typescript
// Endpoint de teste
const testData = await testApi.get()
```

## Tratamento de Erros

Os erros são tratados automaticamente pelo `AxiosInterceptor` configurado no projeto. Ele exibe mensagens de erro apropriadas para diferentes códigos de status HTTP (400, 401, 403, 404, 500).

## Tipos TypeScript

Todos os tipos estão disponíveis para importação:

```typescript
import type {
  Activity,
  Category,
  PatchedActivity,
  PatchedCategory,
  ActivityEmissionParams,
} from '~/apis'
```

## Notas

- Todas as APIs usam o `httpClient` configurado que já possui interceptors para tratamento de erros
- A base URL é configurada através da variável de ambiente `VITE_API_BASE_URL`
- Os tipos são baseados no schema OpenAPI gerado pelo drf-spectacular
