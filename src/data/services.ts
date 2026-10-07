import { imageUrl } from "@/lib/cloudinary";

export type Service = {
  id: string;
  number: string;
  title: string;
  text: string;
  /** Shown one after another while this service is active */
  images: string[];
  /** Where the "Learn more" button goes */
  href: string;
};

export const services: Service[] = [
  {
    id: "architectural-design",
    number: "01",
    title: "Architectural Design",
    text: "From concept to built form, we create architecture shaped by context, function, material, and proportion.",
    href: "/services/architectural-design/",
    images: [
      imageUrl("v1791274847/ovie/services/services-01_uycbl5.png"),
      imageUrl("v1791274847/ovie/services/services-01.1_wfcrq5.png"),
      imageUrl("v1791274847/ovie/services/services-01.2_rwm2vl.png"),
      imageUrl("v1791274847/ovie/services/services-01.3_a7m1nm.png"),
      imageUrl("v1791274847/ovie/services/services-01.4_vbyusg.png"),
    ],
  },
  {
    id: "interior-design",
    number: "02",
    title: "Interior Design",
    text: "We design interiors as an extension of the architecture, balancing material, light, movement, and everyday use.",
    href: "/services/interior-design/",
    images: [
      imageUrl("v1791274953/ovie/services/services-2_ylbesr.png"),
      imageUrl("v1791274953/ovie/services/services-2.1_m9gyb6.png"),
      imageUrl("v1791274954/ovie/services/services-2.2_purdoe.png"),
      imageUrl("v1791274953/ovie/services/services-2.3_dtstzf.png"),
      imageUrl("v1791274956/ovie/services/services-2.4_yaiipq.png"),
    ],
  },
  {
    id: "construction-management",
    number: "03",
    title: "Construction Management",
    text: "We coordinate people, materials, timelines, and execution to keep the original design intent intact throughout construction.",
    href: "/services/construction-management/",
    images: [
      imageUrl("v1791275011/ovie/services/services-03_rpz1t8.png"),
      imageUrl("v1791275010/ovie/services/services-03.01_hiqlma.png"),
      imageUrl("v1791275010/ovie/services/services-03.02_uofhly.png"),
      imageUrl("v1791275009/ovie/services/services-03.03_wragcs.png"),
      imageUrl("v1791275011/ovie/services/services-03.04_jrtaua.png"),
    ],
  },
  {
    id: "master-planning",
    number: "04",
    title: "Master Planning",
    text: "We organize sites at a larger scale, considering circulation, density, landscape, growth, and the relationship between built and open space.",
    href: "/services/master-planning/",
    images: [
      imageUrl("v1791275060/ovie/services/services-04_d62jjn.png"),
      imageUrl("v1791275061/ovie/services/services-04.01_v8qmxa.png"),
      imageUrl("v1791275059/ovie/services/services-04.02_rtmoww.png"),
      imageUrl("v1791275060/ovie/services/services-04.03_qg8yr6.png"),
      imageUrl("v1791275063/ovie/services/services-04.04_gw0gfi.png"),
    ],
  },
];
