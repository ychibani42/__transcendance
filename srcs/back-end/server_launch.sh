npm install

# Install nodemon and ts-node as dev dependencies
npm install --save-dev nodemon ts-node

# updates all the dependencies defined in the package.json file 
npm update

# Generate database 
npx prisma generate

# Update database migration 
npx prisma migrate dev

# Push to database last changes
npx prisma db push

# Give permissions to use xdg open for prisma studio

npm run start:dev
