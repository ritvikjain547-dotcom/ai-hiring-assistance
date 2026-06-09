import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";


async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Recruiter
  const recruiterPassword = await bcrypt.hash("password123", 12);
  const recruiter = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "recruiter@hireai.com",
      passwordHash: recruiterPassword,
      role: "RECRUITER",
      profile: {
        create: {
          phone: "+1 (555) 100-2000",
          location: "San Francisco, CA",
          bio: "Senior Technical Recruiter with 8+ years of experience in hiring top engineering talent.",
        },
      },
    },
  });

  // Create Applicant
  const applicantPassword = await bcrypt.hash("password123", 12);
  const applicant = await prisma.user.create({
    data: {
      name: "Alex Chen",
      email: "applicant@hireai.com",
      passwordHash: applicantPassword,
      role: "APPLICANT",
      profile: {
        create: {
          phone: "+1 (555) 200-3000",
          location: "Austin, TX",
          bio: "Full-stack developer passionate about building great user experiences. 4 years of experience with React, Node.js, and cloud technologies.",
          skills: "React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, GraphQL",
          experienceYears: "4 years",
          education: "B.S. Computer Science, University of Texas",
          linkedinUrl: "https://linkedin.com/in/alexchen",
          githubUrl: "https://github.com/alexchen",
        },
      },
    },
  });

  // Create Second Applicant
  const applicant2Password = await bcrypt.hash("password123", 12);
  const applicant2 = await prisma.user.create({
    data: {
      name: "Maya Patel",
      email: "maya@hireai.com",
      passwordHash: applicant2Password,
      role: "APPLICANT",
      profile: {
        create: {
          phone: "+1 (555) 300-4000",
          location: "New York, NY",
          bio: "UX-focused frontend developer with a design background. Love creating accessible and beautiful interfaces.",
          skills: "React, Next.js, CSS, Figma, JavaScript, Tailwind, Storybook",
          experienceYears: "3 years",
          education: "M.S. HCI, Carnegie Mellon University",
        },
      },
    },
  });

  // Create Jobs
  const job1 = await prisma.job.create({
    data: {
      recruiterId: recruiter.id,
      title: "Senior Frontend Developer",
      company: "TechVision Labs",
      description: `We are looking for a Senior Frontend Developer to join our growing team at TechVision Labs.

About the Role:
You will be responsible for building and maintaining our next-generation web applications. You'll work closely with our design team and backend engineers to deliver exceptional user experiences.

What You'll Do:
• Lead the development of complex frontend features using React and TypeScript
• Architect scalable, maintainable, and performant frontend solutions
• Mentor junior developers and conduct code reviews
• Collaborate with designers to implement pixel-perfect UI components
• Optimize application performance and bundle sizes
• Write comprehensive tests using Jest and React Testing Library

What We're Looking For:
• 4+ years of experience with React and modern JavaScript
• Strong TypeScript skills
• Experience with state management (Redux, Zustand, or Jotai)
• Knowledge of CSS-in-JS or Tailwind CSS
• Experience with testing frameworks
• Strong communication and collaboration skills`,
      location: "San Francisco, CA",
      locationType: "HYBRID",
      employmentType: "FULL_TIME",
      experienceLevel: "4+ years",
      requiredSkills: "React, TypeScript, Next.js, CSS, Testing, Performance Optimization",
      salaryMin: 140000,
      salaryMax: 190000,
      status: "OPEN",
      deadline: new Date("2026-07-30"),
    },
  });

  const job2 = await prisma.job.create({
    data: {
      recruiterId: recruiter.id,
      title: "Backend Engineer",
      company: "TechVision Labs",
      description: `Join TechVision Labs as a Backend Engineer and help us build the infrastructure that powers millions of users.

About the Role:
You will design, build, and maintain high-performance backend services. Our stack includes Node.js, Python, and Go with PostgreSQL and Redis.

Responsibilities:
• Design and implement RESTful and GraphQL APIs
• Build microservices architecture using Node.js and Go
• Optimize database queries and ensure data integrity
• Implement authentication, authorization, and security best practices
• Set up CI/CD pipelines and monitoring systems
• Participate in on-call rotations

Requirements:
• 3+ years of backend development experience
• Strong knowledge of Node.js or Python
• Experience with SQL and NoSQL databases
• Familiarity with Docker and Kubernetes
• Understanding of distributed systems concepts
• Experience with cloud platforms (AWS/GCP/Azure)`,
      location: "Remote",
      locationType: "REMOTE",
      employmentType: "FULL_TIME",
      experienceLevel: "3+ years",
      requiredSkills: "Node.js, Python, PostgreSQL, Docker, Kubernetes, AWS, GraphQL",
      salaryMin: 130000,
      salaryMax: 175000,
      status: "OPEN",
      deadline: new Date("2026-08-15"),
    },
  });

  const job3 = await prisma.job.create({
    data: {
      recruiterId: recruiter.id,
      title: "Product Designer",
      company: "TechVision Labs",
      description: `We're looking for a talented Product Designer to craft beautiful and intuitive user experiences.

About the Role:
As a Product Designer at TechVision Labs, you will own the design process from research to delivery. You'll create wireframes, prototypes, and high-fidelity designs for our web and mobile products.

What You'll Do:
• Conduct user research and usability testing
• Create wireframes, user flows, and interactive prototypes
• Design high-fidelity mockups and design systems
• Collaborate with engineers to ensure design quality
• Present design decisions to stakeholders
• Iterate based on data and user feedback

Requirements:
• 2+ years of product design experience
• Proficiency in Figma
• Strong portfolio demonstrating UX process
• Experience with design systems
• Excellent communication skills`,
      location: "New York, NY",
      locationType: "ONSITE",
      employmentType: "FULL_TIME",
      experienceLevel: "2+ years",
      requiredSkills: "Figma, UX Research, Prototyping, Design Systems, User Testing",
      salaryMin: 110000,
      salaryMax: 150000,
      status: "OPEN",
    },
  });

  const job4 = await prisma.job.create({
    data: {
      recruiterId: recruiter.id,
      title: "DevOps Engineering Intern",
      company: "TechVision Labs",
      description: `Join our DevOps team for a summer internship and learn how we build and maintain cloud infrastructure at scale.

What You'll Learn:
• Infrastructure as Code with Terraform
• Container orchestration with Kubernetes
• CI/CD pipeline design
• Monitoring and observability
• Cloud security best practices

Requirements:
• Currently pursuing a degree in CS or related field
• Basic knowledge of Linux
• Familiarity with at least one programming language
• Interest in cloud technologies`,
      location: "San Francisco, CA",
      locationType: "HYBRID",
      employmentType: "INTERNSHIP",
      experienceLevel: "Student",
      requiredSkills: "Linux, Python, Git, Cloud Computing",
      salaryMin: 35,
      salaryMax: 50,
      salaryCurrency: "USD/hr",
      status: "OPEN",
      deadline: new Date("2026-06-30"),
    },
  });

  // Create Applications
  await prisma.application.create({
    data: {
      jobId: job1.id,
      applicantId: applicant.id,
      coverLetter:
        "I'm excited to apply for the Senior Frontend Developer position. With 4 years of experience building React applications at scale, I believe I would be a great fit for your team. I'm particularly interested in your focus on performance optimization and mentoring junior developers.",
      status: "REVIEWING",
    },
  });

  await prisma.application.create({
    data: {
      jobId: job2.id,
      applicantId: applicant.id,
      coverLetter:
        "As a full-stack developer with strong backend skills in Node.js and Python, I'd love to contribute to your backend infrastructure. My experience with PostgreSQL and Docker aligns well with your tech stack.",
      status: "PENDING",
    },
  });

  await prisma.application.create({
    data: {
      jobId: job1.id,
      applicantId: applicant2.id,
      coverLetter:
        "With my HCI background and 3 years of frontend experience, I bring both design sensibility and technical expertise. I'm passionate about creating accessible interfaces that delight users.",
      status: "SHORTLISTED",
    },
  });

  await prisma.application.create({
    data: {
      jobId: job3.id,
      applicantId: applicant2.id,
      status: "PENDING",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("");
  console.log("📧 Test Accounts:");
  console.log("   Recruiter: recruiter@hireai.com / password123");
  console.log("   Applicant: applicant@hireai.com / password123");
  console.log("   Applicant: maya@hireai.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
