/**
 * Sample testimonial data.
 *
 * Shape mirrors a Google Places review so you can swap in real data later:
 *   - author_name       → reviewer's display name
 *   - rating            → 1–5
 *   - text              → review body
 *   - relative_time_description → e.g. "2 weeks ago"
 *   - profile_photo_url → avatar (optional, falls back to initials)
 *   - role              → extra context (not in Google API — for manual entries)
 *   - source            → "google" | "facebook" | "manual"
 */

export const testimonialsData = [
  {
    author_name: "Amina W.",
    rating: 5,
    text: "Excellent service and beautiful furniture. The sofa we ordered fits perfectly in our living room. The team was professional from order to delivery.",
    relative_time_description: "2 weeks ago",
    profile_photo_url: null,
    role: "Homeowner, Karen",
    source: "google",
  },
  {
    author_name: "David K.",
    rating: 5,
    text: "Delivered exactly what we ordered, on time. The quality exceeds the price point. We furnished our entire office with Furniture Elite Space and couldn't be happier.",
    relative_time_description: "1 month ago",
    profile_photo_url: null,
    role: "Office Manager, Westlands",
    source: "google",
  },
  {
    author_name: "Grace M.",
    rating: 5,
    text: "My guests consistently compliment the furniture. Furniture Elite Space never disappoints. I've ordered beds, wardrobes, and dining sets — all stunning quality.",
    relative_time_description: "3 weeks ago",
    profile_photo_url: null,
    role: "Airbnb Host, Kileleshwa",
    source: "google",
  },
  {
    author_name: "Peter O.",
    rating: 4,
    text: "Great custom furniture at fair prices. The L-shaped desk they built for my home office is solid and well-finished. Would definitely recommend for office setups.",
    relative_time_description: "1 month ago",
    profile_photo_url: null,
    role: "Freelancer, Kilimani",
    source: "manual",
  },
  {
    author_name: "Sarah N.",
    rating: 5,
    text: "From the showroom visit to delivery, everything was seamless. The bed frame and headboard are absolutely gorgeous. Premium quality without the premium price tag.",
    relative_time_description: "2 months ago",
    profile_photo_url: null,
    role: "Interior Designer, Lavington",
    source: "google",
  },
];

/**
 * Aggregate stats — update these when you connect to the Google Places API
 * or compute from your actual reviews array.
 */
export const reviewSummary = {
  averageRating: 4.9,
  totalReviews: 127,
  source: "Google Reviews",
};
