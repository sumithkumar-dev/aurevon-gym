import type { MembershipPlan, Trainer, Testimonial } from "@/types/site";

export const siteConfig = {
  name: "Aurevon",
  tagline: "Strength is built.",
  description:
    "A private training studio for people who take their discipline seriously. Considered programming, uncompromising standards, and a space built to match your ambition.",
  phone: "+91 9876543210",
  email: "hello@aurevonstudios.com",
  address: {
    line1: "Hunter Road",
    line2: "Warangal District",
    city: "Telangana, 506002",
  },
  hours: [
    { days: "Monday — Friday", time: "5:00 AM — 11:00 PM" },
    { days: "Saturday", time: "6:00 AM — 9:00 PM" },
    { days: "Sunday", time: "7:00 AM — 6:00 PM" },
  ],
};

export const mainNav = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Trainers", href: "/trainers" },
  { label: "Facilities", href: "/facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  studio: [
    { label: "About", href: "/about" },
    { label: "Trainers", href: "/trainers" },
    { label: "Facilities", href: "/facilities" },
    { label: "Gallery", href: "/gallery" },
  ],
  membership: [
    { label: "Membership Plans", href: "/membership" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const membershipPlans: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "₹2,999",
    period: "/month",
    description:
      "For the self-directed athlete who needs a serious space and nothing else.",
    features: [
      "Full facility access",
      "Standard operating hours",
      "Locker room & showers",
      "Free-weight & machine floor",
      "Monthly progress check-in",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: "₹5,999",
    period: "/month",
    description:
      "Guided programming and priority access for members who train with intent.",
    features: [
      "Everything in Basic",
      "Extended hours access",
      "2 personal training sessions / month",
      "Custom programming",
      "Recovery suite access",
      "Guest privileges (2 / month)",
    ],
    featured: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: "₹9,999",
    period: "/month",
    description:
      "Full access, unlimited coaching, and a studio experience built around you.",
    features: [
      "Everything in Gold",
      "Unlimited personal training",
      "24/7 facility access",
      "Private locker assignment",
      "Quarterly performance review",
      "Unlimited guest privileges",
    ],
  },
];

export const trainers: Trainer[] = [
  {
    id: "trainer-1",
    name: "Vikram Chauhan",
    title: "Head of Strength & Conditioning",
    bio: "Twelve years coaching competitive strength athletes, with a focus on precise movement standards over volume.",
  },
  {
    id: "trainer-2",
    name: "Ananya Reddy",
    title: "Performance Coach",
    bio: "Specializes in long-term athletic development and injury-resilient programming for serious lifters.",
  },
  {
    id: "trainer-3",
    name: "Rohan Mehta",
    title: "Mobility & Recovery Lead",
    bio: "Bridges rehabilitation and performance training, keeping members moving well for the long term.",
  },
  {
    id: "trainer-4",
    name: "Priya Nair",
    title: "Conditioning Specialist",
    bio: "Builds engine and work capacity without sacrificing the strength members come to Aurevon to build.",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I've trained at a dozen gyms. This is the first one that treated programming like a craft instead of a checklist.",
    name: "Member since 2023",
    detail: "Elite Membership",
  },
  {
    id: "t2",
    quote:
      "The coaching is direct, the space is serious, and nobody is trying to sell me a smoothie on the way out.",
    name: "Member since 2022",
    detail: "Gold Membership",
  },
  {
    id: "t3",
    quote:
      "Eighteen months in and my numbers still climb every quarter. That's the whole pitch, really.",
    name: "Member since 2021",
    detail: "Elite Membership",
  },
];

export const faqs = [
  {
    question: "Do I need experience to join?",
    answer:
      "No. Every new member completes a private orientation session where a coach assesses your movement and builds a starting plan around it, regardless of your background.",
  },
  {
    question: "Can I freeze or cancel my membership?",
    answer:
      "Yes. All memberships can be frozen for up to two months per year and cancelled with 30 days' notice — no long-term contracts, no cancellation fees.",
  },
  {
    question: "What's included in a personal training session?",
    answer:
      "A one-to-one hour with your assigned coach covering programming, technique correction, and load progression, tracked in your member profile session to session.",
  },
  {
    question: "Is there a joining fee?",
    answer:
      "A one-time studio orientation fee applies to all new memberships. It covers your initial assessment and programming setup — full pricing is confirmed at signup.",
  },
  {
    question: "Do you offer day passes for visitors?",
    answer:
      "Yes, single-day access is available for out-of-town members of partner studios and by prior arrangement for guests. Contact the studio to arrange one.",
  },
];
