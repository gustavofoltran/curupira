FROM node:20-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

FROM base AS development
EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0"]

FROM base AS production
RUN yarn build
EXPOSE 3000
CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "3000"]