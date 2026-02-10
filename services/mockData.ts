
import { Department, Difficulty, Order, OrderStatus, PackageType, Project, ProjectTier, SupportTicket, Testimonial, BlogPost, TeamMember, CommunityPost, Badge, FlashSale, Coupon } from '../types';

// ... (Previous PROJECTS array remains unchanged)
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
      { id: 'r1', projectId: 'p1', userId: 'u1', userName: 'Rahul K.', rating: 5, comment: 'Excellent kit! The components were high quality and the code worked perfectly.', date: '2023-10-12', helpfulCount: 12, isVerifiedPurchase: true, status: 'approved' },
      { id: 'r2', projectId: 'p1', userId: 'u2', userName: 'Priya S.', rating: 4, comment: 'Documentation was good but setting up the cloud dashboard took some time.', date: '2023-09-28', helpfulCount: 5, isVerifiedPurchase: true, status: 'approved' }
    ],
    rating: 4.8,
    reviewCount: 124,
    popularity: 95,
    dateAdded: '2023-08-15',
    inStock: true,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 45,
        [PackageType.FULL_BUILD]: 12
    },
    reorderLevel: 10
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
        { id: 'r3', projectId: 'p2', userId: 'u3', userName: 'Amit B.', rating: 5, comment: 'Project got approved instantly. Synopsis was very helpful.', date: '2023-11-01', helpfulCount: 8, isVerifiedPurchase: true, status: 'approved' }
    ],
    rating: 4.5,
    reviewCount: 89,
    popularity: 88,
    dateAdded: '2023-09-10',
    inStock: true,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 150, // Just webcam and setup guide
        [PackageType.FULL_BUILD]: 20
    },
    reorderLevel: 25
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
    inStock: true,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 8,
        [PackageType.FULL_BUILD]: 2
    },
    reorderLevel: 5
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
    inStock: true,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 9999, // Digital mainly
        [PackageType.FULL_BUILD]: 50
    },
    reorderLevel: 10
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
    inStock: true,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 25,
        [PackageType.FULL_BUILD]: 8
    },
    reorderLevel: 10
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
    inStock: false,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 0,
        [PackageType.FULL_BUILD]: 0
    },
    reorderLevel: 5
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
    inStock: true,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 15,
        [PackageType.FULL_BUILD]: 3
    },
    reorderLevel: 5
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
    inStock: true,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 40,
        [PackageType.FULL_BUILD]: 10
    },
    reorderLevel: 10
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
    inStock: true,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 20,
        [PackageType.FULL_BUILD]: 5
    },
    reorderLevel: 8
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
    inStock: true,
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 30,
        [PackageType.FULL_BUILD]: 6
    },
    reorderLevel: 10
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
    inventory: {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 50,
        [PackageType.FULL_BUILD]: 10
    },
    reorderLevel: 15,
    isPreOrder: true,
    releaseDate: '2024-03-01'
  }
];

export const FLASH_SALES: FlashSale[] = [
  {
    projectId: 'p1', // IoT Agriculture
    discountPrice: 1199, // Was 1499
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // 24 hours from now
  }
];

export const VALID_COUPONS: Coupon[] = [
  { code: 'WELCOME50', type: 'percent', value: 10, description: '10% Off Welcome Bonus', minOrder: 0 },
  { code: 'FLASH200', type: 'fixed', value: 200, description: 'Flat ₹200 Off', minOrder: 2000 },
  { code: 'STUDENT15', type: 'percent', value: 15, description: 'Student Discount (Verified)', minOrder: 0 }
];

