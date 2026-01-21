
export interface TimelineStep {
  id: string;
  time: string;
  action: string;
  notes?: string;
  image?: string;
}

export interface BakersPercentage {
  flour: number;
  water: number;
  starter: number;
  salt: number;
}

export interface BakeEntry {
  id: string;
  batchNumber: number;
  title: string;
  date: string;
  intro: string;
  kitchenTemp: number; // in Celsius
  percentages: BakersPercentage;
  timeline: TimelineStep[];
  coverImage: string;
}

export interface BakeComment {
  id: string;
  bake_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
}

export interface CalculatorState {
  totalFlour: number;
  hydrationPercent: number;
  starterPercent: number;
  saltPercent: number;
}
