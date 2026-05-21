// Thin re-export wrapper — keeps any existing imports working.
// The real implementations live in ./navbar/ sub-components.
export { DesktopSearchBar, MobileSearchDialog } from "./navbar/search-bar";

// Legacy alias — if anything imports NavbarSearch directly
export { DesktopSearchBar as NavbarSearch } from "./navbar/search-bar";
