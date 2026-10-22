# node image
FROM node:20

# Work dir for the container
WORKDIR /app
# copy configuration files
COPY package*.json ./

# install dependences
RUN npm install

# Copy the rest of the code
COPY . .

# where the server runs
EXPOSE 3000

# for intialice node
CMD ["npm", "run", "dev"]