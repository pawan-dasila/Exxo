import Image from "next/image";

export const AuthShowcase = ({ image }: { image: string }) => {
  return (
    <div className="hidden lg:block lg:w-[50%] relative bg-stone-100 overflow-hidden min-h-screen">
      <Image
        src={image}
        alt="Premium Streetwear Showcase"
        fill
        sizes="100vw"
        className="object-cover"
        priority
        fetchPriority="high"
      />
      {/* <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" /> */}
    </div>
  );
};
