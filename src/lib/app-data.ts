export type EmissionDay = { date: string; kg: number };

export const weeklyEmissions: EmissionDay[] = [
  { date: "Mon", kg: 12.3 },
  { date: "Tue", kg: 18.1 },
  { date: "Wed", kg: 9.4 },
  { date: "Thu", kg: 14.2 },
  { date: "Fri", kg: 16.8 },
  { date: "Sat", kg: 7.1 },
  { date: "Sun", kg: 6.5 },
];

export const monthlyEmissions: EmissionDay[] = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}`,
  kg: 8 + Math.round(Math.sin(i / 3) * 5 + Math.random() * 6),
}));

export const emissionBreakdown = [
  { source: "Transport", kg: 168, color: "var(--color-primary)" },
  { source: "Food", kg: 112, color: "var(--color-accent)" },
  { source: "Energy", kg: 86, color: "var(--color-chart-3)" },
  { source: "Shopping", kg: 41, color: "var(--color-chart-4)" },
  { source: "Other", kg: 21, color: "var(--color-chart-5)" },
];

export type HabitId =
  | "transit"
  | "walk"
  | "no-plastic"
  | "recycle"
  | "low-energy"
  | "reusable"
  | "water"
  | "meatless";

export const HABITS: { id: HabitId; label: string; icon: string; xp: number; co2: number }[] = [
  { id: "transit", label: "Used public transport", icon: "🚊", xp: 50, co2: 3.2 },
  { id: "walk", label: "Walked / cycled instead of drove", icon: "🚲", xp: 40, co2: 2.6 },
  { id: "no-plastic", label: "Avoided single-use plastic", icon: "🥤", xp: 25, co2: 0.4 },
  { id: "recycle", label: "Recycled waste", icon: "♻️", xp: 20, co2: 0.6 },
  { id: "low-energy", label: "Cut electricity usage", icon: "💡", xp: 35, co2: 1.8 },
  { id: "reusable", label: "Used reusable containers", icon: "🥡", xp: 20, co2: 0.3 },
  { id: "water", label: "Conserved water", icon: "💧", xp: 25, co2: 0.5 },
  { id: "meatless", label: "Meat-free meal", icon: "🥗", xp: 45, co2: 2.4 },
];

export const CHALLENGES = [
  { id: "plastic-free", title: "Plastic-Free Week", days: 7, progress: 4, xp: 500, desc: "Skip every single-use plastic for 7 days." },
  { id: "green-commute", title: "Green Commute Challenge", days: 14, progress: 9, xp: 800, desc: "Replace car trips with walking, cycling, or transit." },
  { id: "low-energy", title: "Low Energy Challenge", days: 10, progress: 2, xp: 600, desc: "Cut household electricity 20% for 10 days." },
  { id: "water", title: "Water Conservation", days: 7, progress: 0, xp: 400, desc: "Save 50L of water per day through small changes." },
  { id: "eco-shop", title: "Eco Shopping Challenge", days: 7, progress: 0, xp: 450, desc: "Buy only second-hand or low-impact items." },
];

export const LEVELS = ["Seedling", "Eco Explorer", "Green Warrior", "Climate Champion", "Earth Guardian"];

export const LEADERBOARD = [
  { name: "Lina H.", xp: 14820, badge: "Climate Champion" },
  { name: "Marcus T.", xp: 12640, badge: "Climate Champion" },
  { name: "You", xp: 9420, badge: "Green Warrior", you: true },
  { name: "Aiko N.", xp: 8950, badge: "Green Warrior" },
  { name: "Priya R.", xp: 7210, badge: "Eco Explorer" },
  { name: "Sam B.", xp: 6440, badge: "Eco Explorer" },
];

export const LEARN_TOPICS = [
  { id: "basics", title: "Climate change basics", minutes: 6, tag: "Foundation", desc: "What's actually happening to the atmosphere — and what you can do about it." },
  { id: "footprint", title: "What is a carbon footprint?", minutes: 4, tag: "Foundation", desc: "The everyday choices that secretly drive your emissions." },
  { id: "energy", title: "Renewable energy 101", minutes: 8, tag: "Energy", desc: "Solar, wind, geothermal — what to install, what to ignore." },
  { id: "waste", title: "The waste reduction playbook", minutes: 5, tag: "Habits", desc: "Composting, recycling done right, and the 'refuse first' rule." },
  { id: "diet", title: "Eating for the planet", minutes: 7, tag: "Food", desc: "Why one plant-forward day a week beats 'going vegan' for most people." },
  { id: "travel", title: "Low-impact travel", minutes: 6, tag: "Transport", desc: "Trains, EVs, and when offsets actually matter." },
];

export function tonsToTrees(kg: number) {
  return Math.round(kg / 21); // 1 mature tree absorbs ~21 kg/yr
}

export function kgToKm(kg: number) {
  return Math.round(kg / 0.12); // ~120g/km average car
}