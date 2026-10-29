import { connectToDatabase } from "./mongodb";
import { hashPassword } from "./auth";
import { ObjectId } from "mongodb";

export async function seedDatabase() {
  const { db } = await connectToDatabase();

  console.log("Starting database seed...");

  // Drop existing collections to start fresh with pristine state
  const collections = ["users", "resources", "bookings", "incidents", "audit_logs", "notifications", "newsletter_subscribers"];
  for (const col of collections) {
    try {
      await db.collection(col).drop();
    } catch {
      // Collection may not exist yet
    }
  }

  // 1. Seed Users
  const studentPw = await hashPassword("student123");
  const teacherPw = await hashPassword("teacher123");
  const adminPw = await hashPassword("admin123");

  const studentId = new ObjectId();
  const student2Id = new ObjectId();
  const teacherId = new ObjectId();
  const teacher2Id = new ObjectId();
  const adminId = new ObjectId();

  const users = [
    {
      _id: studentId,
      name: "Alex Chen",
      email: "student@campus.edu",
      passwordHash: studentPw,
      role: "student",
      department: "Robotics & Software Engineering",
      institution: "State University of Technology",
      studentOrStaffId: "SUT-2024-8842",
      isVerified: true,
      trainingCertifications: [
        "Laser Safety 101",
        "Lab Biohazard Safety",
        "High-End Camera Equipment Handling",
        "Cleanroom Class 1000",
        "Chemical Fume Hood Safety",
      ],
      status: "active",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      _id: student2Id,
      name: "Maya Patel",
      email: "maya@campus.edu",
      passwordHash: studentPw,
      role: "student",
      department: "Electrical Engineering",
      institution: "State University of Technology",
      studentOrStaffId: "SUT-2024-9104",
      isVerified: true,
      trainingCertifications: ["Laser Safety 101"],
      status: "active",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      _id: teacherId,
      name: "Prof. Robert Vance",
      email: "teacher@campus.edu",
      passwordHash: teacherPw,
      role: "teacher",
      department: "Advanced Fabrication & Media Arts",
      institution: "State University of Technology",
      studentOrStaffId: "FAC-7731",
      isVerified: true,
      trainingCertifications: ["Master Equipment Certifier", "Safety Officer", "Laser Safety 101"],
      status: "active",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      _id: teacher2Id,
      name: "Dr. Sarah Jenkins",
      email: "sarah@campus.edu",
      passwordHash: teacherPw,
      role: "teacher",
      department: "Biomedical & Chemical Sciences",
      institution: "State University of Technology",
      studentOrStaffId: "FAC-9022",
      isVerified: false, // For demonstration of admin teacher verification
      trainingCertifications: ["Biosafety Level 3", "Lab Biohazard Safety", "Chemical Fume Hood Safety"],
      status: "active",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      _id: adminId,
      name: "Campus System Admin",
      email: "admin@campus.edu",
      passwordHash: adminPw,
      role: "admin",
      department: "Campus Facilities & Resource Allocation",
      institution: "State University of Technology",
      studentOrStaffId: "ADM-001",
      isVerified: true,
      trainingCertifications: ["All Access Administrator"],
      status: "active",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
  ];

  await db.collection("users").insertMany(users);
  console.log(`Seeded ${users.length} users.`);

  // 2. Seed 15 Comprehensive University Resources
  const resAiLabId = new ObjectId();
  const resChemistryLabId = new ObjectId();
  const resBioLabId = new ObjectId();
  const resRoboticsArenaId = new ObjectId();
  const resCleanroomId = new ObjectId();
  const resCameraId = new ObjectId();
  const resRedCameraId = new ObjectId();
  const resHpcClusterId = new ObjectId();
  const resVrStationId = new ObjectId();
  const resCyberSecurityId = new ObjectId();
  const resLaserPrinterId = new ObjectId();
  const resCncMillId = new ObjectId();
  const resConfocalMicroscopeId = new ObjectId();
  const resSeminarRoomId = new ObjectId();
  const resAudioStudioId = new ObjectId();

  const resources = [
    // 1. AI Lab
    {
      _id: resAiLabId,
      name: "AI & Robotics Compute Cluster (Lab 402)",
      category: "Labs",
      description:
        "High-performance computing laboratory equipped with 16x NVIDIA H100 GPUs, dual 4K development monitors, high-speed optical fiber uplink, and robotic test platforms for advanced machine learning and robotics research.",
      images: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Turing Science Complex, 4th Floor, Lab 402",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: ["Cleanroom Class 1000"],
        minimumRating: 4.0,
        securityDeposit: 0,
        requiresApproval: true,
        maxBookingHours: 6,
      },
      guidelines: [
        "Strictly no food or drinks inside the compute facility",
        "Stop GPU job processes before the end of your session",
        "Wear anti-static ESD wristbands when handling robotics hardware",
      ],
      usageRules: "Intended for university-affiliated research, coursework, and capstone robotics projects.",
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 2. Chemistry Lab
    {
      _id: resChemistryLabId,
      name: "Analytical Chemistry & Spectrometry Lab (Lab 305)",
      category: "Labs",
      description:
        "Advanced chemical synthesis and molecular analysis facility featuring automated chemical fume hoods, 500 MHz NMR Spectrometer, Gas Chromatography-Mass Spectrometer (GC-MS), and inert atmosphere glovebox.",
      images: [
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Franklin Chemistry Tower, 3rd Floor, Bay 305",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: ["Chemical Fume Hood Safety", "Lab Biohazard Safety"],
        minimumRating: 4.2,
        securityDeposit: 100,
        requiresApproval: true,
        maxBookingHours: 5,
      },
      guidelines: [
        "Mandatory splash goggles, acid-resistant lab coats, and closed-toe shoes",
        "All volatile solvent transfers must occur inside certified active fume hoods",
        "Dispose of organic and halogenated wastes into segregated labeled drums",
      ],
      usageRules: "Organic synthesis, inorganic materials analysis, and chemical engineering thesis work.",
      createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 3. Biology Lab
    {
      _id: resBioLabId,
      name: "Molecular Biology & Genetics Research Lab (Bio-Wing 2)",
      category: "Labs",
      description:
        "Class II Biosafety laminar flow cabinet, refrigerated micro-centrifuge (up to 21,000 x g), Bio-Rad PCR thermal cyclers, UV sterilization hood, and digital micropipette suite for DNA sequencing and cell culture.",
      images: [
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Darwin Life Sciences Tower, Wing B, Room 110",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: ["Lab Biohazard Safety"],
        minimumRating: 4.5,
        securityDeposit: 100,
        requiresApproval: true,
        maxBookingHours: 4,
      },
      guidelines: [
        "Full PPE mandatory: lab coat, nitrile gloves, and splash safety goggles",
        "All biological waste must be placed in designated yellow autoclave bags",
        "Perform ethanol wipe-down before and after each session",
      ],
      usageRules: "Certified biology and biochemistry research experiments only.",
      createdAt: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 4. Robotics Flight Arena
    {
      _id: resRoboticsArenaId,
      name: "Autonomous Drones & Robotics Flight Arena",
      category: "Labs",
      description:
        "3,000 sq ft netted indoor aerial test chamber with 12-camera optical motion-capture tracking system, soft landing mats, high-rate telemetry base station, and lipo safety charging vaults.",
      images: [
        "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Engineering Annex, High-Bay Hangar 14",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: ["Laser Safety 101"],
        minimumRating: 4.0,
        securityDeposit: 50,
        requiresApproval: true,
        maxBookingHours: 4,
      },
      guidelines: [
        "Pre-flight safety inspection checklist must be logged at check-in",
        "Keep perimeter netting closed during active propeller rotation",
        "Charge lithium polymer batteries exclusively within fireproof blast boxes",
      ],
      usageRules: "Autonomous quadrotor navigation, swarm robotics, and sensor calibration.",
      createdAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 5. Cleanroom
    {
      _id: resCleanroomId,
      name: "Semiconductor Cleanroom & Microfabrication Bay",
      category: "Labs",
      description:
        "ISO Class 1000 cleanroom suite equipped with optical mask aligner, Laurell spin coater, reactive ion etcher, and profilometer for wafer-level microchip and sensor fabrication.",
      images: [
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Quantum Materials Institute, Cleanroom Suite 102",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: ["Cleanroom Class 1000"],
        minimumRating: 4.5,
        securityDeposit: 150,
        requiresApproval: true,
        maxBookingHours: 6,
      },
      guidelines: [
        "Full bunny suit, hood, booties, and nitrile gloves mandatory before air shower entry",
        "Do not bring paper, cardboard, or particulate-generating materials inside",
        "Log all chemical bake times and wafer spinner RPMs in the digital logbook",
      ],
      usageRules: "Semiconductor device fabrication, MEMS sensors, and nanotechnology research.",
      createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 6. Sony FX6 Camera
    {
      _id: resCameraId,
      name: "Sony FX6 Cinema 4K Camera & Prime Lens Kit",
      category: "Cameras",
      description:
        "Professional cinema camera package featuring 4K full-frame sensor, Sony 24-70mm GM II lens, dual 160GB CFexpress cards, Sennheiser wireless audio lavalier set, and Miller carbon fiber tripod.",
      images: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Media Arts Building, Equipment Cage 12",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "in_use",
      eligibility: {
        requiredCertifications: ["High-End Camera Equipment Handling"],
        minimumRating: 4.5,
        securityDeposit: 150,
        requiresApproval: true,
        maxBookingHours: 8,
      },
      guidelines: [
        "Inspect sensor glass and lens elements upon check-in",
        "Return all batteries fully charged in their protective cases",
        "Immediate damage report required for accidental drops or water exposure",
      ],
      usageRules: "Only for university film projects, documentary fieldwork, and authorized events.",
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 7. RED 8K Camera
    {
      _id: resRedCameraId,
      name: "RED V-Raptor 8K High-Speed Cinema Camera Package",
      category: "Cameras",
      description:
        "State-of-the-art cinema system with multi-format 8K VistaVision sensor, high frame rate capture up to 120fps at 8K, Canon RF 28-70mm f/2 lens, SmallHD Cine 7 monitor, and V-mount power station.",
      images: [
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Media Arts Building, Studio Vault 4",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: ["High-End Camera Equipment Handling"],
        minimumRating: 4.6,
        securityDeposit: 250,
        requiresApproval: true,
        maxBookingHours: 8,
      },
      guidelines: [
        "Handle with both hands using the top handle and base rig",
        "Always use lens caps when not actively rolling footage",
        "Never swap CFexpress media while the camera status light is active",
      ],
      usageRules: "High-end student thesis films and university media productions.",
      createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 8. HPC Cluster
    {
      _id: resHpcClusterId,
      name: "High-Performance Deep Learning GPU Cluster (H100 Node)",
      category: "Computers",
      description:
        "High-density supercomputing node equipped with 8x NVIDIA H100 SXM5 GPUs (640GB total VRAM), 1TB ECC memory, 100GbE InfiniBand networking, and pre-configured Slurm cluster environment for large language models.",
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Turing Data Center, Server Rack Bay D",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: [],
        minimumRating: 4.0,
        securityDeposit: 0,
        requiresApproval: true,
        maxBookingHours: 12,
      },
      guidelines: [
        "Strictly adhere to allotted GPU core allocations",
        "Automated cron jobs will kill uncheckpointed jobs at end of reservation",
        "Transfer large dataset artifacts to scratch drive before starting training run",
      ],
      usageRules: "AI thesis training, neural network benchmark research, and scientific computing.",
      createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 9. VR & Vision Lab
    {
      _id: resVrStationId,
      name: "Spatial Computing, VR & Human-Computer Interaction Lab",
      category: "Computers",
      description:
        "Development setup comprising dual Apple Vision Pro spatial headsets, four Meta Quest 3 units, and Apple M2 Ultra Mac Studio with Unity & Unreal Engine VR pipelines.",
      images: [
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Emerging Technologies Lab, Room 108",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: [],
        minimumRating: 3.8,
        securityDeposit: 75,
        requiresApproval: true,
        maxBookingHours: 4,
      },
      guidelines: [
        "Sterilize headset silicone face seals in UV chamber after use",
        "Keep optic lenses covered with protective fabric caps",
        "Log off development accounts from Apple Developer and Unity Hub",
      ],
      usageRules: "AR/VR application testing and spatial interface development.",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 10. Cyber Security Lab
    {
      _id: resCyberSecurityId,
      name: "Cybersecurity & Ethical Hacking Network Simulation Lab",
      category: "Computers",
      description:
        "Isolated air-gapped testbed with managed Cisco Catalyst 9300 switches, Palo Alto next-gen firewalls, packet analyzers, and virtualized target sandbox environments for penetration testing.",
      images: [
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Lovelace Information Security Hall, Room 312",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: [],
        minimumRating: 4.2,
        securityDeposit: 0,
        requiresApproval: true,
        maxBookingHours: 6,
      },
      guidelines: [
        "Never connect personal wireless hotspots or outside Ethernet cables to test switches",
        "Traffic generation is limited strictly to internal simulation subnets",
        "Restore virtual machines to clean baseline snapshots before checkout",
      ],
      usageRules: "Ethical hacking competitions, vulnerability analysis, and network defense research.",
      createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 11. Formlabs 3D Printer
    {
      _id: resLaserPrinterId,
      name: "Formlabs Fuse 1+ Industrial SLS 3D Printer",
      category: "Equipment",
      description:
        "Selective Laser Sintering (SLS) 3D printer for producing durable, production-grade Nylon PA-12 functional prototypes with zero support structures required.",
      images: [
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Maker Innovations Hall, Workshop Bay 3",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: ["Laser Safety 101"],
        minimumRating: 4.0,
        securityDeposit: 50,
        requiresApproval: true,
        maxBookingHours: 12,
      },
      guidelines: [
        "Protective eyewear and dust respirator required during powder handling",
        "Only official PA-12 nylon powder from the department stock is permitted",
        "Vacuum sintering chamber and clean air filtration post-run",
      ],
      usageRules: "Rapid prototyping for engineering teams and research labs.",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 12. CNC Milling Bay
    {
      _id: resCncMillId,
      name: "Haas Mini Mill 5-Axis Precision CNC Machining Bay",
      category: "Equipment",
      description:
        "Industrial CNC vertical milling machine with 10-tool automatic tool changer, flood coolant system, digital tool-setter, and CAM post-processor for aerospace aluminum and titanium prototype machining.",
      images: [
        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Advanced Manufacturing Bay, Machine Shop 1",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: ["Cleanroom Class 1000"],
        minimumRating: 4.3,
        securityDeposit: 120,
        requiresApproval: true,
        maxBookingHours: 6,
      },
      guidelines: [
        "Safety goggles, hearing protection, and shop coat mandatory at all times",
        "Dry-run simulation in CAM simulator required before running spindle on stock",
        "Clear all metal chips and top off water-soluble coolant level after session",
      ],
      usageRules: "Precision mechanical components, robotics frames, and racecar chassis parts.",
      createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 13. Confocal Microscope
    {
      _id: resConfocalMicroscopeId,
      name: "Olympus Confocal Laser Scanning Fluorescence Microscope",
      category: "Equipment",
      description:
        "High-resolution laser scanning confocal microscope featuring 4 solid-state lasers (405, 488, 561, 640 nm), environmental incubation chamber for live-cell imaging, and 3D volumetric z-stack reconstruction software.",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Imaging Core Facility, Dark Lab 202",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: ["Laser Safety 101", "Lab Biohazard Safety"],
        minimumRating: 4.6,
        securityDeposit: 100,
        requiresApproval: true,
        maxBookingHours: 4,
      },
      guidelines: [
        "Keep darkroom door latched when laser illumination keys are turned on",
        "Wipe oil-immersion objective lens with optical lens paper only (never Kimwipes)",
        "Turn off laser emission diode switches 15 minutes before leaving to allow cooling",
      ],
      usageRules: "Cellular neuroscience, protein localization, and live-cell biological imaging.",
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 14. Smart Seminar Room
    {
      _id: resSeminarRoomId,
      name: "Smart Collaborative Seminar & Symposium Hall (Room 204)",
      category: "Rooms",
      description:
        "Modern multimedia lecture space accommodating up to 50 participants with dual 85-inch 4K touchscreen interactive whiteboards, ceiling beamforming microphones, and motorized acoustic sound barriers.",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Student Innovation Center, 2nd Floor, Room 204",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: [],
        minimumRating: 3.5,
        securityDeposit: 0,
        requiresApproval: true,
        maxBookingHours: 4,
      },
      guidelines: [
        "Reset modular tables and chairs to standard classroom layout before checkout",
        "Turn off master AV console and video projectors before leaving",
      ],
      usageRules: "Academic workshops, hackathons, guest seminars, and thesis presentations.",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    // 15. Audio Studio
    {
      _id: resAudioStudioId,
      name: "Acoustic Recording & Spatial Sound Engineering Studio",
      category: "Rooms",
      description:
        "Floating floor soundproof recording room with Genelec 7.1.4 Dolby Atmos surround monitoring, Avid Pro Tools HDX console, vocal isolation booth, and Neumann U87 / AKG C414 condenser microphones.",
      images: [
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
      ],
      location: "Media Arts Building, Sound Stage B",
      institution: "State University of Technology",
      ownerId: teacherId.toString(),
      ownerName: "Prof. Robert Vance",
      ownerEmail: "teacher@campus.edu",
      status: "available",
      eligibility: {
        requiredCertifications: [],
        minimumRating: 3.9,
        securityDeposit: 60,
        requiresApproval: true,
        maxBookingHours: 5,
      },
      guidelines: [
        "Lock phantom power (+48V) switches before plugging/unplugging XLR microphones",
        "Do not tamper with acoustic bass traps or wall diffusers",
        "Mute speaker monitors before powering down the master rack",
      ],
      usageRules: "Foley sound design, podcast recording, orchestra scoring, and acoustic analysis.",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  await db.collection("resources").insertMany(resources);
  console.log(`Seeded ${resources.length} resources.`);

  // 3. Seed Bookings across all 10 workflow phases
  const now = new Date();
  const bookingInUseId = new ObjectId();
  const bookingPendingId = new ObjectId();
  const bookingApprovedId = new ObjectId();
  const bookingCompletedId = new ObjectId();
  const bookingWaitlistedId = new ObjectId();

  const bookings = [
    // 1. In Use: Alex has checked in
    {
      _id: bookingInUseId,
      resourceId: resCameraId.toString(),
      resourceName: "Sony FX6 Cinema 4K Camera & Prime Lens Kit",
      resourceCategory: "Cameras",
      resourceLocation: "Media Arts Building, Equipment Cage 12",
      userId: studentId.toString(),
      userName: "Alex Chen",
      userEmail: "student@campus.edu",
      ownerId: teacherId.toString(),
      startDate: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      purpose: "Filming documentary B-roll for Campus Autonomous Robotics initiative.",
      status: "in_use",
      checkInTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      initialCondition: {
        condition: "good",
        notes: "Equipment received with minor surface scuff on outer lens hood. Sensor and glass are pristine. Battery fully charged.",
        photoUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
        reportedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    // 2. Pending
    {
      _id: bookingPendingId,
      resourceId: resSeminarRoomId.toString(),
      resourceName: "Smart Collaborative Seminar & Symposium Hall (Room 204)",
      resourceCategory: "Rooms",
      resourceLocation: "Student Innovation Center, 2nd Floor, Room 204",
      userId: studentId.toString(),
      userName: "Alex Chen",
      userEmail: "student@campus.edu",
      ownerId: teacherId.toString(),
      startDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 27 * 60 * 60 * 1000).toISOString(),
      purpose: "Hosting AI and Robotics Student Club Project Demonstration & Peer Review.",
      status: "pending",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    // 3. Approved
    {
      _id: bookingApprovedId,
      resourceId: resAiLabId.toString(),
      resourceName: "AI & Robotics Compute Cluster (Lab 402)",
      resourceCategory: "Labs",
      resourceLocation: "Turing Science Complex, 4th Floor, Lab 402",
      userId: studentId.toString(),
      userName: "Alex Chen",
      userEmail: "student@campus.edu",
      ownerId: teacherId.toString(),
      startDate: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      purpose: "Fine-tuning deep reinforcement learning neural network weights on H100 cluster.",
      status: "approved",
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    },
    // 4. Completed
    {
      _id: bookingCompletedId,
      resourceId: resBioLabId.toString(),
      resourceName: "Molecular Biology & Genetics Research Lab (Bio-Wing 2)",
      resourceCategory: "Labs",
      resourceLocation: "Darwin Life Sciences Tower, Wing B, Room 110",
      userId: studentId.toString(),
      userName: "Alex Chen",
      userEmail: "student@campus.edu",
      ownerId: teacherId.toString(),
      startDate: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() - 44 * 60 * 60 * 1000).toISOString(),
      purpose: "DNA electrophoresis and protein separation calibration assay.",
      status: "completed",
      checkInTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      checkOutTime: new Date(now.getTime() - 44 * 60 * 60 * 1000),
      initialCondition: {
        condition: "good",
        notes: "Station clean, centrifuge balanced, safety hood certified.",
        reportedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      },
      finalCondition: {
        condition: "good",
        notes: "Autoclave waste bagged, ethanol wiped, all micropipettes recalibrated and returned.",
        reportedAt: new Date(now.getTime() - 44 * 60 * 60 * 1000),
      },
      createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 44 * 60 * 60 * 1000),
    },
    // 5. Waitlisted
    {
      _id: bookingWaitlistedId,
      resourceId: resCameraId.toString(),
      resourceName: "Sony FX6 Cinema 4K Camera & Prime Lens Kit",
      resourceCategory: "Cameras",
      resourceLocation: "Media Arts Building, Equipment Cage 12",
      userId: student2Id.toString(),
      userName: "Maya Patel",
      userEmail: "maya@campus.edu",
      ownerId: teacherId.toString(),
      startDate: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      purpose: "Electrical engineering sensor circuit video showcase for symposium.",
      status: "waitlisted",
      waitlistPosition: 1,
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    },
  ];

  await db.collection("bookings").insertMany(bookings);
  console.log(`Seeded ${bookings.length} bookings.`);

  // 4. Seed Incidents
  const incidentId = new ObjectId();
  const incidents = [
    {
      _id: incidentId,
      bookingId: bookingInUseId.toString(),
      resourceId: resCameraId.toString(),
      resourceName: "Sony FX6 Cinema 4K Camera & Prime Lens Kit",
      reporterId: teacherId.toString(),
      reporterName: "Prof. Robert Vance",
      reporterRole: "teacher",
      type: "damage",
      severity: "minor",
      description: "Minor hairline mark on lens protective filter cap from previous borrower drop test. Replaced with spare filter.",
      photoUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
      status: "resolved",
      resolutionNotes: "Filter replaced with inventory stock. Optical lens undamaged. Zero fee assessed.",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    },
  ];
  await db.collection("incidents").insertMany(incidents);

  // 5. Seed Audit Logs
  const auditLogs = [
    {
      actorId: adminId.toString(),
      actorName: "Campus System Admin",
      actorRole: "admin",
      action: "PLATFORM_INIT",
      targetType: "system",
      targetId: "GLOBAL_SYSTEM",
      summary: "Initialized ResourceHub institutional sharing network with 15 verified campus resources.",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      actorId: teacherId.toString(),
      actorName: "Prof. Robert Vance",
      actorRole: "teacher",
      action: "CREATE_RESOURCE",
      targetType: "resource",
      targetId: resAiLabId.toString(),
      summary: "Published listing for AI & Robotics Compute Cluster (Lab 402).",
      timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    },
    {
      actorId: teacherId.toString(),
      actorName: "Prof. Robert Vance",
      actorRole: "teacher",
      action: "APPROVE_BOOKING",
      targetType: "booking",
      targetId: bookingApprovedId.toString(),
      summary: "Approved booking request for student Alex Chen after prerequisite qualification verification.",
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    },
  ];
  await db.collection("audit_logs").insertMany(auditLogs);

  // 6. Seed Newsletter Subscribers
  const subscribers = [
    {
      email: "researcher@stanford.edu",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "active",
      source: "footer",
    },
    {
      email: "lab.director@mit.edu",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "active",
      source: "footer",
    },
    {
      email: "robotics.club@campus.edu",
      createdAt: new Date(),
      status: "active",
      source: "footer",
    },
  ];
  await db.collection("newsletter_subscribers").insertMany(subscribers);

  console.log("Database seeded successfully with 15 university resources!");
}
