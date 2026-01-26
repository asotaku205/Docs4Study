import Category from "../models/Category.js";

const defaultCategories = [
  {
    name: "Development",
    slug: "development",
    description: "Programming, software development, and coding tutorials",
    isActive: true
  },
  {
    name: "Design",
    slug: "design",
    description: "UI/UX design, graphic design, and creative content",
    isActive: true
  },
  {
    name: "Marketing",
    slug: "marketing",
    description: "Digital marketing, SEO, and growth strategies",
    isActive: true
  },
  {
    name: "Business",
    slug: "business",
    description: "Entrepreneurship, management, and business strategies",
    isActive: true
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Time management, tools, and productivity tips",
    isActive: true
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Health, wellness, and personal development",
    isActive: true
  }
];

export const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    
    if (count === 0) {
      await Category.insertMany(defaultCategories);
      console.log("Default categories seeded successfully");
    } else {
      console.log("Categories already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
};
