npm install

# Generate database 
npx prisma generate

# Update database migration 
npx prisma migrate dev --name db-migration

# Push to database last changes
npx prisma db push

# Give permissions to use xdg open for prisma studio
npm run start:dev
