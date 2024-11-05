require("dotenv").config();
console.log("DATABASE_URL:", process.env.DATABASE_URL); // Vérifiez si la variable est bien affichée

const { execSync } = require("child_process");
execSync("npx prisma migrate dev --name init", { stdio: "inherit" });
