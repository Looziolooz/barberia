// Content for the Barberia gallery page — layout cloned from don-barber.gr,
// fully rebranded (no original references). Photos in public/images/gallery.

export const SITE = {
  name: "Barberia",
  title: "Barberia | Look Around the Barbershop",
  description: "Step inside Barberia — a barbershop designed to combine luxury and cool. Take a look around our store.",
  phone: "+39 02 1234 567",
  phoneHref: "tel:+390212345567",
  book: "Book now",
  instagram: "https://instagram.com/",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const NAV: NavLink[] = [
  { label: "Home", href: "#" },
  { label: "Profile", href: "#" },
  { label: "Timeline", href: "#" },
  { label: "Gallery", href: "#gallery" },
  { label: "The Team", href: "#" },
  { label: "Services", href: "#" },
  { label: "News", href: "#" },
  { label: "Contact", href: "#" },
];

export const HERO = {
  eyebrow: "Look around the barbershop",
  title: "Store",
  tagline:
    "Ideally placed in the heart of the city, our store was designed to combine luxury and cool; an indulgent break from the hustle and bustle in the everyday life of the modern gentleman.",
  cta: "Learn more",
} as const;

export interface Photo {
  src: string;
  w: number;
  h: number;
  alt: string;
}

export const GALLERY: Photo[] = [
  { src: "/images/gallery/reception.webp", w: 1200, h: 746, alt: "Barbershop reception" },
  { src: "/images/gallery/owner.webp", w: 414, h: 663, alt: "Master barber" },
  { src: "/images/gallery/hair-cut.webp", w: 1166, h: 900, alt: "A precise haircut" },
  { src: "/images/gallery/portrait.webp", w: 457, h: 557, alt: "Client portrait" },
  { src: "/images/gallery/beard.webp", w: 1439, h: 900, alt: "Beard grooming" },
  { src: "/images/gallery/leather-chair.webp", w: 691, h: 900, alt: "Leather barber chair" },
  { src: "/images/gallery/products.webp", w: 556, h: 330, alt: "Grooming products" },
  { src: "/images/gallery/client-detail.webp", w: 437, h: 570, alt: "Styling detail" },
  { src: "/images/gallery/chair-mirror.webp", w: 675, h: 900, alt: "Chair and mirror" },
  { src: "/images/gallery/feet.webp", w: 619, h: 422, alt: "Store interior" },
  { src: "/images/gallery/acqua.webp", w: 303, h: 437, alt: "Detail" },
  { src: "/images/gallery/client.webp", w: 688, h: 465, alt: "In the chair" },
  { src: "/images/gallery/orange.webp", w: 378, h: 557, alt: "Atmosphere" },
  { src: "/images/gallery/wood-store.webp", w: 512, h: 900, alt: "Wood interior" },
];