// ... (Rest of existing Mock Data)
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
    deliveryDate: new Date(Date.now() - 86400000).toISOString(), // Delivered 24 hours ago
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
    message: 'I am getting a library error when compiling the code for the IoT Agriculture project. It says "WiFi.h not found". I have installed the board manager.',
    status: 'In Progress',
    priority: 'High',
    date: '2023-10-18T10:30:00Z',
    lastUpdated: '2023-10-18T14:45:00Z',
    type: 'Technical',
    replies: [
        {
            id: 'rep-1',
            sender: 'support',
            senderName: 'Tech Support',
            message: 'Hello, please ensure you have selected the correct board version in Arduino IDE. Could you share a screenshot of your Board Manager settings?',
            date: '2023-10-18T11:15:00Z'
        },
        {
            id: 'rep-2',
            sender: 'user',
            senderName: 'Student',
            message: 'I selected "DOIT ESP32 DEVKIT V1". Here is the screenshot.',
            date: '2023-10-18T12:00:00Z',
            attachments: ['screenshot_error.png']
        }
    ],
    attachments: ['error_log.txt']
  },
  {
    id: 'TKT-0905',
    subject: 'Invoice Request',
    message: 'Please provide a GST invoice for my last order #ord-qa-99.',
    status: 'Resolved',
    priority: 'Low',
    date: '2023-09-20T09:00:00Z',
    lastUpdated: '2023-09-21T10:00:00Z',
    type: 'Billing',
    replies: [
        {
            id: 'rep-3',
            sender: 'support',
            senderName: 'Billing Team',
            message: 'Your invoice has been generated and sent to your registered email.',
            date: '2023-09-21T10:00:00Z'
        }
    ]
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
    slug: 'how-to-choose-final-year-project',
    title: 'How to choose your Final Year Project?',
    excerpt: 'Selecting the right project is crucial. Learn how to balance complexity, cost, and innovation to impress your external examiner.',
    content: `
      <h2>The Importance of Selection</h2>
      <p>Your final year project is more than just a requirement; it's a portfolio piece that can define your early career. Recruiters often ask detailed questions about this project to gauge your technical depth and problem-solving skills.</p>
      
      <h3>1. Identify Your Interest</h3>
      <p>Do not pick a project just because it's easy. Choose something that genuinely excites you. If you love coding, go for AI or Blockchain. If you prefer hardware, look into Embedded Systems or Robotics.</p>
      
      <h3>2. Feasibility Analysis</h3>
      <p>Consider the cost of components, availability of resources, and the timeline. A complex project like a "Self-Driving Car" might be too ambitious for a 3-month timeline if you are starting from scratch.</p>
      
      <h3>3. Innovation vs. Implementation</h3>
      <p>You don't always need to invent something new. Implementing an existing concept with a novel approach or better efficiency is highly valued.</p>
      
      <blockquote>"The best project is one that works." - Dr. A. P. Rao</blockquote>
    `,
    author: 'Dr. A. P. Rao',
    authorRole: 'Senior Professor',
    authorAvatar: 'https://ui-avatars.com/api/?name=AP+Rao&background=0D8ABC&color=fff',
    date: '2023-11-05',
    category: 'Career Guide',
    tags: ['Student Guide', 'Tips', 'Career'],
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read'
  },
  {
    id: 'b2',
    slug: 'top-10-ece-projects-2024',
    title: 'Top 10 ECE Projects for 2024',
    excerpt: 'From IoT to Embedded Systems, check out the trending projects that are catching the attention of recruiters this year.',
    content: `
      <p>Electronics and Communication Engineering is evolving rapidly. Here are the top trends for this academic year.</p>
      
      <h3>1. 5G Antenna Design</h3>
      <p>With the rollout of 5G, antenna design using HFSS is a hot topic.</p>
      
      <h3>2. IoT based Health Monitoring</h3>
      <p>Post-pandemic, remote health monitoring systems are in high demand.</p>
      
      <h3>3. Smart Grid Management</h3>
      <p>Efficient energy distribution using IoT and ML.</p>
      
      <p>Stay tuned for our detailed breakdown of each project in the coming weeks.</p>
    `,
    author: 'Tech Team',
    authorRole: 'Editor',
    authorAvatar: 'https://ui-avatars.com/api/?name=Tech+Team&background=ea580c&color=fff',
    date: '2023-11-12',
    category: 'Trending',
    tags: ['ECE', 'IoT', 'Top 10'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read'
  },
  {
    id: 'b3',
    slug: 'arduino-vs-esp32',
    title: 'Understanding Arduino vs ESP32',
    excerpt: 'A technical deep dive into when to use the classic Arduino Uno versus the WiFi-enabled ESP32 for your IoT projects.',
    content: `
      <p>Choosing the right microcontroller is the first step in any embedded project.</p>
      
      <h3>Arduino Uno</h3>
      <ul>
        <li><strong>Pros:</strong> Easy to learn, huge community support, 5V logic.</li>
        <li><strong>Cons:</strong> No built-in WiFi/Bluetooth, limited processing power.</li>
      </ul>
      
      <h3>ESP32</h3>
      <ul>
        <li><strong>Pros:</strong> Built-in WiFi & Bluetooth, Dual Core, cheaper than Arduino + WiFi shield.</li>
        <li><strong>Cons:</strong> 3.3V logic (needs level shifter for some sensors), slightly steeper learning curve.</li>
      </ul>
      
      <h3>Verdict</h3>
      <p>For IoT projects, <strong>ESP32</strong> is the clear winner. For simple robotics, <strong>Arduino</strong> is still king.</p>
    `,
    author: 'Karthik S.',
    authorRole: 'IoT Engineer',
    authorAvatar: 'https://ui-avatars.com/api/?name=Karthik+S&background=10b981&color=fff',
    date: '2023-10-25',
    category: 'Technical',
    tags: ['Microcontrollers', 'Hardware', 'Comparison'],
    image: 'https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min read'
  },
  {
    id: 'b4',
    slug: 'ai-in-robotics',
    title: 'The Rise of AI in Robotics',
    excerpt: 'How machine learning is transforming simple line followers into autonomous navigation robots.',
    content: `
      <p>Robotics has moved beyond pre-programmed movements. With AI, robots can now perceive and adapt to their environment.</p>
      <h3>Computer Vision</h3>
      <p>Using cameras and OpenCV to detect obstacles and faces.</p>
      <h3>Reinforcement Learning</h3>
      <p>Teaching robots to walk or grasp objects through trial and error.</p>
    `,
    author: 'Sneha Patel',
    authorRole: 'Head of R&D',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    date: '2023-12-01',
    category: 'Technical',
    tags: ['AI', 'Robotics', 'Innovation'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read'
  },
  {
    id: 'b5',
    slug: 'writing-perfect-synopsis',
    title: 'Writing the Perfect Project Synopsis',
    excerpt: 'Templates and tips to get your project approved by the review committee on the first try.',
    content: `
      <p>A good synopsis sells your project before you even build it.</p>
      <h3>Structure</h3>
      <ol>
        <li><strong>Title:</strong> Catchy yet descriptive.</li>
        <li><strong>Problem Statement:</strong> What are you solving?</li>
        <li><strong>Objective:</strong> What is the end goal?</li>
        <li><strong>Methodology:</strong> Block diagrams and tools.</li>
      </ol>
    `,
    author: 'Dr. A. P. Rao',
    authorRole: 'Senior Professor',
    authorAvatar: 'https://ui-avatars.com/api/?name=AP+Rao&background=0D8ABC&color=fff',
    date: '2023-11-20',
    category: 'Career Guide',
    tags: ['Documentation', 'Academics'],
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read'
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

export const BADGES: Badge[] = [
  { id: 'b1', name: 'Project Pioneer', icon: 'Rocket', description: 'Completed your first project', dateEarned: '2023-10-15' },
  { id: 'b2', name: 'Code Wizard', icon: 'Code', description: 'Submitted 5 verified code snippets', dateEarned: '2023-11-01' },
  { id: 'b3', name: 'Helpful Hand', icon: 'ThumbsUp', description: 'Answered 10 forum questions', dateEarned: '2023-11-20' },
  { id: 'b4', name: 'Bug Hunter', icon: 'Bug', description: 'Reported a critical bug', dateEarned: '2023-12-05' }
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'cp1',
    userId: 'u101',
    userName: 'Aarav Gupta',
    userAvatar: 'https://ui-avatars.com/api/?name=Aarav&background=random',
    type: 'showcase',
    content: 'Finally completed my Smart Agriculture system! The soil moisture sensor works perfectly with the ESP32. Thanks Pygenicarc for the kit!',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    projectId: 'p1',
    projectTitle: 'IoT Smart Agriculture',
    likes: 45,
    commentsCount: 12,
    date: '2 hours ago',
    tags: ['IoT', 'ESP32', 'DIY']
  },
  {
    id: 'cp2',
    userId: 'u102',
    userName: 'Meera Iyer',
    userAvatar: 'https://ui-avatars.com/api/?name=Meera&background=random',
    type: 'discussion',
    title: 'Need help with Face Recognition accuracy',
    content: 'Has anyone tried using different lighting conditions for the Face Recognition project? My model struggles in low light. Any tips on preprocessing?',
    likes: 8,
    commentsCount: 5,
    date: '5 hours ago',
    tags: ['Computer Vision', 'Help', 'Python']
  },
  {
    id: 'cp3',
    userId: 'u103',
    userName: 'Rohan Mehta',
    userAvatar: 'https://ui-avatars.com/api/?name=Rohan&background=random',
    type: 'showcase',
    content: 'Build this Robotic Arm for my final year project. It can pick up objects up to 500g! Check out the wiring management.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    projectId: 'p7',
    projectTitle: '3-Axis Robotic Arm',
    likes: 89,
    commentsCount: 24,
    date: '1 day ago',
    tags: ['Robotics', 'Arduino', 'Mechanical']
  }
];
