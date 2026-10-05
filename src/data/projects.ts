import { imageUrl, videoSources } from "@/lib/cloudinary";

export type Project = {
  id: string;
  title: string;
  video: { webm: string; mp4: string };
  images: string[];

  /** Which image (0-based) is used as the cover in Selected Work */
  cover: number;

  location: string;
  year: string;

  /** Typology, e.g. "Residential" */
  type: string;

  status: string;
  lotArea: string;

  /** Gross floor area (GFA) */
  area: string;

  storeys: string;
  client: string;

  /** One-line concept statement, shown under the title */
  summary: string;

  brief: string;
  site: string;
  concept: string;

  response: {
    spatial: string;
    materials: string;
    climate: string;
  };

  materials: {
    name: string;
    note: string;
  }[];

  credits: {
    role: string;
    name: string;
  }[];

  /** Optional plans, sections, elevations */
  drawings?: {
    label: string;
    src: string;
  }[];
};

/** The studio's standard design process, shown on every case study. */
export const designProcess = [
  {
    phase: "Programming & Site Analysis",
    text: "We begin with climate, orientation, terrain, local building traditions and the daily routines the house needs to support.",
  },
  {
    phase: "Schematic Design",
    text: "Massing, circulation, openings and roof forms are tested against the site until the main architectural idea becomes clear.",
  },
  {
    phase: "Design Development",
    text: "Materials, structure, proportions, openings and environmental responses are refined into one coherent architectural language.",
  },
  {
    phase: "Technical Resolution",
    text: "The design is developed around buildability, durability, weather protection and the performance of each material.",
  },
  {
    phase: "Final Visualization",
    text: "The completed concept is documented through architectural views that communicate atmosphere, materiality and spatial intent.",
  },
];

const credits = [
  { role: "Architecture concept", name: "OVIE Studio" },
  { role: "Design development", name: "OVIE Studio" },
  { role: "Creative direction", name: "OVIE Studio" },
  { role: "Visualization", name: "OVIE Studio" },
];

