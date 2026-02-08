import { Department, Difficulty, Order, OrderStatus, PackageType, Project, ProjectTier } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'IoT Based Smart Agriculture System',
    description: 'A comprehensive system monitoring soil moisture, temperature, and humidity to automate irrigation.',
    department: Department.ECE,
    tier: ProjectTier.MAJOR,
    difficulty: Difficulty.MODERATE,
    components: ['ESP32', 'Soil Moisture Sensor', 'DHT11', 'Relay Module', 'Water Pump'],
    priceDigital: 1499,
    priceKit: 3499,
    priceBuild: 4999,
    // Image: Smart farming / Plant with technology
    imageUrl: 'https://images.unsplash.com/photo-1622383563227-044011cd58bf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p2',
    title: 'AI-Powered Attendance System Face Recognition',
    description: 'Python-based attendance logging system using OpenCV and deep learning models.',
    department: Department.CSE,
    tier: ProjectTier.MINI,
    difficulty: Difficulty.HARD,
    components: ['Python Source Code', 'Documentation', 'Dataset'],
    priceDigital: 999,
    priceKit: 1299, // Kit includes Camera module
    priceBuild: 2499, // Includes Raspberry Pi setup
    // Image: Artificial Intelligence / Facial Recognition Concept
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p3',
    title: 'Automatic Pneumatic Bumper System',
    description: 'Mechanical project demonstrating automatic braking and bumper deployment using pneumatic cylinders.',
    department: Department.MECH,
    tier: ProjectTier.MAJOR,
    difficulty: Difficulty.MODERATE,
    components: ['Pneumatic Cylinder', 'Solenoid Valve', 'IR Sensor', 'Control Unit', 'Frame'],
    priceDigital: 1999,
    priceKit: 5999,
    priceBuild: 8999,
    // Image: Mechanical Engineering / Industrial Automation
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p4',
    title: 'Blockchain Based Voting System',
    description: 'Secure and transparent voting application utilizing Ethereum smart contracts.',
    department: Department.CSE,
    tier: ProjectTier.MAJOR,
    difficulty: Difficulty.HARD,
    components: ['Solidity Contracts', 'React Frontend', 'Truffle Config'],
    priceDigital: 2499,
    priceKit: 2499, // Digital only mostly
    priceBuild: 3999, // Deployment service
    // Image: Blockchain / Digital Security
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p5',
    title: 'Solar Tracking System',
    description: 'Dual-axis solar tracker using Arduino to maximize energy efficiency.',
    department: Department.EEE,
    tier: ProjectTier.MINI,
    difficulty: Difficulty.EASY,
    components: ['Arduino Uno', 'Servo Motors', 'LDR Sensors', 'Solar Panel'],
    priceDigital: 899,
    priceKit: 2199,
    priceBuild: 3299,
    // Image: Solar Panels / Renewable Energy
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p6',
    title: 'Smart Grid Load Management System',
    description: 'IoT-enabled system for monitoring and managing electrical load distribution to prevent outages.',
    department: Department.EEE,
    tier: ProjectTier.MAJOR,
    difficulty: Difficulty.HARD,
    components: ['Arduino Mega', 'Current Sensor ACS712', 'Relay Module', 'WiFi Module', 'LCD Display'],
    priceDigital: 1299,
    priceKit: 2899,
    priceBuild: 4599,
    // Image: Electrical Grid / Smart Meter
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p7',
    title: '3-Axis Robotic Arm',
    description: 'Programmable robotic arm capable of pick-and-place operations with 3 degrees of freedom.',
    department: Department.MECH,
    tier: ProjectTier.MAJOR,
    difficulty: Difficulty.MODERATE,
    components: ['Servo Motors MG995', 'Arduino Uno', 'Acrylic Chassis', 'Potentiometers', 'Power Supply'],
    priceDigital: 1599,
    priceKit: 6499,
    priceBuild: 9499,
    // Image: Industrial Robot Arm
    imageUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p8',
    title: 'Wireless Power Transfer for EV',
    description: 'Prototype demonstrating inductive coupling to charge Electric Vehicles wirelessly.',
    department: Department.EEE,
    tier: ProjectTier.MINI,
    difficulty: Difficulty.MODERATE,
    components: ['Copper Coils', 'Power Transistors', 'Capacitors', 'Rectifier Circuit', 'LED Load'],
    priceDigital: 899,
    priceKit: 2299,
    priceBuild: 3599,
    // Image: Wireless Charging / EV
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p9',
    title: 'Electromagnetic Braking System',
    description: 'Frictionless braking mechanism using eddy currents for modern automotive safety.',
    department: Department.MECH,
    tier: ProjectTier.MINI,
    difficulty: Difficulty.EASY,
    components: ['Electromagnet', 'Aluminum Disc', 'Motor', 'Frame', 'Switch'],
    priceDigital: 1099,
    priceKit: 3499,
    priceBuild: 4999,
    // Image: Car Brakes / Mechanical
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p10',
    title: 'GSM Based Substation Monitoring',
    description: 'Remote health monitoring system for distribution transformers using SMS alerts.',
    department: Department.EEE,
    tier: ProjectTier.MAJOR,
    difficulty: Difficulty.MODERATE,
    components: ['GSM Module SIM900A', 'Temperature Sensor', 'Voltage Sensor', 'Arduino', 'Relay'],
    priceDigital: 1499,
    priceKit: 3899,
    priceBuild: 5299,
    // Image: Electrical Substation
    imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?auto=format&fit=crop&w=800&q=80'
  }
];

export const MY_ORDERS: Order[] = [
  {
    id: 'ord-7821',
    projectId: 'p1',
    projectTitle: 'IoT Based Smart Agriculture System',
    packageType: PackageType.HARDWARE_KIT,
    status: OrderStatus.CODING,
    orderDate: '2023-10-15',
    estimatedDelivery: '2023-10-25',
    plagiarismScore: 12
  }
];
