import { imageUrl, videoSources } from "@/lib/cloudinary";

export type Project = {
  id: string;
  title: string;
  video: { webm: string; mp4: string };
  images: string[];
};

export const projects: Project[] = [
  {
    id: "house-1",
    title: "House 1",
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
  },
  {
    id: "house-2",
    title: "House 2",
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
  },
  {
    id: "house-3",
    title: "House 3",
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
  },
  {
    id: "house-4",
    title: "House 4",
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
  },
  {
    id: "house-5",
    title: "House 5",
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
  },
];
