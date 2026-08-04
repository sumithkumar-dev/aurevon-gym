export type MembershipPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export type SiteImage = {
  src: string;
  alt: string;
};

export type Trainer = {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: SiteImage;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  image: SiteImage;
};
