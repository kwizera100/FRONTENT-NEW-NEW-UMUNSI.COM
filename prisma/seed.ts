import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { slug: "inkuru-nyamukuru", name: "Inkuru Nyamukuru", nameEn: "Breaking News", color: "#dc2626", icon: "Flame", description: "Inkuru z'ibyibutsa mu Rwanda no ku isi", order: 1 },
  { slug: "amakuru", name: "Amatangazo", nameEn: "News & Announcements", color: "#2563eb", icon: "Megaphone", description: "Amatangazo y'amakuru y'ingenzi", order: 2 },
  { slug: "imyidagaduro", name: "Imyidagaduro", nameEn: "Entertainment", color: "#7c3aed", icon: "Music", description: "Ibyo umuryango ukunda kwidagaduraho", order: 3 },
  { slug: "imikino", name: "Imikino", nameEn: "Sports", color: "#059669", icon: "Trophy", description: "Imikino y'abaprofeyisoneli n'amakuru y'imikino", order: 4 },
  { slug: "ikoranabuhanga", name: "Ikoranabuhanga", nameEn: "Technology", color: "#0891b2", icon: "Cpu", description: "Ikoranabuhanga rishya n'ibyiza mu bijyanye na tech", order: 5 },
  { slug: "cinema", name: "Cinema", nameEn: "Cinema", color: "#db2777", icon: "Film", description: "Amafilime, abakinnyi, n'amakuru ya sinema", order: 6 },
  { slug: "health", name: "Health", nameEn: "Health", color: "#16a34a", icon: "HeartPulse", description: "Amakuru y'ubuzima n'imiti", order: 7 },
  { slug: "akazi", name: "Akazi", nameEn: "Jobs", color: "#ea580c", icon: "Briefcase", description: "Akazi k'umunsi, imirimo n'amahugurwa", order: 8 },
  { slug: "hanze", name: "Hanze", nameEn: "World / International", color: "#4f46e5", icon: "Globe", description: "Amakuru y'isi hanze y'u Rwanda", order: 9 },
  { slug: "inkuru-ku-rwanda", name: "Inkuru ku Rwanda", nameEn: "Rwanda Stories", color: "#0d9488", icon: "MapPin", description: "Inkuru z'umuco, amateka, n'iterambere ry'u Rwanda", order: 10 },
];

async function main() {
  console.log("Seeding database...");

  // Create categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`Created ${categories.length} categories`);

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminAuthor = await prisma.author.upsert({
    where: { email: "admin@umunsi.com" },
    update: {},
    create: {
      name: "Admin Umunsi",
      email: "admin@umunsi.com",
      role: "admin",
      bio: "Admin wa Umunsi.com",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@umunsi.com" },
    update: {},
    create: {
      email: "admin@umunsi.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
      authorId: adminAuthor.id,
    },
  });
  console.log("Created admin user: admin@umunsi.com / admin123");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
