import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    name: "Electronics",
    items: "Cameras, Laptops, Gaming & more",
    count: "1200+ items",
    emoji: "🎧",
    bg: "bg-cat-electronics border-blue-200/50",
  },
  {
    name: "Fashion & Clothing",
    items: "Ethnic Wear, Jackets, Shoes & more",
    count: "800+ items",
    emoji: "🧥",
    bg: "bg-cat-fashion border-emerald-200/50",
  },
  {
    name: "Books & Study",
    items: "Books, Calculators, Study Tools & more",
    count: "600+ items",
    emoji: "📚",
    bg: "bg-cat-books border-amber-200/50",
  },
  {
    name: "Fitness & Outdoors",
    items: "Gym Equipments, Trekking Gear & more",
    count: "700+ items",
    emoji: "🎒",
    bg: "bg-cat-fitness border-rose-200/50",
  },
  {
    name: "Tools & Equipment",
    items: "Drills, Power Tools, Garden & more",
    count: "400+ items",
    emoji: "🔧",
    bg: "bg-cat-tools border-sky-200/50",
  },
  {
    name: "Appliances & Home",
    items: "ACs, Microwaves, Fridges & more",
    count: "550+ items",
    emoji: "🏠",
    bg: "bg-cat-appliances border-purple-200/50",
  },
];

const CategoryCard = ({ category }: { category: (typeof CATEGORIES)[0] }) => (
  <div
    className={cn(
      "flex-none w-[220px] rounded-2xl p-5 flex flex-col justify-between border backdrop-blur-md relative overflow-hidden min-h-[140px] group cursor-pointer hover:shadow-lg transition-all duration-300",
      category.bg,
    )}
  >
    <div className="z-10">
      <h3 className="text-[15px] font-bold text-foreground mb-1 leading-tight">
        {category.name}
      </h3>
      <p className="text-[12px] text-muted-foreground leading-snug mb-3">
        {category.items}
      </p>
      <span className="text-[12px] font-bold text-primary/90">
        {category.count}
      </span>
    </div>
    <div className="absolute -right-3 -bottom-2 text-[64px] transition-all duration-300 pointer-events-none select-none">
      {category.emoji}
    </div>
  </div>
);

export default function PopularCategories() {
  return (
    <section className="bg-[#fafbff] pt-2">
      <div className="max-w-full lg:px-[50px] mx-auto px-6">
        <h2
          className={cn(
            "text-[28px] md:text-[32px] font-extrabold text-foreground mb-1 tracking-tight",
          )}
        >
          Popular Categories
        </h2>
        <p className="text-muted-foreground text-[14px] md:text-[15px] mb-8">
          Explore items you can rent
        </p>

        <div className="relative group/grid">
          <div className="flex items-center justify-center gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={i} category={cat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
