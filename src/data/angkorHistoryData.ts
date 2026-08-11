export interface BasReliefDetail {
  id: string;
  title: string;
  location: string;
  description: string;
  historicalSignificance: string;
  carvingTechnique: string;
  image?: string;
}

export interface StoryChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  era: string;
  timeframe: string;
  summary: string;
  fullHistory: string;
  audioNarrative: string;
  keyFacts: string[];
  bgImage: string;
  primarySources: {
    quote: string;
    author: string;
    context: string;
  }[];
  basReliefs?: BasReliefDetail[];
  cameraTarget: {
    position: [number, number, number];
    lookAt: [number, number, number];
    fov: number;
  };
  hotspots: {
    id: string;
    label: string;
    position: [number, number, number];
    description: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const ANGKOR_CHAPTERS: StoryChapter[] = [
  {
    id: "chapter-1",
    number: 1,
    title: "Genesis of Paramavishnuloka",
    subtitle: "The Reign of King Suryavarman II",
    era: "Khmer Empire Golden Age",
    timeframe: "1113 – 1150 CE",
    bgImage: "/src/assets/images/angkor_sunrise_hero_1786454818680.jpg",
    summary: "Built as a monumental state temple and personal mausoleum dedicated to Lord Vishnu, breaking from traditional east-facing Khmer architecture.",
    fullHistory: `In 1113 CE, King Suryavarman II ascended the throne of the Khmer Empire after unifying rival factions. To solidify his divine rule and express devotion to Lord Vishnu, he commissioned the construction of Paramavishnuloka—the 'Supreme Dwelling of Lord Vishnu', known today as Angkor Wat. 

Unlike almost all other Khmer temples which face East toward the rising sun (symbolizing creation and new life), Angkor Wat uniquely faces West. Historians and archaeologists agree that West is the direction associated with Lord Vishnu, as well as Yama, the god of death. This dual purpose confirmed the temple as both a grand state sanctuary for divine worship during Suryavarman's lifetime and his sacred funerary monument for the afterlife.`,
    audioNarrative: "Welcome to Chapter One: Genesis of Paramavishnuloka. In the early 12th century, King Suryavarman II unified the Khmer realm and commissioned a monument unlike any other. Facing West toward the setting sun and dedicated to Lord Vishnu, Angkor Wat was built as both a celestial city and the King's eternal sanctuary.",
    keyFacts: [
      "Commissioned by King Suryavarman II around 1113–1150 CE.",
      "Original Sanskrit name: Paramavishnuloka (Supreme Dwelling of Vishnu).",
      "Uniquely oriented facing West, symbol of Vishnu and eternity.",
      "Covered over 162.6 hectares (400 acres), making it the largest religious monument in human history."
    ],
    primarySources: [
      {
        quote: "Suryavarman II, elevated by his heroic deeds, established a temple on Mount Meru on earth, rivaling the abode of the devas.",
        author: "Post-Khmer Inscriptions (K. 289)",
        context: "Sanskrit inscription recording the divine legitimacy of Suryavarman II."
      }
    ],
    cameraTarget: {
      position: [0, 45, 120],
      lookAt: [0, 10, 0],
      fov: 50
    },
    hotspots: [
      {
        id: "west-gate",
        label: "Western Entrance Causeway",
        position: [-60, 5, 0],
        description: "A 235-meter long sandstone causeway spanning the cosmic moat, flanked by 7-headed Naga balustrades."
      },
      {
        id: "outer-wall",
        label: "Laterite Enclosure Wall",
        position: [-40, 8, 30],
        description: "Measuring 1,025 meters by 800 meters, protecting the sacred inner compound."
      }
    ]
  },
  {
    id: "chapter-2",
    number: 2,
    title: "Cosmology in Sandstone",
    subtitle: "Mount Meru and the Cosmic Ocean",
    era: "Sacred Geometry & Symbolism",
    timeframe: "Architectural Design",
    bgImage: "/src/assets/images/angkor_towers_dusk_1786455980462.jpg",
    summary: "Angkor Wat is a physical replica of the Hindu universe, with central towers representing the peaks of Mount Meru surrounded by the cosmic ocean.",
    fullHistory: `The spatial plan of Angkor Wat is a three-dimensional mandala representing Hindu cosmology. The 190-meter (620 ft) wide rectangular moat surrounding the entire complex represents the mythical Cosmic Ocean (*Kshira Sagara*) at the edge of the universe. 

Moving inward across the causeway, visitors ascend three concentric rectangular galleries elevated on high tiers, symbolizing the worlds of Earth, Earthly Devotion, and Heavens. At the absolute center rises the quincunx of five lotus-bud towers. The central peak reaches 65 meters (213 feet) above the ground, representing Mount Meru—the sacred mythical center of the universe inhabited by the Devas.`,
    audioNarrative: "Chapter Two: Cosmology in Sandstone. Angkor Wat is not merely a temple; it is a earthly mandala of the Hindu cosmos. The vast 190-meter wide moat represents the cosmic ocean, while the five lotus-bud towers rise high into the sky to embody Mount Meru, the center of the universe.",
    keyFacts: [
      "190m wide moat spanning 5+ kilometers in perimeter, acting as cosmic ocean and structural water table stabilizer.",
      "Quincunx design: 5 central towers arranged like five dots on a die.",
      "Solar Alignment: During the Vernal Equinox, the sun rises directly over the apex of the central tower.",
      "Precision astronomical geometry built into sanctuary axis ratios."
    ],
    primarySources: [
      {
        quote: "The temple is constructed so that on the day of the equinox, an observer standing on the western causeway sees the sun rise directly atop the central peak of Mount Meru.",
        author: "Eleanor Mannikka",
        context: "Angkor Wat: Time, Space, and Kingship (1996)."
      }
    ],
    cameraTarget: {
      position: [0, 30, 70],
      lookAt: [0, 18, 0],
      fov: 45
    },
    hotspots: [
      {
        id: "central-tower",
        label: "Central Sanctuary Tower",
        position: [0, 32, 0],
        description: "Reaching 65 meters high, storing the sacred image of Vishnu and symbolizing the axis of the cosmos."
      },
      {
        id: "corner-towers",
        label: "Quincunx Corner Towers",
        position: [18, 22, 18],
        description: "Four surrounding lotus towers framing the supreme central sanctuary."
      }
    ]
  },
  {
    id: "chapter-3",
    number: 3,
    title: "Engineering Marvels",
    subtitle: "Transporting Mount Kulen to Siem Reap",
    era: "Construction & Hydraulic Engineering",
    timeframe: "30 Years of Construction",
    bgImage: "/src/assets/images/angkor_causeway_mist_1786456003912.jpg",
    summary: "Over 5 to 10 million sandstone blocks were quarried 50km away, transported via river canals, and assembled without mortar.",
    fullHistory: `Constructing Angkor Wat required unprecedented engineering ingenuity. Over 5 million tons of sandstone blocks were quarried from the sacred plateau of Phnom Kulen (Mount Kulen), located over 50 kilometers (31 miles) northeast. 

Rather than hauling stone across land, Khmer engineers constructed a vast network of artificial canals connecting Mount Kulen to the Siem Reap river, floating heavy stone blocks on bamboo rafts. Stonemasons cut and polished each sandstone block with incredible accuracy, joining them without any mortar. Instead, blocks were friction-fitted by rubbing stones together with wet sand, secured internally with iron dowels and wooden mortise-and-tenon joints.`,
    audioNarrative: "Chapter Three: Engineering Marvels. How was this colossal stone sanctuary constructed? Over five million tons of sandstone were quarried 50 kilometers away at Phnom Kulen, floated along hand-carved canals on bamboo rafts, and fitted together with mortarless precision.",
    keyFacts: [
      "5 to 10 million sandstone blocks weighing up to 1.5 to 3 tons each.",
      "Hydraulic canal network spanning 50km from Mount Kulen quarries.",
      "Mortarless stone friction fitting reinforced with iron clamps.",
      "Massive subterranean laterite foundation layers holding water pressure to prevent sinking."
    ],
    primarySources: [
      {
        quote: "The stones are fitted so tightly together that no joint is visible between them; they look like a single massive rock carved by giant hands.",
        author: "Henri Mouhot",
        context: "Travels in Siam, Cambodia, and Laos (1860)."
      }
    ],
    cameraTarget: {
      position: [-40, 20, 50],
      lookAt: [0, 8, 0],
      fov: 48
    },
    hotspots: [
      {
        id: "canal-network",
        label: "Canal Barges",
        position: [-80, 2, 40],
        description: "Engineered waterways where thousands of workers floated sandstone blocks on bamboo rafts."
      },
      {
        id: "friction-joints",
        label: "Precision Stonework",
        position: [-15, 6, 15],
        description: "Interlocking stone blocks carved with iron chisels and smoothed with water-sand abrasion."
      }
    ]
  },
  {
    id: "chapter-4",
    number: 4,
    title: "Masterpieces of the Bas-Reliefs",
    subtitle: "The Churning of the Ocean of Milk",
    era: "Artistic Genius of the Khmer",
    timeframe: "Outer Gallery Carvings",
    bgImage: "/src/assets/images/angkor_relief_wall_1786456023843.jpg",
    summary: "Over 1,200 square meters of sandstone bas-reliefs tell immortal stories from the Hindu epics and King Suryavarman II's military triumphs.",
    fullHistory: `The outer galleries of Angkor Wat house one of the most magnificent artistic accomplishments in human history: over 1,200 square meters (13,000 sq ft) of continuous low-relief sandstone carvings. 

The crowning jewel is the 'Churning of the Ocean of Milk' (Samudra Manthan) in the East Gallery. Here, 88 Asuras (demons) on the left and 92 Devas (gods) on the right engage in a cosmic tug-of-war. They pull the body of Vasuki, the giant Naga serpent, wrapped around Mount Mandara as a churning rod. At the center, Lord Vishnu appears in two forms—as a four-armed deity guiding the churning and as Kurma, the giant turtle supporting Mount Mandara on his back.`,
    audioNarrative: "Chapter Four: Masterpieces of the Bas-Reliefs. In the outer galleries, over 1,200 square meters of sandstone walls come alive. Behold the Churning of the Ocean of Milk, where 88 demons and 92 gods pull the serpent Vasuki to extract Amrita, the elixir of immortality.",
    keyFacts: [
      "Over 1,200 m² of continuous carved bas-reliefs stretching 800 meters.",
      "1,795 uniquely carved Apsara celestial dancers with distinct hairstyles and attire.",
      "Famous scenes: Churning of Ocean of Milk, Battle of Kurukshetra, Army of Suryavarman II, 37 Heavens & 32 Hells.",
      "Carved directly onto walls AFTER sandstone blocks were placed in position."
    ],
    primarySources: [
      {
        quote: "The devas and asuras pulled the serpent Vasuki back and forth for a thousand years, until the churning sea birthed the celestial Apsaras, the divine physician Dhanvantari, and the precious nectar Amrita.",
        author: "Bhagavata Purana",
        context: "Ancient Hindu text depicting the Samudra Manthan legend carved at Angkor Wat."
      }
    ],
    basReliefs: [
      {
        id: "ocean-milk",
        title: "The Churning of the Ocean of Milk",
        location: "East Gallery, South Wing",
        description: "88 Asuras and 92 Devas churning the cosmic sea using serpent Vasuki around Mount Mandara.",
        historicalSignificance: "Represents the eternal quest for order, immortality, and cosmic harmony under Vishnu.",
        carvingTechnique: "Shallow bas-relief carving depth between 1.5 cm and 3 cm into solid sandstone.",
        image: "/src/assets/images/angkor_bas_relief_1786454789992.jpg"
      },
      {
        id: "army-suryavarman",
        title: "Procession of Suryavarman II",
        location: "South Gallery, West Wing",
        description: "King Suryavarman II seated on his war elephant under royal parasols, surrounded by general officers and infantry.",
        historicalSignificance: "Crucial historical evidence of 12th century Khmer royal regalia, weaponry, and social hierarchy.",
        carvingTechnique: "Hierarchical scale where the King is carved significantly larger than his attendants.",
        image: "/src/assets/images/angkor_causeway_mist_1786456003912.jpg"
      },
      {
        id: "apsara-dancers",
        title: "Celestial Apsara Dancers",
        location: "Throughout Enclosure Walls",
        description: "Over 1,790 divine maidens carved with ornate diadems, floral jewelry, and traditional Khmer skirts.",
        historicalSignificance: "Highlights the rich textile, jewelry, and classical dance heritage of ancient Siem Reap.",
        carvingTechnique: "High detail polish on sandstone surfaces preserving delicate finger gestures (mudras).",
        image: "/src/assets/images/angkor_relief_wall_1786456023843.jpg"
      }
    ],
    cameraTarget: {
      position: [35, 12, 35],
      lookAt: [20, 8, 20],
      fov: 42
    },
    hotspots: [
      {
        id: "east-gallery",
        label: "East Gallery Wall",
        position: [35, 8, 0],
        description: "Site of the Churning of the Ocean of Milk bas-relief."
      },
      {
        id: "south-gallery",
        label: "South Gallery Wall",
        position: [0, 8, -35],
        description: "Depicting King Suryavarman II leading his royal armies."
      }
    ]
  },
  {
    id: "chapter-5",
    number: 5,
    title: "Buddhist Transition & Survival",
    subtitle: "From Hindu Sanctuary to Living Monastery",
    era: "Post-Angkorian Transition",
    timeframe: "14th Century – Present",
    bgImage: "/src/assets/images/angkor_buddha_shrine_1786456041683.jpg",
    summary: "As Theravada Buddhism spread across Southeast Asia, Angkor Wat transitioned seamlessly into a sacred Buddhist pilgrimage site.",
    fullHistory: `By the late 13th and 14th centuries, Theravada Buddhism replaced Hinduism as the dominant religion of the Khmer Empire. Unlike many ancient cities around the world that were abandoned and destroyed, Angkor Wat was never fully deserted. 

Local Khmer monks and royal guardians transformed the central sanctuary into a active Buddhist monastery. Images of Buddha were installed alongside ancient Vishnu statues. When Portuguese Portuguese voyager António da Magdalena visited in 1586, he declared: 'It is of such extraordinary construction that it is not possible to describe it with a pen, particularly since it is like no other building in the world.'`,
    audioNarrative: "Chapter Five: Buddhist Transition and Survival. Unlike other jungle monuments, Angkor Wat was never abandoned to time. In the 14th century, Theravada Buddhist monks breathed new spiritual life into the sanctuary, preserving its stone towers through centuries.",
    keyFacts: [
      "Transitioned from Hindu Vaishnavism to Theravada Buddhism in 14th century.",
      "Prekha Preah Neang: Continuously maintained by resident Buddhist monks.",
      "Visited by Portuguese voyager António da Magdalena in 1586.",
      "French naturalist Henri Mouhot published detailed sketches in 1860, inspiring global conservation."
    ],
    primarySources: [
      {
        quote: "It has towers and decoration and all the refinements which the human genius can conceive of... It is like no other building in the world.",
        author: "António da Magdalena",
        context: "First recorded European impression of Angkor Wat (1586)."
      }
    ],
    cameraTarget: {
      position: [0, 25, 45],
      lookAt: [0, 15, 0],
      fov: 50
    },
    hotspots: [
      {
        id: "buddha-shrine",
        label: "Preah Poan (1000 Buddhas Gallery)",
        position: [0, 16, 12],
        description: "Historical wooden and stone Buddha statues placed by pilgrims over five centuries."
      }
    ]
  },
  {
    id: "chapter-6",
    number: 6,
    title: "LiDAR Lasers & Modern Rediscovery",
    subtitle: "Unveiling the World's Largest Pre-Industrial City",
    era: "Modern Archaeological Science",
    timeframe: "1992 – Present",
    bgImage: "/src/assets/images/angkor_aerial_view_1786456058507.jpg",
    summary: "Declared a UNESCO World Heritage site in 1992, 21st-century LiDAR technology revealed a hidden mega-city surrounding the temple.",
    fullHistory: `In 1992, Angkor was designated a UNESCO World Heritage site, initiating one of history's largest international conservation campaigns lead by the French EFEO, UNESCO, and Cambodian APSARA National Authority. 

In 2012–2015, airborne laser scanning (LiDAR) led by Dr. Damian Evans revolutionized our understanding of Angkor. Lasers penetrating dense jungle foliage revealed that Angkor Wat was not an isolated temple in the forest, but the central civic engine of an enormous urban empire housing between 750,000 and 1,000,000 inhabitants. High-tech mapping uncovered sprawling residential grids, hidden road networks, and sophisticated water reservoirs (*Barays*) that sustained the civilization.`,
    audioNarrative: "Chapter Six: LiDAR Lasers and Modern Rediscovery. Today, UNESCO conservation and high-tech LiDAR airborne lasers have revealed the true scale of Angkor: a thriving megalopolis of one million people hidden beneath the canopy of Siem Reap.",
    keyFacts: [
      "UNESCO World Heritage Status granted in 1992.",
      "Airborne LiDAR laser mapping (2012–2015) revealed suburban city grid covering >1,000 km².",
      "Estimated population of Greater Angkor: 750,000 to 1,000,000 people.",
      "Advanced water management system with Baray reservoirs and spillways."
    ],
    primarySources: [
      {
        quote: "The LiDAR data mapped an entire urban metropolis under the forest floor that nobody knew existed—redefining human history in Southeast Asia.",
        author: "Dr. Damian Evans",
        context: "Khmer Archaeology LiDAR Consortium lead researcher."
      }
    ],
    cameraTarget: {
      position: [0, 90, 140],
      lookAt: [0, 0, 0],
      fov: 55
    },
    hotspots: [
      {
        id: "lidar-grid",
        label: "Subterranean LiDAR Grid",
        position: [0, 0, 0],
        description: "Laser-derived map overlay showing residential mounds, household ponds, and ancient roads."
      }
    ]
  }
];

export const ANGKOR_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "Who was the Khmer King who commissioned the building of Angkor Wat?",
    options: ["Jayavarman VII", "Suryavarman II", "Yasovarman I", "Indravarman I"],
    correctAnswer: 1,
    explanation: "King Suryavarman II commissioned Angkor Wat during his reign from 1113 to around 1150 CE as a state temple dedicated to Lord Vishnu."
  },
  {
    id: "q2",
    question: "Why does Angkor Wat uniquely face West instead of East?",
    options: [
      "To face the capital city of Siam",
      "Because West is associated with Lord Vishnu and funerary rites",
      "Due to river flow orientation",
      "It was built by mistake facing west"
    ],
    correctAnswer: 1,
    explanation: "West is the direction sacred to Lord Vishnu and the setting sun, reflecting the temple's dual purpose as a sanctuary for Vishnu and Suryavarman II's eternal tomb."
  },
  {
    id: "q3",
    question: "What sacred myth is depicted in the famous East Gallery bas-relief?",
    options: [
      "The Ramayana Battle of Lanka",
      "The Churning of the Ocean of Milk",
      "The Birth of Buddha",
      "The Defeat of the Chams"
    ],
    correctAnswer: 1,
    explanation: "The Churning of the Ocean of Milk (Samudra Manthan) depicts 88 Asuras and 92 Devas pulling the serpent Vasuki to churn the ocean for the elixir of immortality."
  },
  {
    id: "q4",
    question: "How were the 5+ million tons of sandstone transported from Mount Kulen?",
    options: [
      "By horse-drawn iron carriages",
      "Floated on bamboo rafts via engineered river canals",
      "Carried on foot by 100,000 elephants",
      "Rolled on tree logs across land"
    ],
    correctAnswer: 1,
    explanation: "Khmer engineers dug an intricate 50km canal network linking Phnom Kulen quarries to Siem Reap, floating massive stone blocks on river barges."
  },
  {
    id: "q5",
    question: "What 21st-century technology revealed the true extent of Greater Angkor's suburban mega-city?",
    options: [
      "Airborne LiDAR (Laser Radar)",
      "Deep Ground Radar",
      "Satellite Sonar",
      "Thermal Infrared Scanners"
    ],
    correctAnswer: 0,
    explanation: "Airborne LiDAR scanning penetrated dense jungle cover to map hidden roads, reservoirs, and city blocks housing up to 1 million people."
  }
];
