import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Leaf, Zap } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { resolveShowcaseImage } from "@/lib/utils";

export const metadata: Metadata = {
  title: `About ${siteConfig.name} — Premium Drop Culture Brand`,
  description:
    `Founded in ${siteConfig.business.address.city} in 2026. ${siteConfig.name} makes limited-run streetwear with intentional design, 240 GSM cotton, and zero plastic waste.`,
  openGraph: {
    title: `About ${siteConfig.name} — Premium Drop Culture Brand`,
    description:
      `Founded in ${siteConfig.business.address.city} in 2026. ${siteConfig.name} makes limited-run streetwear with intentional design, 240 GSM cotton, and zero plastic waste.`,
    url: `${siteConfig.url}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${siteConfig.name} — Premium Drop Culture Brand`,
    description:
      `Founded in ${siteConfig.business.address.city} in 2026. ${siteConfig.name} makes limited-run streetwear with intentional design.`,
  },
};

const FOUNDERS = [
  {
    name: "Anupam Jain",
    role: "Co-Founder & Grievance Officer",
    image:
      "https://res.cloudinary.com/df3vakamv/image/upload/v1777868243/anupam_hxrb2i.png",
    bio: "Anupam leads the brand vision and operations at Vestrostyles. His obsession with premium quality and the collector's experience is the driving force behind every drop, from the design of the shirt to the last detail on the box.",
  },
  {
    name: "Anshika Jain",
    role: "Co-Founder & Creative Director",
    image:
      "https://res.cloudinary.com/df3vakamv/image/upload/v1777526536/IMG-20260430-WA0012_zpzwfu.jpg",
    bio: "Anshika shapes the creative identity of Vestrostyles, from the visual language of every drop to the storytelling behind each design. Her eye for detail and passion for craft is what makes every Vestrostyles piece feel like it belongs in a collection, not just a wardrobe.",
  },
] as const;

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-10 px-4 md:px-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-sm font-montserrat  uppercase  text-brand-gold">
              Our Origins
            </h2>
            <h3 className="text-4xl md:text-5xl font-italiana text-[#090A0A] leading-tight">
              Beyond the Drop.
            </h3>
            <div className="space-y-6 text-stone-500 font-sans text-base md:text-lg leading-relaxed">
              <p>
                {siteConfig.name} is a premium drop culture streetwear brand founded
                in {siteConfig.business.address.city} in 2026. Born from a shared obsession with
                intentional design, we believe that what you wear should mean
                something.
              </p>
              <p>
                We don&apos;t just release products; we release experiences.
                From the energy of modern India to the human desire to stand
                apart, every {siteConfig.name} piece is an invitation to wear your
                story with silent confidence and raw ambition.
              </p>
            </div>
          </div>
          <div className="relative aspect-2/1 flex items-center justify-center bg-stone-50 rounded-2xl overflow-hidden group border border-stone-100 shadow-sm">
            <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
              <Image
                src="/assets/logo/logo.png"
                alt="Vestrostyles Logo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-italiana text-[#090A0A] mb-4">
            Our Core Pillars
          </h2>
          <div className="h-1 w-20 bg-brand-gold mx-auto" />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <Star className="h-6 w-6" />,
              title: "Obsessive Quality",
              desc: "From 240 GSM premium cotton to high-definition puff screen prints, every millimetre of a Vestrostyles piece is engineered for longevity, comfort, and a hand-feel that speaks before you say a word. We obsess over the details so you never have to question them.",
            },
            {
              icon: <Leaf className="h-6 w-6" />,
              title: "Conscious Craft",
              desc: "We produce in limited runs to eliminate waste. Every piece is made with purpose, not to fill shelves, but to earn a place in your wardrobe. Our supply chain is transparent, and our packaging is designed to be kept, not thrown away.",
            },
            {
              icon: <Zap className="h-6 w-6" />,
              title: "Hyper-Minimalism",
              desc: "Every drop is its own world. The design, the artwork, the collector's box, all connected by one story. We don't release products. We release experiences. Limited pieces. One chance. Once it's gone, it's gone forever.",
            },
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white p-10 space-y-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-brand-gold">{pillar.icon}</div>
              <h4 className="text-xl font-serif text-[#090A0A]">
                {pillar.title}
              </h4>
              <p className="text-stone-500 text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 px-4 md:px-8 max-w-[1240px] mx-auto overflow-visible">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
          <div className="w-full lg:w-1/2 relative pb-16 lg:pb-0">
            <div className="relative aspect-4/5 w-full overflow-hidden shadow-2xl">
              <Image
                src={resolveShowcaseImage(
                  "https://res.cloudinary.com/df3vakamv/image/upload/v1777707988/Untitled_design_28_yiswor.png",
                  "desktop",
                )}
                alt="Vestrostyles Design Studio"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 620px"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-10 -right-4 md:-right-12 w-1/2 aspect-[square] overflow-hidden border-8 border-white shadow-xl z-20">
              <Image
                src="/images/about/process-detail.png"
                alt="Premium Fabric Detail"
                fill
                sizes="(max-width: 768px) 50vw, 310px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-brand-gold font-montserrat  uppercase text-[10px] tracking-[0.2em]">
                The Process
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-italiana text-[#090A0A] leading-[1.1]">
                Designed in {siteConfig.business.address.city.split(' ').pop()}.
                <br />
                Felt Everywhere.
              </h3>
            </div>

            <div className="space-y-6 text-stone-500 font-sans text-sm md:text-base leading-relaxed">
              <p>
                Every Vestrostyles piece begins as an idea, debated, sketched,
                and refined until it earns its place in a drop. We work closely
                with our production partners to ensure every design is
                rigorously tested for shrinkage, colour fastness, print
                durability, and fit.
              </p>
              <p>
                A design doesn&apos;t make it to a drop until it passes every
                standard we&apos;ve set for it. And when it does, it gets its
                own story. Its own custom box. Its own identity.
              </p>
              <p>
                That&apos;s the Vestrostyles process. Slow, intentional, and
                completely uncompromising.
              </p>
            </div>

            <div className="grid grid-cols-2 border-t border-l border-stone-100 mt-12">
              {[
                { value: "100%", label: "Premium Cotton" },
                { value: "0", label: "Plastic Waste" },
                { value: "240", label: "GSM Fabric Weight" },
                { value: "LTD.", label: "Every Single Drop" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-8 border-r border-b border-stone-100 flex flex-col justify-center min-h-[140px]"
                >
                  <span className="block text-4xl font-serif text-[#090A0A] mb-2">
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-montserrat font-semibold">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founders Section */}
      <section className="py-24 md:py-32 bg-stone-50/50">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-italiana text-[#090A0A] mb-6">
              Meet the Founders
            </h2>
            <div className="h-1 w-20 bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
            {FOUNDERS.map((founder, index) => (
              <div
                key={founder.name}
                className={`group space-y-8 ${index === 1 ? "lg:mt-32" : ""}`}
              >
                <div className="relative aspect-3/4 overflow-hidden transition-all duration-1000 shadow-2xl bg-stone-200">
                  <Image
                    src={resolveShowcaseImage(founder.image, "desktop")}
                    alt={`${founder.name}, ${founder.role}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="bg-white p-12 space-y-6 border border-stone-100 shadow-sm relative z-10 mx-4 md:mx-8 -mt-20">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-montserrat font-black uppercase tracking-tight text-[#090A0A]">
                      {founder.name}
                    </h3>
                    <p className="text-brand-gold font-montserrat uppercase text-[10px] tracking-[0.25em] font-bold">
                      {founder.role}
                    </p>
                  </div>
                  <p className="text-stone-500 font-sans text-sm md:text-base leading-relaxed">
                    {founder.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 text-center border-t border-stone-100 bg-white">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-block px-4 py-1 border border-brand-gold/20 text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold bg-stone-50">
            Latest Drop, Now Live
          </div>

          <h2 className="text-5xl md:text-6xl font-italiana text-[#090A0A] leading-[1.1]">
            Ready to wear
            <br />
            the story?
          </h2>

          <p className="max-w-lg mx-auto text-stone-500 text-sm md:text-base leading-relaxed">
            Our latest collection is live. Limited pieces. Once it&apos;s gone,
            it&apos;s gone. Every piece ships in our signature
            collector&apos;s box.
          </p>

          <div className="pt-8 flex justify-center">
            <Link
              href="/products?drop=active"
              className="inline-flex items-center gap-6 bg-primary text-white px-12 py-6 rounded-none text-xs uppercase tracking-widest hover:bg-primary/80 transition-all duration-500 group"
            >
              Explore Latest Drop
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
