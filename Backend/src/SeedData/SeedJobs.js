// seedJobs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../Models/Job.js"; // adjust path to your Job model

dotenv.config();

const seedJobs = async () => {
  try {
    await mongoose.connect("mongodb+srv://coppercloud2023:sOoFdXTHbRmv6vQ8@cluster0.imnm6.mongodb.net/MyPlatfromIOT", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Connected to MongoDB");

    const createdBy = "68b0501600afddf2a4b28c51"; // Example User ID

 const jobs = [
  // HR Department Jobs
  {
    jobTitle: "HR Manager",
    jobLocation: "Hinjewadi Phase-1, Pune (WFO)",
    experience: "5-8 Years",
    shift: "10.00AM - 7.00PM IST Monday to Friday",
    department: "hr",
    jobDescription: "We are seeking an experienced HR Manager to lead our human resources department. You will be responsible for developing HR strategies, managing employee relations, and ensuring compliance with labor laws while fostering a positive work environment.",
    keyResponsibilities: [
      "Develop and implement HR strategies aligned with business objectives",
      "Oversee recruitment, onboarding, and employee development programs",
      "Manage employee relations, performance management, and disciplinary actions",
      "Ensure compliance with labor laws and company policies",
      "Lead compensation and benefits administration",
      "Handle employee grievances and conflict resolution",
      "Develop training programs and career development initiatives"
    ],
    requiredSkills: [
      "Master's degree in HR Management or related field",
      "5+ years of HR management experience",
      "Strong knowledge of labor laws and HR best practices",
      "Excellent communication and leadership skills",
      "Experience with HRIS systems",
      "Conflict resolution and negotiation skills",
      "Performance management expertise"
    ],
     createdBy: createdBy,
    applicationDeadline: new Date("2025-09-15"),
    maxApplications: 50,
    currentApplications: 12
  },
  {
    jobTitle: "HR Executive",
    jobLocation: "Hinjewadi Phase-2, Pune (Hybrid)",
    experience: "2-4 Years",
    shift: "9.30AM - 6.30PM IST Monday to Friday",
    department: "hr",
    jobDescription: "We are looking for a dedicated HR Executive to support our HR operations. You will assist in recruitment processes, employee onboarding, maintain HR records, and support various HR initiatives to ensure smooth organizational functioning.",
    keyResponsibilities: [
      "Assist in end-to-end recruitment process from sourcing to onboarding",
      "Maintain employee records and HR databases",
      "Support payroll processing and benefits administration",
      "Coordinate training sessions and employee engagement activities",
      "Handle initial employee queries and grievances",
      "Assist in policy formulation and implementation",
      "Prepare HR reports and analytics"
    ],
    requiredSkills: [
      "Bachelor's degree in HR, Psychology, or related field",
      "2+ years of HR experience",
      "Knowledge of recruitment and selection processes",
      "Proficiency in MS Office and HR software",
      "Strong interpersonal and communication skills",
      "Understanding of labor laws",
      "Attention to detail and organizational skills"
    ],
    createdBy:createdBy,
    applicationDeadline: new Date("2025-09-20"),
    maxApplications: 80,
    currentApplications: 23
  },
  {
    jobTitle: "HR Intern",
    jobLocation: "Hinjewadi Phase-1, Pune (WFO)",
    experience: "0-6 Months",
    shift: "10.00AM - 5.00PM IST Monday to Friday",
    department: "hr",
    jobDescription: "We offer an exciting HR internship opportunity for fresh graduates or students pursuing HR studies. You will gain hands-on experience in various HR functions and learn about modern HR practices in a dynamic work environment.",
    keyResponsibilities: [
      "Assist in recruitment activities and candidate screening",
      "Support employee onboarding and documentation",
      "Help maintain HR records and filing systems",
      "Assist in organizing employee engagement events",
      "Support HR team in administrative tasks",
      "Participate in training sessions and workshops",
      "Help prepare basic HR reports and presentations"
    ],
    requiredSkills: [
      "Pursuing or completed Bachelor's degree in HR or related field",
      "Basic knowledge of HR concepts",
      "Good communication and interpersonal skills",
      "Proficiency in MS Office applications",
      "Eagerness to learn and adapt",
      "Strong organizational skills",
      "Professional attitude and confidentiality"
    ],
    createdBy: createdBy,
    applicationDeadline: new Date("2025-09-10"),
    maxApplications: 100,
    currentApplications: 45
  },

  // IoT Department Jobs
  {
    jobTitle: "IoT Engineering Manager",
    jobLocation: "Hinjewadi Phase-3, Pune (WFO)",
    experience: "7-10 Years",
    shift: "9.00AM - 6.00PM IST Monday to Friday",
    department: "iot",
    jobDescription: "We are seeking an experienced IoT Engineering Manager to lead our IoT development team. You will be responsible for overseeing IoT projects, managing technical teams, and driving innovation in IoT solutions while ensuring project delivery and technical excellence.",
    keyResponsibilities: [
      "Lead and manage a team of IoT engineers and developers",
      "Define IoT architecture and technical roadmaps",
      "Oversee end-to-end IoT project delivery from concept to deployment",
      "Collaborate with product management and business teams",
      "Ensure best practices in IoT security and scalability",
      "Manage technical resources and project timelines",
      "Drive innovation in IoT technologies and solutions"
    ],
    requiredSkills: [
      "Master's degree in Electronics, Computer Engineering, or related field",
      "7+ years of IoT development and 3+ years of management experience",
      "Expertise in IoT protocols (MQTT, CoAP, HTTP, TCP/IP)",
      "Experience with cloud platforms (AWS IoT, Azure IoT, Google Cloud IoT)",
      "Strong leadership and project management skills",
      "Knowledge of embedded systems and microcontrollers",
      "Understanding of IoT security and edge computing"
    ],
    createdBy: createdBy,
    applicationDeadline: new Date("2025-09-25"),
    maxApplications: 30,
    currentApplications: 8
  },
  {
    jobTitle: "Associate IoT Engineer",
    jobLocation: "Hinjewadi Phase-1, Pune (WFO)",
    experience: "0.5-1 Years",
    shift: "12.00PM - 9.00PM IST Monday to Friday",
    department: "iot",
    jobDescription: "We are seeking a motivated and detail-oriented Associate IoT Engineer to join our engineering team. In this role, you will assist in the design, development, testing, and deployment of IoT solutions. You will work closely with senior engineers and cross-functional teams to integrate hardware and software systems, enabling connectivity, data collection, and remote control of devices.",
    keyResponsibilities: [
      "Assist in the design and implementation of IoT systems including device integration, cloud communication, and data analytics",
      "Develop and test firmware for microcontrollers and IoT sensors using languages such as C/C++, Python, or embedded Java",
      "Collaborate with hardware engineers to integrate sensors, actuators, and communication modules (e.g., Wi-Fi, Bluetooth, LoRa, Zigbee)",
      "Support the development of APIs and cloud services to collect, store, and analyze sensor data (e.g., AWS IoT, Azure IoT, Google Cloud IoT)",
      "Participate in prototyping and field-testing IoT devices and systems",
      "Assist in troubleshooting, debugging, and optimizing IoT device performance",
      "Document system configurations, test procedures, and user manuals",
      "Stay updated with the latest IoT trends, protocols, and technologies"
    ],
    requiredSkills: [
      "Bachelor's degree in Electronics, Computer Engineering, Electrical Engineering, or related field",
      "Basic understanding of embedded systems and microcontroller programming",
      "Familiarity with IoT communication protocols such as MQTT, CoAP, HTTP, and TCP/IP",
      "Some exposure to cloud platforms and APIs for IoT integration",
      "Strong problem-solving skills and willingness to learn new technologies",
      "Internship or academic project experience in IoT or embedded systems",
      "Knowledge of cybersecurity practices in IoT environments",
      "Familiarity with edge computing and real-time data processing",
      "Experience with version control tools like Git"
    ],
    createdBy:createdBy,
    applicationDeadline: new Date("2025-09-18"),
    maxApplications: 75,
    currentApplications: 32
  },
  {
    jobTitle: "IoT Development Intern",
    jobLocation: "Hinjewadi Phase-2, Pune (Hybrid)",
    experience: "0-3 Months",
    shift: "10.00AM - 5.00PM IST Monday to Friday",
    department: "iot",
    jobDescription: "We offer an exciting IoT development internship for engineering students or recent graduates. You will gain hands-on experience in IoT technologies, embedded systems, and cloud integration while working on real-world IoT projects.",
    keyResponsibilities: [
      "Assist in basic IoT device programming and testing",
      "Support senior engineers in hardware integration tasks",
      "Help with sensor data collection and basic analysis",
      "Participate in IoT project documentation",
      "Learn and practice IoT communication protocols",
      "Assist in prototyping and testing IoT solutions",
      "Support maintenance of IoT development tools and environments"
    ],
    requiredSkills: [
      "Pursuing Bachelor's degree in Electronics, Computer Science, or related field",
      "Basic programming knowledge in C/C++ or Python",
      "Understanding of basic electronics and circuits",
      "Familiarity with microcontrollers (Arduino, Raspberry Pi)",
      "Interest in IoT technologies and embedded systems",
      "Problem-solving mindset and eagerness to learn",
      "Basic knowledge of networking concepts"
    ],
    createdBy:createdBy,
    applicationDeadline: new Date("2025-09-12"),
    maxApplications: 120,
    currentApplications: 67
  },

  // Software Department Jobs
  {
    jobTitle: "Software Development Manager",
    jobLocation: "Hinjewadi Phase-2, Pune (Hybrid)",
    experience: "6-9 Years",
    shift: "10.00AM - 7.00PM IST Monday to Friday",
    department: "software",
    jobDescription: "We are looking for an experienced Software Development Manager to lead our development team. You will be responsible for overseeing software projects, managing development teams, ensuring code quality, and driving technical innovation while meeting business objectives.",
    keyResponsibilities: [
      "Lead and manage software development teams across multiple projects",
      "Define technical architecture and development standards",
      "Oversee full software development lifecycle from requirements to deployment",
      "Collaborate with product managers and stakeholders on project planning",
      "Ensure code quality, security, and performance standards",
      "Manage technical resources and project timelines",
      "Drive adoption of best practices and modern development methodologies",
      "Mentor and develop team members' technical and professional skills"
    ],
    requiredSkills: [
      "Bachelor's/Master's degree in Computer Science or related field",
      "6+ years of software development and 3+ years of management experience",
      "Expertise in modern programming languages and frameworks",
      "Experience with cloud platforms (AWS, Azure, GCP)",
      "Strong understanding of software architecture and design patterns",
      "Knowledge of DevOps practices and CI/CD pipelines",
      "Excellent leadership and communication skills",
      "Experience with Agile/Scrum methodologies"
    ],
    createdBy: createdBy,
    applicationDeadline: new Date("2025-09-22"),
    maxApplications: 40,
    currentApplications: 15
  },
  {
    jobTitle: "Software Engineer",
    jobLocation: "Hinjewadi Phase-1, Pune (WFO)",
    experience: "2-4 Years",
    shift: "9.30AM - 6.30PM IST Monday to Friday",
    department: "software",
    jobDescription: "We are seeking a skilled Software Engineer to join our development team. You will be responsible for designing, developing, and maintaining high-quality software applications while collaborating with cross-functional teams to deliver innovative solutions.",
    keyResponsibilities: [
      "Design, develop, and maintain software applications and systems",
      "Write clean, efficient, and well-documented code",
      "Participate in code reviews and maintain coding standards",
      "Collaborate with designers, product managers, and other engineers",
      "Debug and resolve software defects and performance issues",
      "Implement automated testing and quality assurance practices",
      "Stay updated with latest technologies and development trends",
      "Contribute to technical documentation and knowledge sharing"
    ],
    requiredSkills: [
      "Bachelor's degree in Computer Science, Engineering, or related field",
      "2+ years of software development experience",
      "Proficiency in programming languages (Java, Python, JavaScript, etc.)",
      "Experience with web frameworks and databases",
      "Knowledge of version control systems (Git)",
      "Understanding of software testing methodologies",
      "Problem-solving and analytical thinking skills",
      "Experience with API development and integration"
    ],
    createdBy: createdBy,
    applicationDeadline: new Date("2025-09-20"),
    maxApplications: 90,
    currentApplications: 41
  },
  {
    jobTitle: "Software Development Intern",
    jobLocation: "Hinjewadi Phase-3, Pune (Hybrid)",
    experience: "0-6 Months",
    shift: "10.00AM - 5.00PM IST Monday to Friday",
    department: "software",
    jobDescription: "We offer an exciting software development internship for computer science students or recent graduates. You will work on real projects, learn modern development practices, and gain hands-on experience in software engineering.",
    keyResponsibilities: [
      "Assist in software development projects under senior developer guidance",
      "Write and test code for various application features",
      "Participate in code reviews and team meetings",
      "Help with debugging and fixing software issues",
      "Contribute to documentation and technical specifications",
      "Learn and apply software development best practices",
      "Support testing and quality assurance activities"
    ],
    requiredSkills: [
      "Pursuing or completed Bachelor's degree in Computer Science or related field",
      "Basic programming knowledge in at least one language",
      "Understanding of fundamental programming concepts",
      "Familiarity with databases and web technologies",
      "Strong problem-solving and learning attitude",
      "Good communication and teamwork skills",
      "Basic knowledge of software development lifecycle"
    ],
    createdBy:createdBy,
    applicationDeadline: new Date("2025-09-15"),
    maxApplications: 150,
    currentApplications: 89
  },

  // Financial Department Jobs
  {
    jobTitle: "Finance Manager",
    jobLocation: "Hinjewadi Phase-1, Pune (WFO)",
    experience: "5-8 Years",
    shift: "9.00AM - 6.00PM IST Monday to Friday",
    department: "financial",
    jobDescription: "We are seeking an experienced Finance Manager to oversee our financial operations. You will be responsible for financial planning, analysis, reporting, and ensuring compliance with financial regulations while supporting strategic business decisions.",
    keyResponsibilities: [
      "Oversee financial planning, budgeting, and forecasting processes",
      "Prepare and analyze financial reports and statements",
      "Ensure compliance with accounting standards and regulations",
      "Manage cash flow, accounts payable, and receivable operations",
      "Conduct financial analysis to support business decisions",
      "Coordinate with auditors and tax consultants",
      "Develop financial policies and procedures",
      "Monitor financial performance and identify improvement opportunities"
    ],
    requiredSkills: [
      "Master's degree in Finance, Accounting, or related field",
      "5+ years of finance and accounting experience",
      "Professional certification (CPA, CMA, or equivalent) preferred",
      "Expertise in financial analysis and reporting",
      "Knowledge of accounting software and ERP systems",
      "Strong analytical and problem-solving skills",
      "Understanding of tax regulations and compliance",
      "Excellent leadership and communication skills"
    ],
    createdBy:createdBy,
    applicationDeadline: new Date("2025-09-28"),
    maxApplications: 35,
    currentApplications: 11
  },
  {
    jobTitle: "Financial Analyst",
    jobLocation: "Hinjewadi Phase-2, Pune (Hybrid)",
    experience: "2-4 Years",
    shift: "10.00AM - 7.00PM IST Monday to Friday",
    department: "financial",
    jobDescription: "We are looking for a detail-oriented Financial Analyst to support our finance team. You will be responsible for financial modeling, data analysis, reporting, and providing insights to support business decision-making processes.",
    keyResponsibilities: [
      "Perform financial analysis and create detailed financial models",
      "Prepare monthly, quarterly, and annual financial reports",
      "Analyze financial data to identify trends and variances",
      "Support budgeting and forecasting processes",
      "Assist in cost analysis and pricing decisions",
      "Conduct competitor and market analysis",
      "Prepare presentations for management and stakeholders",
      "Support audit processes and compliance activities"
    ],
    requiredSkills: [
      "Bachelor's degree in Finance, Accounting, Economics, or related field",
      "2+ years of financial analysis experience",
      "Advanced proficiency in Excel and financial modeling",
      "Knowledge of accounting principles and financial statements",
      "Experience with financial software and databases",
      "Strong analytical and quantitative skills",
      "Attention to detail and accuracy",
      "Good communication and presentation skills"
    ],
    createdBy:createdBy,
    applicationDeadline: new Date("2025-09-25"),
    maxApplications: 70,
    currentApplications: 28
  },
  {
    jobTitle: "Finance Intern",
    jobLocation: "Hinjewadi Phase-1, Pune (WFO)",
    experience: "0-6 Months",
    shift: "9.30AM - 4.30PM IST Monday to Friday",
    department: "financial",
    jobDescription: "We offer a comprehensive finance internship program for students pursuing finance or accounting degrees. You will gain practical experience in financial operations, analysis, and reporting while learning from experienced finance professionals.",
    keyResponsibilities: [
      "Assist in data entry and maintenance of financial records",
      "Support preparation of basic financial reports",
      "Help with invoice processing and payment reconciliation",
      "Assist in budget preparation and expense tracking",
      "Support audit preparations and documentation",
      "Learn financial analysis techniques and tools",
      "Participate in finance team meetings and training sessions"
    ],
    requiredSkills: [
      "Pursuing Bachelor's degree in Finance, Accounting, or related field",
      "Basic understanding of accounting principles",
      "Proficiency in MS Excel and basic computer skills",
      "Strong numerical and analytical abilities",
      "Attention to detail and accuracy",
      "Good organizational and time management skills",
      "Professional attitude and eagerness to learn"
    ],
    createdBy: createdBy,
    applicationDeadline: new Date("2025-09-12"),
    maxApplications: 80,
    currentApplications: 34
  },

  // Business Department Jobs
  {
    jobTitle: "Business Development Manager",
    jobLocation: "Hinjewadi Phase-3, Pune (Hybrid)",
    experience: "4-7 Years",
    shift: "10.00AM - 7.00PM IST Monday to Friday",
    department: "business",
    jobDescription: "We are seeking a dynamic Business Development Manager to drive our growth initiatives. You will be responsible for identifying new business opportunities, building strategic partnerships, and developing go-to-market strategies to expand our market presence.",
    keyResponsibilities: [
      "Identify and evaluate new business opportunities and markets",
      "Build and maintain relationships with key clients and partners",
      "Develop and execute business development strategies",
      "Conduct market research and competitive analysis",
      "Prepare proposals, presentations, and contract negotiations",
      "Collaborate with sales and marketing teams on lead generation",
      "Monitor industry trends and market developments",
      "Achieve business development targets and KPIs"
    ],
    requiredSkills: [
      "Bachelor's/Master's degree in Business Administration or related field",
      "4+ years of business development or sales experience",
      "Strong networking and relationship-building skills",
      "Excellent communication and presentation abilities",
      "Strategic thinking and analytical skills",
      "Experience in market research and analysis",
      "Knowledge of CRM systems and sales processes",
      "Results-driven with strong negotiation skills"
    ],
    createdBy: createdBy,
    applicationDeadline: new Date("2025-09-30"),
    maxApplications: 45,
    currentApplications: 19
  },
  {
    jobTitle: "Business Analyst",
    jobLocation: "Hinjewadi Phase-1, Pune (WFO)",
    experience: "2-4 Years",
    shift: "9.00AM - 6.00PM IST Monday to Friday",
    department: "business",
    jobDescription: "We are looking for a skilled Business Analyst to bridge the gap between business needs and technical solutions. You will be responsible for analyzing business processes, gathering requirements, and recommending improvements to enhance operational efficiency.",
    keyResponsibilities: [
      "Analyze business processes and identify improvement opportunities",
      "Gather and document business requirements from stakeholders",
      "Create detailed functional specifications and process flows",
      "Collaborate with technical teams to ensure solution alignment",
      "Conduct data analysis to support business decisions",
      "Facilitate meetings between business and technical teams",
      "Prepare reports and presentations for management",
      "Support system testing and user acceptance testing"
    ],
    requiredSkills: [
      "Bachelor's degree in Business Administration, IT, or related field",
      "2+ years of business analysis experience",
      "Strong analytical and problem-solving skills",
      "Proficiency in requirements gathering and documentation",
      "Knowledge of business process modeling tools",
      "Experience with data analysis and reporting tools",
      "Excellent communication and stakeholder management skills",
      "Understanding of software development lifecycle"
    ],
    createdBy:createdBy,
    applicationDeadline: new Date("2025-09-23"),
    maxApplications: 85,
    currentApplications: 37
  },
  {
    jobTitle: "Business Development Intern",
    jobLocation: "Hinjewadi Phase-2, Pune (Hybrid)",
    experience: "0-6 Months",
    shift: "10.00AM - 5.00PM IST Monday to Friday",
    department: "business",
    jobDescription: "We offer an exciting business development internship for students pursuing business studies or recent graduates. You will gain exposure to various aspects of business development, market research, and client relationship management.",
    keyResponsibilities: [
      "Assist in market research and competitor analysis",
      "Support lead generation and prospect identification",
      "Help prepare business presentations and proposals",
      "Assist in client communication and follow-ups",
      "Support business development team in administrative tasks",
      "Participate in business meetings and client calls",
      "Help maintain CRM databases and client records"
    ],
    requiredSkills: [
      "Pursuing or completed Bachelor's degree in Business, Marketing, or related field",
      "Good communication and interpersonal skills",
      "Basic understanding of business concepts",
      "Proficiency in MS Office applications",
      "Research and analytical abilities",
      "Enthusiastic and eager to learn",
      "Professional attitude and presentation skills"
    ],
    createdBy: createdBy,
    applicationDeadline: new Date("2025-09-14"),
    maxApplications: 100,
    currentApplications: 52
  }
];

    // clear old data
    await Job.deleteMany({});
    console.log("🗑️ Old jobs removed");

    // insert jobs
    await Job.insertMany(jobs);
    console.log("✅ Jobs inserted successfully");

    mongoose.connection.close();
    console.log("🔌 Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding jobs:", error);
    mongoose.connection.close();
  }
};

seedJobs();
