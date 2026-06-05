// Locale-independent data: image paths, dimensions, brand names, contact info.
// Text lives in the dictionaries (en.ts / it.ts); this never changes per locale.

export const SITE = {
  name: "Barberia",
  phone: "+39 02 1234 567",
  phoneHref: "tel:+39021234567",
  email: "hello@barberia.com",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  youtube: "https://youtube.com/",
  address: "12 Via Brera, 20121 Milano — IT",
} as const;

export const HERO_BG = "/images/home/hero.webp";
export const TEAM_OWNER_IMG = "/images/home/owner.webp";

export const SHOP_IMG = "/images/home/shop.webp";
export const SHOP_BRANDS = ["Cervo Nero", "Brunt & Hale", "Vesper Grooming", "Ironwood Supply", "Atelier Nord"];

// Order matches dict.services.items: [grooming/wellness, barbering, manicure/pedicure]
export const SERVICE_IMAGES = [
  "/images/home/svc-wellness.webp",
  "/images/home/svc-barbering.webp",
  "/images/home/svc-hands.webp",
];
// Order matches dict.news.items
export const NEWS_IMAGES = [
  "/images/home/news-1.webp",
  "/images/home/news-2.webp",
  "/images/home/news-3.webp",
];

export interface GalleryPhoto {
  src: string;
  w: number;
  h: number;
}

// Order matches dict.gallery.alts
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { src: "/images/gallery/chairs.webp", w: 530, h: 320 },
  { src: "/images/gallery/owner.webp", w: 880, h: 1194 },
  { src: "/images/gallery/haircut.webp", w: 416, h: 266 },
  { src: "/images/gallery/beard.webp", w: 268, h: 377 },
  { src: "/images/gallery/reception.webp", w: 479, h: 329 },
  { src: "/images/gallery/treatment.webp", w: 354, h: 342 },
  { src: "/images/gallery/lounge.webp", w: 202, h: 322 },
  { src: "/images/gallery/products.webp", w: 344, h: 255 },
  { src: "/images/gallery/shave-kit.webp", w: 304, h: 325 },
];
