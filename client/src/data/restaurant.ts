export const images = {
  hero: "/images/hero.jpg",
  rawBar: "/images/seafood.jpg",
  patisserie: "/images/patisserie.jpg",
};

export type MenuCategory = "raw-bar" | "small-plates" | "mains" | "desserts";
export type MenuItem = {
  name: string;
  description: string;
  price: number;
  note?: string;
};
export type MenuSection = {
  id: MenuCategory;
  label: string;
  subtitle: string;
  items: MenuItem[];
};

// Launch-draft selections. Replace with Vlamoid's confirmed menu before opening bookings.
export const menu: MenuSection[] = [
  {
    id: "raw-bar",
    label: "Raw Bar",
    subtitle: "The freshest beginnings. Bright, briny, beautifully simple.",
    items: [
      {
        name: "Oysters on ice",
        description: "Six oysters · shallot mignonette · fresh lime",
        price: 2400,
        note: "HOUSE FAVOURITE",
      },
      {
        name: "Yellowfin tuna crudo",
        description: "Citrus ponzu · avocado · toasted sesame",
        price: 1850,
      },
      {
        name: "Coastal fish ceviche",
        description: "Catch of the day · coconut · coriander · chilli",
        price: 1650,
      },
      {
        name: "Prawn & mango tartare",
        description: "Poached prawns · ripe mango · lime · herb oil",
        price: 1750,
      },
    ],
  },
  {
    id: "small-plates",
    label: "Small Plates",
    subtitle: "A little for you. A little for the table.",
    items: [
      {
        name: "Charred octopus",
        description: "Smoked paprika · baby potatoes · lemon aioli",
        price: 1950,
        note: "HOUSE FAVOURITE",
      },
      {
        name: "Crisp calamari",
        description: "Lightly fried · green chilli · lime mayonnaise",
        price: 1450,
      },
      {
        name: "Brown-butter prawns",
        description: "Garlic · parsley · warm sourdough",
        price: 1850,
      },
      {
        name: "Burrata & roasted tomatoes",
        description: "Basil oil · toasted sourdough · cracked pepper",
        price: 1350,
      },
    ],
  },
  {
    id: "mains",
    label: "Mains",
    subtitle: "From the coast, with a little fire and a lot of care.",
    items: [
      {
        name: "Wood-fired catch of the day",
        description: "Whole seasonal fish · coastal herbs · grilled lemon",
        price: 3200,
        note: "HOUSE FAVOURITE",
      },
      {
        name: "Lobster linguine",
        description: "Fresh pasta · lobster · tomato · a touch of chilli",
        price: 3850,
      },
      {
        name: "Seared red snapper",
        description: "Coconut velouté · seasonal greens · lime",
        price: 2850,
      },
      {
        name: "Seafood risotto",
        description: "Prawns · calamari · mussels · saffron",
        price: 2950,
      },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    subtitle: "Stay a little longer. There is always room for something sweet.",
    items: [
      {
        name: "Dark chocolate tart",
        description: "70% cocoa · passion fruit · vanilla cream",
        price: 950,
        note: "HOUSE FAVOURITE",
      },
      {
        name: "Vanilla mille-feuille",
        description: "Hand-laminated pastry · vanilla custard · berries",
        price: 900,
      },
      {
        name: "Coconut & lime panna cotta",
        description: "Coconut cream · fresh lime · tropical fruit",
        price: 850,
      },
      {
        name: "Warm almond financier",
        description: "Brown butter · seasonal fruit · vanilla ice cream",
        price: 800,
      },
    ],
  },
];

export const draftHours = [
  { days: "Tuesday — Thursday", hours: "5pm — 11pm" },
  { days: "Friday — Saturday", hours: "5pm — midnight" },
  { days: "Sunday", hours: "noon — 10pm" },
  { days: "Monday", hours: "Closed" },
];

export const formatPrice = (price: number) =>
  `KSh ${price.toLocaleString("en-KE")}`;
