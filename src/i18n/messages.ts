// The translation contract. Both en.ts and it.ts must satisfy this shape.

export interface Messages {
  meta: {
    homeTitle: string;
    homeDescription: string;
    galleryTitle: string;
    galleryDescription: string;
    bookTitle: string;
    bookDescription: string;
  };
  nav: {
    home: string;
    gallery: string;
    team: string;
    services: string;
    news: string;
    book: string;
    contact: string;
  };
  header: {
    book: string;
    openMenu: string;
    close: string;
  };
  hero: {
    eyebrow: string;
    categories: string[];
    intro: string;
    cta: string;
  };
  marquee: string;
  team: {
    eyebrow: string;
    lede: string;
    ownerName: string;
    ownerRole: string;
    cta: string;
  };
  shop: {
    eyebrow: string;
    lede: string;
    title: string;
  };
  services: {
    eyebrow: string;
    lede: string;
    title: string;
    cta: string;
    /** order: [grooming & wellness, barbering, manicure & pedicure] */
    items: { title: string; desc: string }[];
  };
  news: {
    eyebrow: string;
    lede: string;
    title: string;
    cta: string;
    items: { category: string; title: string; date: string }[];
  };
  footer: {
    contact: string;
    social: string;
    copyright: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    tagline: string;
    cta: string;
    /** alt text, order matches GALLERY_PHOTOS */
    alts: string[];
  };
  book: {
    eyebrow: string;
    title: string;
    service: string;
    selectService: string;
    barber: string;
    anyBarber: string;
    date: string;
    time: string;
    pickFirst: string;
    loading: string;
    noSlots: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    confirm: string;
    confirming: string;
    received: string;
    bookAnother: string;
    genericError: string;
    minutes: string;
  };
  /** service id -> localized name */
  serviceNames: Record<string, string>;
  /** barber id -> localized name */
  barberNames: Record<string, string>;
  admin: {
    brand: string;
    logout: string;
    login: {
      title: string;
      password: string;
      placeholder: string;
      enter: string;
      wrong: string;
      demo: string;
    };
    nav: {
      bookings: string;
      calendar: string;
      products: string;
      inventory: string;
    };
    bookings: {
      title: string;
      date: string;
      time: string;
      service: string;
      barber: string;
      client: string;
      status: string;
      actions: string;
      confirm: string;
      cancel: string;
      delete: string;
      none: string;
      filterDate: string;
      filterStatus: string;
      all: string;
      clear: string;
    };
    status: {
      pending: string;
      confirmed: string;
      cancelled: string;
    };
    calendar: {
      title: string;
      today: string;
      prev: string;
      next: string;
      /** Monday-first, 7 short weekday labels */
      weekdays: string[];
      /** 12 month names, January-first */
      months: string[];
      none: string;
    };
    products: {
      title: string;
      add: string;
      newProduct: string;
      editProduct: string;
      name: string;
      category: string;
      price: string;
      description: string;
      image: string;
      active: string;
      activeYes: string;
      activeNo: string;
      save: string;
      cancel: string;
      edit: string;
      delete: string;
      confirmDelete: string;
      none: string;
      saving: string;
    };
    inventory: {
      title: string;
      product: string;
      stock: string;
      threshold: string;
      status: string;
      inStock: string;
      lowStock: string;
      outOfStock: string;
      units: string;
      save: string;
      none: string;
      updated: string;
    };
  };
}
