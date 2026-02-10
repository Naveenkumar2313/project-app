
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

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Hostel"
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface ShippingRate {
  id: string;
  name: string; // e.g., "Standard Ground", "Express Air"
  carrier: string; // "Delhivery", "Blue Dart"
  price: number;
  estimatedDays: string; // "3-5 Days"
}

export interface TrackingEvent {
  date: string;
  location: string;
  status: string;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateEarned: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  department?: string;
  semester?: string;
  avatar?: string;
  role?: 'student' | 'admin';
  addresses?: Address[];
  points?: number;
  badges?: Badge[];
  completedProjectIds?: string[];
  isStudentVerified?: boolean;
}

export interface Review {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Specification {
  label: string;
  value: string;
}

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface TicketReply {
  id: string;
  sender: 'user' | 'support';
  senderName: string;
  avatar?: string;
  message: string;
  date: string;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: TicketPriority;
  date: string;
  lastUpdated: string;
  type: 'Technical' | 'Billing' | 'General';
  replies: TicketReply[];
  attachments?: string[];
}

export interface ProjectInventory {
  [PackageType.DIGITAL]: number;
  [PackageType.HARDWARE_KIT]: number;
  [PackageType.FULL_BUILD]: number;
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
  inStock: boolean;     // Deprecated logic, derived from inventory now
  inventory: ProjectInventory; // New Inventory Tracking
  reorderLevel: number;        // Low stock alert threshold
  isPreOrder?: boolean;
  releaseDate?: string;
  // New Detail Fields
  images: string[];
  videoUrl?: string;
  specifications: Specification[];
  faqs: { question: string; answer: string }[];
  reviews: Review[]; // Kept for backward compatibility in mock data structure
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
  carrier?: string;
  shippingCost?: number;
  shippingAddress?: Address;
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
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'showcase' | 'discussion';
  title?: string;
  content: string;
  image?: string;
  projectId?: string;
  projectTitle?: string;
  likes: number;
  commentsCount: number;
  date: string;
  tags?: string[];
  isLiked?: boolean; // Client-side state
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description: string;
  minOrder: number;
}

export interface FlashSale {
  projectId: string;
  discountPrice: number;
  endTime: string;
}
