# Desafio Backend Node.js Konsi

## Descrição

O desafio em desenvolver uma API que busca e retorna a matrícula do servidor em uma determinada API externa.

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando:

```bash
npm install
```

## Configuração

```bash
NODE_ENV=development
PORT=3333
CONSULTA_API_USERNAME=username@email.com.br
CONSULTA_API_PASSWORD=password
CONSULTA_API_URL=http://api.consula.com
RABBIT_URL=amqp://localhost:5672
ELASTIC_NODE_URL=http://localhost:9200
REDIS_URL=redis://localhost:6379
ENABLE_CONSUMER=false
```

As variáveis para conexão com a API de consultas criada para meu usuário são

```bash
CONSULTA_API_USERNAME=test@konsi.com.br
CONSULTA_API_PASSWORD=Test@Konsi2023*
CONSULTA_API_URL=http://teste-dev-api-dev-140616584.us-east-1.elb.amazonaws.com
```

Para executar o projeto de modo que a fila de cpfs seja consumida, a variável de ambiente `ENABLE_CONSUMER` deve conter o valor `TRUE`.

## Inicializaçao usando Docker

Para iniciar os serviços Docker necessários para o projeto, utilize o seguinte comando:

```bash
npm run services:up

# pode pedir para executar em modo superusuário
sudo run services:up
```

Para parar os serviços Docker, utilize o seguinte comando:

```bash
npm run services:stop

# pode pedir para executar em modo superusuário
sudo npm run services:stop
```

## Endpoints

#### GET /customer

Este endpoint retorna os benefícios do cliente com base no número do CPF fornecido como parâmetro de consulta. Exemplo:

```bash
curl http://localhost:3333/customer?cpf=123.456.789-00
```

#### POST /customer

Este endpoint enfileira um CPF para posterior busca na API externa. Exemplo:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"cpf": "12345678900"}' http://localhost:3333/customer
```

Uma colletion do Postman (`API-postman-collection.json`), com as rotas utilizadas no desafio também foi disponibilizada

## Testes

Para executar os testes, utilize o seguinte comando:

```bash
npm run test
```
