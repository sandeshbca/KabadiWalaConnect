export const SCRAP_CATEGORIES = [
  "Newspaper", "Mixed paper", "Cardboard", "Books", "Office paper",
  "PET plastic", "HDPE plastic", "LDPE plastic", "Plastic bottles", "Mixed plastic",
  "Iron", "MS scrap", "TMT steel", "GI scrap", "Cast iron", "Iron pipes",
  "Aluminium", "Aluminium cans", "Copper", "Brass", "Stainless steel", "Zinc",
  "E-waste", "Mobile phones", "Laptops", "Computer parts", "Cables", "Batteries", "TV / monitors",
  "Glass bottles", "Glass sheets", "Tyres", "Rubber", "Cotton clothes", "Used footwear",
  "Wood", "Furniture", "Vehicle scrap", "AC / fridge", "Appliances", "Used oil",
] as const;

export const SERVICE_OPTIONS = [
  { value: "scrap_pickup", label: "Doorstep scrap pickup", detail: "Household or small-quantity collection" },
  { value: "bulk_collection", label: "Corporate bulk collection", detail: "Free transport for bulk and industrial lots" },
  { value: "e_waste", label: "E-waste & data destruction", detail: "Certified handling for electronics and storage media" },
  { value: "document_shredding", label: "Paper & document shredding", detail: "Secure collection and destruction certificate" },
  { value: "vehicle_scrapping", label: "Vehicle scrapping", detail: "Vehicle pickup and scrapping-certificate assistance" },
  { value: "dismantling", label: "Dismantling service", detail: "On-site dismantling for fixtures and machinery" },
  { value: "epr_csr", label: "EPR / CSR programme", detail: "Compliance-led recovery for organisations" },
  { value: "zero_waste", label: "Zero-waste solutions", detail: "Recurring segregation and recovery programme" },
  { value: "tender", label: "Online bidding / tender", detail: "Request a competitive bid for large lots" },
] as const;

export const SERVICE_LABELS = Object.fromEntries(
  SERVICE_OPTIONS.map((service) => [service.value, service.label]),
) as Record<string, string>;
