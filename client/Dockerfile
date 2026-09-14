FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
# Development ke liye 'npm install' 
RUN npm install

COPY . .

# 
EXPOSE 5173

# CMD ko 'npm run dev' 
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
