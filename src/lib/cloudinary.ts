const BASE = "https://res.cloudinary.com/dp9bjis3z";

/** Image URL from a Cloudinary path, e.g. "v123/ovie/house-1/1_abc.png" */
export const imageUrl = (path: string) => `${BASE}/image/upload/${path}`;

/**
 * Video sources from a Cloudinary path WITHOUT extension,
 * e.g. "v123/ovie/1st_house_abc".
 * WebM (VP9, max quality) first, original MP4 as fallback.
 */
export const videoSources = (path: string) => ({
  webm: `${BASE}/video/upload/f_webm,vc_vp9,q_100/${path}.webm`,
  mp4: `${BASE}/video/upload/${path}.mp4`,
});
