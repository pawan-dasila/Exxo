import { useState } from "react";
import { Search, Loader2, Tag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { useSearchSuggestions } from "@/modules/products/hooks/use-search";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
// import { Category } from "@/modules/category/types";

interface SuggestionProduct {
  id: string;
  slug: string;
  image_url: string;
  title: string;
  formatted_price: string;
}

interface SuggestionCategory {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

export function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  // const { data: suggestions, isLoading } = useSearchSuggestions(query);
  const isLoading = false;
  const suggestions: {
    products: SuggestionProduct[];
    categories: SuggestionCategory[];
  } = {
    products: [],
    categories: [],
  };

  const closeAll = () => {
    setDesktopOpen(false);
    setMobileOpen(false);
  };

  const handleSearch = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (query.trim()) {
      closeAll();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    closeAll();
    setQuery("");
    router.push(`/products/${slug}`);
  };

  const handleSelectCategory = (name: string) => {
    closeAll();
    setQuery("");
    router.push(`/products?category=${encodeURIComponent(name)}`);
  };

  const searchCommandList = (
    <Command className="bg-white">
      <CommandList className="max-h-[80vh]">
        {isLoading && query.length >= 2 && (
          <div className="p-4 flex items-center justify-center text-stone-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Searching...
            </span>
          </div>
        )}

        {query.length < 2 && (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-stone-900 font-serif italic">
                Search Vestrostyles
              </p>
              <p className="text-[10px] text-stone-400 uppercase tracking-tight">
                Try &quot;Hoodie&quot;, &quot;Tees&quot;, or
                &quot;Oversized&quot;
              </p>
            </div>
          </div>
        )}

        {!isLoading &&
          query.length >= 2 &&
          (!suggestions ||
            (suggestions.products.length === 0 &&
              suggestions.categories.length === 0)) && (
            <CommandEmpty className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-stone-900 font-serif italic">
                  &quot;No results found&quot;
                </p>
                <p className="text-[10px] text-stone-400 uppercase tracking-tight">
                  Try refine your search or browse categories
                </p>
              </div>
            </CommandEmpty>
          )}

        {suggestions && suggestions.categories.length > 0 && (
          <CommandGroup
            heading={
              <span className="text-[9px] font-black uppercase text-stone-300 px-2">
                Collections
              </span>
            }
          >
            {suggestions.categories.map((category: SuggestionCategory) => (
              <CommandItem
                key={category.id}
                onSelect={() => handleSelectCategory(category.name || "")}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-stone-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-brand-gold/10 transition-colors overflow-hidden shrink-0">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name || "Category"}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Tag className="w-3.5 h-3.5 text-stone-400 group-hover:text-brand-gold" />
                  )}
                </div>
                <span className="text-xs font-medium text-stone-600 group-hover:text-stone-900">
                  {category.name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {suggestions && suggestions.products.length > 0 && (
          <CommandGroup
            heading={
              <span className="text-[9px] font-black uppercase text-stone-300 px-2 mt-2">
                Products
              </span>
            }
          >
            {suggestions.products.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => handleSelectProduct(product.slug || "")}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-stone-50 transition-colors group"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  <Image
                    src={product.image_url}
                    alt={product.title || ""}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] font-semibold text-stone-900 font-serif line-clamp-1">
                    {product.title}
                  </span>
                  <span className="text-[9px] text-brand-gold font-bold uppercase">
                    {product.formatted_price}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {query.length >= 2 && (
          <div
            className="p-3 bg-stone-50 border-t border-stone-100 mt-2 cursor-pointer hover:bg-stone-100 transition-colors"
            onClick={() => handleSearch()}
          >
            <p className="text-[9px] font-bold uppercase text-stone-400 flex items-center justify-center gap-2">
              View all results for &quot;{query}&quot;{" "}
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        )}
      </CommandList>
    </Command>
  );

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:flex relative items-center group">
        <Popover open={desktopOpen} onOpenChange={setDesktopOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex items-center group w-full">
              <Search className="w-4 h-4 absolute left-3 text-stone-400 group-focus-within:text-stone-900 transition-colors z-10" />
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!desktopOpen && e.target.value.length >= 2)
                      setDesktopOpen(true);
                  }}
                  className="pl-9 pr-4 rounded-full w-[120px] lg:w-[180px] h-9 bg-stone-100 border-none focus-visible:ring-1 focus-visible:ring-(--brand-gold)/20 focus-visible:bg-white transition-all text-xs"
                />
              </form>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] lg:w-[400px] p-0 border-stone-200 shadow-2xl rounded-2xl overflow-hidden mt-2"
            align="end"
            sideOffset={8}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {searchCommandList}
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile Search Modal */}
      <div className="md:hidden flex items-center">
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open search"
              className="rounded-full hover:bg-brand-gold hover:text-white transition-all outline-offset-2"
            >
              <Search className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="p-0 sm:max-w-md top-[10%] translate-y-0 overflow-hidden rounded-2xl max-w-[calc(100%-2rem)] mx-auto w-[calc(100%-2rem)] gap-0"
            showCloseButton={false}
            aria-describedby={undefined}
          >
            <DialogTitle className="sr-only">Search</DialogTitle>
            <div className="flex items-center px-4 py-3 border-b border-stone-100">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <form onSubmit={handleSearch} className="flex-1 ml-3">
                <Input
                  type="text"
                  placeholder="Search products, categories..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 h-8 px-0 text-sm w-full bg-transparent"
                  autoFocus
                />
              </form>
            </div>
            {searchCommandList}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
