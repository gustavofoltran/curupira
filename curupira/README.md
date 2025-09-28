# Comando do Container
Para executar o container, é preciso ter o Docker Compose (v2) instalado na máquina. Caso não possua, siga as instruções para instalação do [Docker Engine](https://docs.docker.com/engine/install/).
## Build do Container
Para construir o container, utilize o comando:
```bash
docker compose up
```

## Atualizações após Modificações
Após modificar o Dockerfile ou dependências, utilize:
```bash
docker compose up --build
```

## Finalizar o Container
Para finalizar o container, utilize:
```bash
docker compose down
```
