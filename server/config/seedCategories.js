import Category from "../models/Category.js";

const defaultCategories = [
  {
    name: "Development",
    slug: "development",
    description: "Programming, software development, and coding tutorials",
    color: "#3b82f6",
    isActive: true
  },
  {
    name: "Design",
    slug: "design",
    description: "UI/UX design, graphic design, and creative content",
    color: "#ec4899",
    isActive: true
  },
  {
    name: "Marketing",
    slug: "marketing",
    description: "Digital marketing, SEO, and growth strategies",
    color: "#f59e0b",
    isActive: true
  },
  {
    name: "Business",
    slug: "business",
    description: "Entrepreneurship, management, and business strategies",
    color: "#10b981",
    isActive: true
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Time management, tools, and productivity tips",
    color: "#8b5cf6",
    isActive: true
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Health, wellness, and personal development",
    color: "#ef4444",
    isActive: true
  }
];

export const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    
    if (count === 0) {
      await Category.insertMany(defaultCategories);
      console.log("✅ Default categories seeded successfully");
    } else {
      console.log("ℹ️  Categories already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
};
