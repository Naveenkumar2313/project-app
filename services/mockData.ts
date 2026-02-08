
import { Department, Difficulty, Order, OrderStatus, PackageType, Project, ProjectTier, SupportTicket, Testimonial, BlogPost, TeamMember } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'IoT Based Smart Agriculture System',
    description: 'A comprehensive system monitoring soil moisture, temperature, and humidity to automate irrigation. This project utilizes the ESP32 microcontroller to collect data from various sensors and transmit it to a cloud dashboard. Farmers can monitor their field conditions in real-time and control water pumps remotely.',
    department: Department.ECE,
    tier: ProjectTier.MAJOR,
    difficulty: Difficulty.MODERATE,
    components: ['ESP32', 'Soil Moisture Sensor', 'DHT11', 'Relay Module', 'Water Pump'],
    priceDigital: 1499,
    priceKit: 3499,
    priceBuild: 4999,
    imageUrl: 'https://images.unsplash.com/photo-1622383563227-044011cd58bf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622383563227-044011cd58bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    specifications: [
      { label: 'Microcontroller', value: 'ESP32 Wi-Fi + BT' },
      { label: 'Input Voltage', value: '5V - 12V DC' },
      { label: 'Communication', value: 'Wi-Fi 802.11 b/g/n' },
      { label: 'Sensors', value: 'Capacitive Soil Moisture, DHT11' },
      { label: 'Cloud Platform', value: 'Blynk / Thingspeak' }
    ],
    faqs: [
      { question: 'Does this project require internet?', answer: 'Yes, for the IoT features to work and send data to the cloud, an active internet connection is needed via WiFi.' },
      { question: 'Can we use Arduino Uno instead of ESP32?', answer: 'You can, but you would need an external WiFi module like ESP8266. ESP32 is recommended for better performance.' }
    ],
    reviews: [
      { id: 'r1', user: 'Rahul K.', rating: 5, comment: 'Excellent kit! The components were high quality and the code worked perfectly.', date: '2023-10-12' },
      { id: 'r2', user: 'Priya S.', rating: 4, comment: 'Documentation was good but setting up the cloud dashboard took some time.', date: '2023-09-28' }
    ],
    rating: 4.8,
    reviewCount: 124,
    popularity: 95,
    dateAdded: '2023-08-15',
    inStock: true
  },
  {
    id: 'p2',
    title: 'AI-Powered Attendance System Face Recognition',
    description: 'Python-based attendance logging system using OpenCV and deep learning models. This system eliminates manual attendance taking by recognizing faces from a live video feed and logging entry times into an Excel sheet or Database.',
    department: Department.CSE,
    tier: ProjectTier.MINI,
    difficulty: Difficulty.HARD,
    components: ['Python Source Code', 'Documentation', 'Dataset'],
    priceDigital: 999,
    priceKit: 1299, 
    priceBuild: 2499,
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { label: 'Language', value: 'Python 3.8+' },
      { label: 'Libraries', value: 'OpenCV, face_recognition, numpy, pandas' },
      { label: 'Accuracy', value: '98% on LFW dataset' },
      { label: 'Database', value: 'SQLite / Excel / Firebase' }
    ],
    faqs: [
      { question: 'Do I need a GPU?', answer: 'For real-time processing with many students, a GPU helps, but for a class of 50, a standard CPU is sufficient.' }
    ],
    reviews: [
        { id: 'r3', user: 'Amit B.', rating: 5, comment: 'Project got approved instantly. Synopsis was very helpful.', date: '2023-11-01' }
    ],
    rating: 4.5,
    reviewCount: 89,
    popularity: 88,
    dateAdded: '2023-09-10',
    inStock: true
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
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'],
    specifications: [],
    faqs: [],
    reviews: [],
    rating: 4.2,
    reviewCount: 45,
    popularity: 70,
    dateAdded: '2023-07-20',
    inStock: true
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
    priceKit: 2499,
    priceBuild: 3999,
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80'],
    specifications: [],
    faqs: [],
    reviews: [],
    rating: 4.9,
    reviewCount: 210,
    popularity: 98,
    dateAdded: '2023-10-01',
    inStock: true
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
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80'],
    specifications: [],
    faqs: [],
    reviews: [],
    rating: 4.3,
    reviewCount: 67,
    popularity: 60,
    dateAdded: '2023-06-15',
    inStock: true
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
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'],
    specifications: [],
    faqs: [],
    reviews: [],
    rating: 4.6,
    reviewCount: 34,
    popularity: 55,
    dateAdded: '2023-09-25',
    inStock: false
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
    imageUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80'],
    specifications: [],
    faqs: [],
    reviews: [],
    rating: 4.7,
    reviewCount: 156,
    popularity: 92,
    dateAdded: '2023-05-10',
    inStock: true
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
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80'],
    specifications: [],
    faqs: [],
    reviews: [],
    rating: 4.1,
    reviewCount: 28,
    popularity: 45,
    dateAdded: '2023-08-01',
    inStock: true
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
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80'],
    specifications: [],
    faqs: [],
    reviews: [],
    rating: 3.9,
    reviewCount: 15,
    popularity: 30,
    dateAdded: '2023-07-05',
    inStock: true
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
    imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?auto=format&fit=crop&w=800&q=80'],
    specifications: [],
    faqs: [],
    reviews: [],
    rating: 4.4,
    reviewCount: 52,
    popularity: 65,
    dateAdded: '2023-09-15',
    inStock: true
  },
  {
    id: 'p11',
    title: '5G Enabled Smart Traffic Management',
    description: 'Next-gen traffic control system using 5G low latency communication and edge computing. Currently in development for 2024 academic session.',
    department: Department.ECE,
    tier: ProjectTier.MAJOR,
    difficulty: Difficulty.HARD,
    components: ['Raspberry Pi 5', '5G Module', 'High-Res Camera'],
    priceDigital: 2999,
    priceKit: 8999,
    priceBuild: 12999,
    imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80'],
    specifications: [
        { label: 'Latency', value: '< 10ms' },
        { label: 'Network', value: '5G SA/NSA' }
    ],
    faqs: [],
    reviews: [],
    rating: 0,
    reviewCount: 0,
    popularity: 100,
    dateAdded: '2023-12-01',
    inStock: true,
    isPreOrder: true,
    releaseDate: '2024-03-01'
  }
];

