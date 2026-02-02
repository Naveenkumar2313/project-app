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
  DISPATCHED = 'Dispatched'
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
}

export interface Order {
  id: string;
  projectId: string;
  projectTitle: string;
  packageType: PackageType;
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery: string;
  plagiarismScore: number; // 0-100
}

export interface FaqItem {
  question: string;
  answer: string;
}
