import type { SiteImage } from "@/types/site";

/**
 * Centralized image configuration for the marketing site.
 * All real image assets are referenced from here so components
 * never hardcode a raw string path.
 *
 * Files are expected to live in /public/images.
 */

const path = (file: string) => `/images/${file}`;

export const spaceImages = {
  mainFloor: {
    src: path("main_floor.webp"),
    alt: "Aurevon Studios main training floor with competition platforms and free-weight range",
  },
  gymEntrance: {
    src: path("gym_entrance.webp"),
    alt: "Entrance to Aurevon Studios",
  },
  conditioningBay: {
    src: path("conditioning_bay.webp"),
    alt: "Dedicated conditioning bay at Aurevon Studios",
  },
  recoverySuite: {
    src: path("recovery_suite.webp"),
    alt: "Recovery suite with cold plunge and sauna at Aurevon Studios",
  },
  freeWeights: {
    src: path("free_weights.webp"),
    alt: "Full free-weight range at Aurevon Studios",
  },
  detailedEquipment: {
    src: path("detailed_equipment.webp"),
    alt: "Detail shot of commercial-grade equipment at Aurevon Studios",
  },
  memberTraining: {
    src: path("member_training.webp"),
    alt: "A member training on the main floor at Aurevon Studios",
  },
  coachingSession: {
    src: path("coaching_session.webp"),
    alt: "A coach guiding a member through a training session",
  },
} satisfies Record<string, SiteImage>;

export const trainerImages = {
  male: {
    src: path("trainer_male.webp"),
    alt: "Aurevon Studios coach",
  },
  female: {
    src: path("trainer_female.webp"),
    alt: "Aurevon Studios coach",
  },
} satisfies Record<"male" | "female", SiteImage>;

export const transformationImages: readonly [SiteImage, SiteImage, SiteImage] = [
  { src: path("transformation_1.webp"), alt: "Aurevon member transformation" },
  { src: path("transformation_2.webp"), alt: "Aurevon member transformation" },
  { src: path("transformation_3.webp"), alt: "Aurevon member transformation" },
];