// Set delivery date to 24 hours ago from now for testing defect report logic
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const MY_ORDERS: Order[] = [
  {
    id: 'ord-7821',
    projectId: 'p1',
    projectTitle: 'IoT Based Smart Agriculture System',
    packageType: PackageType.HARDWARE_KIT,
    status: OrderStatus.CODING,
    orderDate: '2023-10-15',
    estimatedDelivery: '2023-10-25',
    plagiarismScore: 12,
    supportExpiryDate: '2024-03-15',
    isFeedbackSubmitted: false,
    trackingNumber: 'AWB-8821-IN'
  },
  {
    id: 'ord-qa-99',
    projectId: 'p7',
    projectTitle: '3-Axis Robotic Arm',
    packageType: PackageType.FULL_BUILD,
    status: OrderStatus.DELIVERED,
    orderDate: '2023-10-01',
    estimatedDelivery: '2023-10-10',
    deliveryDate: yesterday.toISOString(), // Delivered 24 hours ago
    plagiarismScore: 5,
    supportExpiryDate: '2024-04-10',
    isFeedbackSubmitted: false,
    trackingNumber: 'AWB-ROBO-99'
  }
];

export const MY_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-1001',
    subject: 'Issue with ESP32 Code Compilation',
    message: 'I am getting a library error when compiling the code for the IoT Agriculture project.',
    status: 'In Progress',
    date: '2023-10-18',
    type: 'Technical'
  },
  {
    id: 'TKT-0905',
    subject: 'Invoice Request',
    message: 'Please provide a GST invoice for my last order.',
    status: 'Resolved',
    date: '2023-09-20',
    type: 'Billing'
  }
];

export const HELP_ARTICLES = [
    { id: 1, title: 'How to install Arduino IDE and Drivers?', category: 'Software Setup' },
    { id: 2, title: 'Troubleshooting Common Compilation Errors', category: 'Software Setup' },
    { id: 3, title: 'How to track your hardware kit delivery?', category: 'Shipping' },
    { id: 4, title: 'Cancellation and Refund Policy', category: 'Billing' },
    { id: 5, title: 'Guide to connecting ESP32 to WiFi', category: 'Technical' },
    { id: 6, title: 'How to request a custom modification?', category: 'General' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Suresh Raina',
    college: 'IIT Madras',
    projectTitle: 'IoT Agriculture System',
    quote: 'Pygenicarc not only provided the hardware kit but the code explanation was so clear I could answer all viva questions confidently.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    rating: 5
  },
  {
    id: 't2',
    name: 'Anjali Sharma',
    college: 'NIT Trichy',
    projectTitle: 'AI Face Recognition',
    quote: 'The synopsis they generated saved me days of work. The project was delivered on time and worked right out of the box.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5
  },
  {
    id: 't3',
    name: 'Vikram Singh',
    college: 'Anna University',
    projectTitle: 'Solar Tracking System',
    quote: 'Excellent support team. They helped me debug a connection issue via video call late at night.',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80',
    rating: 4
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'How to choose your Final Year Project?',
    excerpt: 'Selecting the right project is crucial. Learn how to balance complexity, cost, and innovation to impress your external examiner.',
    content: 'Full content regarding project selection...',
    author: 'Dr. A. P. Rao',
    date: '2023-11-05',
    category: 'Guide',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'b2',
    title: 'Top 10 ECE Projects for 2024',
    excerpt: 'From IoT to Embedded Systems, check out the trending projects that are catching the attention of recruiters this year.',
    content: 'Full list of ECE projects...',
    author: 'Tech Team',
    date: '2023-11-12',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'b3',
    title: 'Understanding Arduino vs ESP32',
    excerpt: 'A technical deep dive into when to use the classic Arduino Uno versus the WiFi-enabled ESP32 for your IoT projects.',
    content: 'Technical comparison...',
    author: 'Karthik S.',
    date: '2023-10-25',
    category: 'Technical',
    image: 'https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&w=800&q=80'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Rajesh Kumar',
    role: 'Founder & Lead Engineer',
    bio: 'Ex-ISRO Scientist with a passion for teaching practical engineering.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tm2',
    name: 'Sneha Patel',
    role: 'Head of R&D',
    bio: 'M.Tech in Embedded Systems. Expert in IoT and Robotics.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    linkedin: '#'
  },
  {
    id: 'tm3',
    name: 'Arun Verma',
    role: 'Student Success Manager',
    bio: 'Ensuring every student receives their kit on time and with proper guidance.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
  }
];
