// ── Event Image Service ──
// Returns a relevant Unsplash photo URL based on event title keywords

const IMAGE_MAP = [
  { keywords: ["tech", "summit", "conference", "digital", "ai", "software", "cloud", "hackathon"], url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
  { keywords: ["launch", "product", "startup", "pitch", "demo"], url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80" },
  { keywords: ["team", "building", "retreat", "offsite", "workshop", "training"], url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" },
  { keywords: ["gala", "award", "ceremony", "formal", "dinner", "banquet"], url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80" },
  { keywords: ["concert", "music", "festival", "live", "performance", "show"], url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" },
  { keywords: ["wedding", "anniversary", "engagement", "celebration", "party"], url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" },
  { keywords: ["sport", "marathon", "race", "tournament", "championship", "fitness"], url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80" },
  { keywords: ["charity", "fundraiser", "nonprofit", "volunteer", "community"], url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80" },
  { keywords: ["expo", "trade", "fair", "exhibition", "showcase"], url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80" },
  { keywords: ["networking", "meetup", "forum", "panel", "seminar"], url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80" },
];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80";

export function getEventImage(title = "") {
  const lower = title.toLowerCase();
  const match = IMAGE_MAP.find(({ keywords }) =>
    keywords.some((kw) => lower.includes(kw))
  );
  return match ? match.url : DEFAULT_IMAGE;
}
