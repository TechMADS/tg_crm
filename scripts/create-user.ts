import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('yourpassword123', 10)

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@yourcompany.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('Created user:', user.email)
}

main()