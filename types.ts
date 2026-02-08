
export enum Department {
  CSE = 'CSE',
  ECE = 'ECE',
  MECH = 'MECH',
  EEE = 'EEE'
}

export enum ProjectTier {
  MINI = 'Mini',
  MAJOR = 'Major'
}

export enum Difficulty {
  EASY = 'Easy',
  MODERATE = 'Moderate',
  HARD = 'Hard'
}

export enum PackageType {
  DIGITAL = 'Digital Only',
  HARDWARE_KIT = 'Hardware Kit',
  FULL_BUILD = 'Full Build'
}

export enum OrderStatus {
  PAYMENT_VERIFIED = 'Payment Verified',
  PROCURING = 'Procuring',
  CODING = 'Coding',
  TESTING = 'Testing',
  DISPATCHED = 'Dispatched',
  DELIVERED = 'Delivered'
}

export interface Review {
  id: string;
  user: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  type: 'Technical' | 'Billing' | 'General';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  department: Department;
  tier: ProjectTier;
  difficulty: Difficulty;
  components: string[];
  priceDigital: number;
  priceKit: number;
  priceBuild: number;
  imageUrl: string;
  // New Discovery Fields
  rating: number;       // 0.0 to 5.0
  reviewCount: number;
  popularity: number;   // 0 to 100 score
  dateAdded: string;    // ISO Date
  inStock: boolean;
  isPreOrder?: boolean;
  releaseDate?: string;
  // New Detail Fields
  images: string[];
  videoUrl?: string;
  specifications: Specification[];
  faqs: { question: string; answer: string }[];
  reviews: Review[];
}

export interface Order {
  id: string;
  projectId: string;
  projectTitle: string;
  packageType: PackageType;
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery: string;
  deliveryDate?: string; // ISO Date string
  plagiarismScore: number; // 0-100
  // New Dashboard Features
  trackingNumber?: string;
  supportExpiryDate?: string;
  isFeedbackSubmitted?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  college: string;
  projectTitle: string;
  quote: string;
  image: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  author: string;
  date: string;
  category: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
}
