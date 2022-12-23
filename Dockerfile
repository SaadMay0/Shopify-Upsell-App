FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
EXPOSE 8081
WORKDIR /app
COPY web .
RUN apk add git
RUN npm install
RUN cd frontend && npm install && SHOPIFY_API_KEY=a6cead32777952afe44689740f59fc31 npm run build
CMD ["npm", "run", "serve"]