export const projects: Project[] = [
  {
    id: "house-1",

    title: "Elevated Tropical Narra",

    video: videoSources("v1791179218/ovie/1st_house_pnvv7x"),

    images: [
      "v1791180338/ovie/house-1/1_tifwbb.png",
      "v1791180337/ovie/house-1/2_uawfoi.png",
      "v1791180337/ovie/house-1/3_wgxkl2.png",
      "v1791180337/ovie/house-1/4_rtfse8.png",
      "v1791180337/ovie/house-1/5_lkrzz0.png",
      "v1791180336/ovie/house-1/6_afccfd.png",
      "v1791180338/ovie/house-1/7_pmdnuh.png",
    ].map(imageUrl),

    cover: 2,

    location: "Loboc, Bohol",
    year: "2025",
    type: "Residential",
    status: "Concept design",
    lotArea: "520 sqm",
    area: "240 sqm",
    storeys: "1 elevated level + silong",
    client: "Private residential client",

    summary:
      "A raised tropical home shaped by shade, airflow and the warmth of Philippine hardwood.",

    brief:
      "The house is conceived as a contemporary tropical residence for Loboc, where heat, humidity and prolonged rainfall make passive comfort essential. Rather than sealing the interior from its surroundings, the design lifts the main living floor above the damp ground and opens the house to air, shade and vegetation.",

    site: "Set within the lush landscape of Loboc, the site experiences high humidity, intense tropical sun and frequent rain. Dense planting and mature trees create opportunities for shade, while the raised ground condition helps protect the house from moisture and allows air to circulate beneath the occupied floor.",

    concept:
      "A lightweight living volume is lifted above the landscape beneath one protective roof. The architecture borrows the environmental intelligence of the bahay kubo and bahay na bato without reproducing either literally, using elevation, deep eaves and breathable spaces as the primary design tools.",

    response: {
      spatial:
        "The main living, dining and kitchen spaces form an open sequence on the elevated floor, with large openings connecting the interior to shaded verandas and surrounding greenery. Below, the silong becomes a flexible covered space for gathering, resting and everyday outdoor activity.",

      materials:
        "Warm timber defines both structure and atmosphere. Narra-toned hardwood is paired with timber louvers, woven accents and restrained natural finishes, allowing the architecture to feel tactile and rooted in its tropical setting.",

      climate:
        "Deep roof overhangs protect openings from sun and rain while operable windows and high-level vents create continuous cross-ventilation. Elevating the house reduces contact with damp ground and allows cooler air to move beneath the occupied spaces.",
    },

    materials: [
      {
        name: "Narra-toned hardwood",
        note: "Primary visual language for framing, flooring and interior surfaces.",
      },
      {
        name: "Timber louvers",
        note: "Filters direct sunlight while maintaining natural airflow.",
      },
      {
        name: "Capiz and woven screens",
        note: "Softens daylight and introduces a distinctly Filipino material character.",
      },
      {
        name: "Natural stone",
        note: "Used selectively at ground level to anchor the raised timber structure.",
      },
    ],

    credits,
  },

  {
    id: "house-2",

    title: "Two-Storey Plaster & Timber",

    video: videoSources("v1791179215/ovie/2nd_house_zqqwdv"),

    images: [
      "v1791180757/ovie/house-2/1.1_aywisq.png",
      "v1791180756/ovie/house-2/1.2_jfd7al.png",
      "v1791180756/ovie/house-2/1.3_t6bwam.png",
      "v1791180755/ovie/house-2/1.4_drbnnc.png",
      "v1791180754/ovie/house-2/1.5_r6u8zc.png",
      "v1791180755/ovie/house-2/1.6_fwzjc5.png",
      "v1791180756/ovie/house-2/1.7_pbe32a.png",
    ].map(imageUrl),

    cover: 4,

    location: "Santa Rosa, Laguna",
    year: "2024",
    type: "Residential",
    status: "Concept design",
    lotArea: "420 sqm",
    area: "320 sqm",
    storeys: "2",
    client: "Private residential client",

    summary:
      "A quiet suburban home where solid plaster volumes are softened by timber, light and landscape.",

    brief:
      "Designed for a suburban neighborhood in Santa Rosa, the house responds to a denser residential setting where privacy, daylight and thermal comfort must coexist. The architecture uses solid plastered volumes toward more exposed edges while opening selectively toward gardens and internal outdoor spaces.",

    site: "The site sits within the warmer lowlands of Laguna, surrounded by neighboring homes and exposed to strong afternoon sun and seasonal monsoon rain. Privacy from adjacent properties and solar protection along the western side strongly influence the arrangement of openings.",

    concept:
      "Heavy and light elements are deliberately contrasted. Plastered masonry forms establish privacy and permanence, while timber screens, recessed openings and warmer interior finishes introduce softness and permeability.",

    response: {
      spatial:
        "Living, dining and kitchen spaces occupy the ground floor and connect directly to landscaped outdoor areas. Bedrooms are placed above for greater privacy, with carefully positioned windows preventing direct views between neighboring houses.",

      materials:
        "Smooth mineral plaster forms the primary exterior envelope while timber appears at soffits, screens, doors and selected ceilings. The limited palette gives the residence a calm and enduring character.",

      climate:
        "Recessed glazing, timber screens and generous roof projections limit direct solar gain. Opposing openings allow air to pass through both levels, while shaded voids and planted edges cool the spaces surrounding the house.",
    },

    materials: [
      {
        name: "Mineral plaster",
        note: "Creates the monolithic exterior volumes and durable primary finish.",
      },
      {
        name: "Timber",
        note: "Used for screens, soffits, doors and interior ceiling accents.",
      },
      {
        name: "Natural stone",
        note: "Adds texture at selected ground-floor and landscape surfaces.",
      },
      {
        name: "Clear glazing",
        note: "Placed within deep recesses to introduce daylight without excessive heat.",
      },
    ],

    credits,
  },

  {
    id: "house-3",

    title: "Mountain Timber Lodge",

    video: videoSources("v1791179215/ovie/3rd_house_jwuo3b"),

    images: [
      "v1791180848/ovie/house-3/2.1_liwrzr.png",
      "v1791180845/ovie/house-3/2.2_a6fswv.png",
      "v1791180845/ovie/house-3/2.3_hgqmhz.png",
      "v1791180846/ovie/house-3/2.4_g0nyi2.png",
      "v1791180843/ovie/house-3/2.5_z8gnuq.png",
      "v1791180843/ovie/house-3/2.6_u7r6on.png",
      "v1791180843/ovie/house-3/2.7_g0dqoz.png",
    ].map(imageUrl),

    cover: 1,

    location: "Cordillera, Philippines",
    year: "2024",
    type: "Residential retreat",
    status: "Concept design",
    lotArea: "620 sqm",
    area: "180 sqm",
    storeys: "2 split levels",
    client: "Private residential client",

    summary:
      "A warm timber retreat embedded into the mountain landscape and shaped by fog, rain and changing elevation.",

    brief:
      "The lodge is envisioned as a compact mountain retreat for the cooler Cordillera highlands. Its architecture prioritizes warmth, shelter and a strong connection to the landscape while avoiding the visual heaviness of a conventional alpine house.",

    site: "The steep mountain terrain is characterized by cool temperatures, frequent fog, heavy seasonal rain and long views across forested slopes. Rather than flattening the site, the building follows its natural level changes.",

    concept:
      "The lodge steps with the terrain instead of sitting on a single artificial platform. A dark protective exterior responds to the mountain weather, while warm timber interiors create contrast and a sense of refuge.",

    response: {
      spatial:
        "Split levels follow the natural slope and reduce the amount of excavation required. Shared living spaces occupy the center of the lodge, while bedrooms and quieter rooms extend toward views and morning light.",

      materials:
        "Timber dominates the interior and selected exterior surfaces, complemented by stone and darker weather-resistant cladding. The palette is deliberately restrained to keep attention on texture, landscape and changing light.",

      climate:
        "An insulated envelope, protected openings and deep eaves reduce heat loss and prevent driven rain from reaching vulnerable timber surfaces. Large windows are concentrated toward protected views rather than exposed windward elevations.",
    },

    materials: [
      {
        name: "Mountain timber",
        note: "Used throughout the interior to create warmth and visual continuity.",
      },
      {
        name: "Dark timber cladding",
        note: "Provides a durable outer skin suited to the wet mountain environment.",
      },
      {
        name: "Local stone",
        note: "Anchors the building to the slope and reinforces the heavier lower level.",
      },
      {
        name: "Insulated glazing",
        note: "Maintains broad mountain views while improving thermal comfort.",
      },
    ],

    credits,
  },

  {
    id: "house-4",

    title: "Coastal Cogon House",

    video: videoSources("v1791179215/ovie/4th_house_po08nr"),

    images: [
      "v1791180940/ovie/house-4/3.1_bkfwfg.png",
      "v1791180943/ovie/house-4/3.2_smad7y.png",
      "v1791180942/ovie/house-4/3.3_oj3a1t.png",
      "v1791180942/ovie/house-4/3.4_n0sixz.png",
      "v1791180941/ovie/house-4/3.5_hnoq0b.png",
      "v1791180940/ovie/house-4/3.6_sdyohg.png",
      "v1791180945/ovie/house-4/3.7_edlwr1.png",
    ].map(imageUrl),

    cover: 5,

    location: "Siargao, Surigao del Norte",
    year: "2023",
    type: "Residential",
    status: "Concept design",
    lotArea: "850 sqm",
    area: "410 sqm",
    storeys: "1",
    client: "Private residential client",

    summary:
      "An open island residence gathered beneath a broad cogon roof and oriented toward sea breeze, shade and outdoor living.",

    brief:
      "The Siargao house is designed around the rhythms of island life, where interior and exterior spaces are used almost interchangeably. The design prioritizes natural ventilation and deep shade while responding to salt exposure, tropical rainfall and strong coastal winds.",

    site: "The coastal site experiences constant humidity, salt-laden air, strong seasonal winds and intense sun. Existing palms and tropical vegetation provide a natural layer of shade while views and prevailing breezes establish the primary orientation of the house.",

    concept:
      "One continuous roof becomes the defining element of the project. Beneath it, enclosed rooms, open-air living areas and shaded circulation operate as a collection of spaces rather than a sealed single volume.",

    response: {
      spatial:
        "Living, dining and lounging areas remain visually connected and open toward the landscape. Bedrooms occupy more protected zones along the perimeter, while generous covered terraces extend everyday living beyond the enclosed interior.",

      materials:
        "A timber structural rhythm supports the large cogon roof, while natural stone, woven textures and warm wood reinforce the relaxed coastal character. Materials are selected to weather naturally rather than depend on delicate finishes.",

      climate:
        "The wide roof creates continuous shade and protects walls from direct tropical rain. Open sides, permeable screens and high-level ventilation encourage constant air movement, while corrosion-resistant fixings are specified for the salt-heavy environment.",
    },

    materials: [
      {
        name: "Cogon thatch",
        note: "Forms the deep, breathable roof that defines the architecture.",
      },
      {
        name: "Timber frame",
        note: "Creates the main structural rhythm and supports open-sided living.",
      },
      {
        name: "Natural stone",
        note: "Used at floors, landscape edges and heavier ground-level elements.",
      },
      {
        name: "Rattan and woven fibre",
        note: "Introduces lightweight texture to screens, furniture and interior details.",
      },
    ],

    credits,
  },

  {
    id: "house-5",

    title: "Ivatan-Inspired Stone & Timber",

    video: videoSources("v1791179215/ovie/5th_house_q4bomz"),

    images: [
      "v1791181021/ovie/house-5/4.1_hyao8n.png",
      "v1791181016/ovie/house-5/4.2_jk5xah.png",
      "v1791181015/ovie/house-5/4.3_wqxubd.png",
      "v1791181015/ovie/house-5/4.4_nl7nh6.png",
      "v1791181020/ovie/house-5/4.5_p9my6g.png",
      "v1791181070/ovie/house-5/4.6_scidol.png",
      "v1791181021/ovie/house-5/4.7_ikkn6x.png",
    ].map(imageUrl),

    cover: 3,

    location: "Batanes, Philippines",
    year: "2025",
    type: "Residential",
    status: "Concept design",
    lotArea: "540 sqm",
    area: "275 sqm",
    storeys: "2",
    client: "Private residential client",

    summary:
      "A contemporary interpretation of Ivatan resilience, pairing heavy stone walls with a warm timber interior.",

    brief:
      "The house takes its starting point from the architecture of Batanes, where buildings have traditionally been shaped by relentless wind, rain and typhoons. Instead of directly reproducing a traditional Ivatan house, the design translates its principles of mass, compactness and protection into a contemporary residence.",

    site: "The exposed Batanes landscape is defined by strong winds, sudden weather changes, intense rain and broad open views. With few natural wind barriers, the building itself must provide shelter while maintaining a meaningful connection to the surrounding terrain.",

    concept:
      "A heavy protective shell faces the weather while warmer, lighter spaces unfold within. Thick stone walls and a compact silhouette establish permanence, while timber introduces softness, tactility and domestic warmth.",

    response: {
      spatial:
        "The plan remains compact to reduce exposed surface area. Service spaces and smaller openings occupy the windward side, while living spaces and larger protected openings face more sheltered views and outdoor areas.",

      materials:
        "Rough stone forms the dominant exterior mass, contrasted by timber floors, ceilings, cabinetry and interior structure. The transition from heavy exterior to warm interior becomes one of the defining spatial experiences of the house.",

      climate:
        "Thick masonry provides thermal stability and physical protection from severe weather. A compact form, protected openings, limited windward glazing and strongly anchored roof construction respond directly to Batanes' typhoon-prone environment.",
    },

    materials: [
      {
        name: "Local stone",
        note: "Forms thick exterior walls that provide mass, durability and wind protection.",
      },
      {
        name: "Timber",
        note: "Brings warmth to interior floors, ceilings, joinery and selected structural elements.",
      },
      {
        name: "Lime-based render",
        note: "Used selectively to protect masonry while retaining a natural mineral finish.",
      },
      {
        name: "Weather-resistant metal",
        note: "Used discreetly for structural connections and roof reinforcement.",
      },
    ],

    credits,
  },
];
