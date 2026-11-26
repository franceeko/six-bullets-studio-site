export type ImageAsset = {
  type: "image";
  src: string;
  src2x: string;
  srcSet?: string;
  width: number;
  height: number;
};

export type VideoAsset = {
  type: "video";
  src: string;
  poster: string;
};

export const images = {
  happyTownBanner: {
    type: "image",
    src: "/assets/team/happy-town-banner.webp",
    src2x: "/assets/team/happy-town-banner@2x.webp",
    srcSet: [
      "/assets/team/happy-town-banner-480.webp 480w",
      "/assets/team/happy-town-banner-768.webp 768w",
      "/assets/team/happy-town-banner-1024.webp 1024w",
      "/assets/team/happy-town-banner-1360.webp 1360w",
      "/assets/team/happy-town-banner.webp 1697w",
    ].join(", "),
    width: 1697,
    height: 927,
  },
} as const satisfies Record<string, ImageAsset>;

export const devAvatars = {
  eater: {
    type: "image",
    src: "/assets/team/rex.webp",
    src2x: "/assets/team/rex@2x.webp",
    srcSet: [
      "/assets/team/rex-320.webp 320w",
      "/assets/team/rex-400.webp 400w",
      "/assets/team/rex.webp 512w",
      "/assets/team/rex@2x.webp 1024w",
    ].join(", "),
    width: 512,
    height: 512,
  },
  francez: {
    type: "image",
    src: "/assets/team/francez.webp",
    src2x: "/assets/team/francez@2x.webp",
    srcSet: [
      "/assets/team/francez-320.webp 320w",
      "/assets/team/francez-400.webp 400w",
      "/assets/team/francez.webp 512w",
      "/assets/team/francez-832.webp 832w",
    ].join(", "),
    width: 512,
    height: 512,
  },
  marpuf: {
    type: "video",
    src: "/assets/team/marpuf.mp4",
    poster: "/assets/team/marpuf-poster-384.webp",
  },
  poli: {
    type: "image",
    src: "/assets/team/poli.webp",
    src2x: "/assets/team/poli@2x.webp",
    srcSet: [
      "/assets/team/poli-320.webp 320w",
      "/assets/team/poli-400.webp 400w",
      "/assets/team/poli.webp 512w",
      "/assets/team/poli@2x.webp 1024w",
    ].join(", "),
    width: 512,
    height: 512,
  },
  samuca: {
    type: "image",
    src: "/assets/team/samuca.webp",
    src2x: "/assets/team/samuca@2x.webp",
    srcSet: [
      "/assets/team/samuca-320.webp 320w",
      "/assets/team/samuca-400.webp 400w",
      "/assets/team/samuca.webp 512w",
      "/assets/team/samuca-832.webp 832w",
    ].join(", "),
    width: 512,
    height: 512,
  },
  stray: {
    type: "image",
    src: "/assets/team/stray.webp",
    src2x: "/assets/team/stray@2x.webp",
    width: 512,
    height: 512,
  },
  syntax: {
    type: "image",
    src: "/assets/team/syntax.webp",
    src2x: "/assets/team/syntax@2x.webp",
    srcSet: [
      "/assets/team/syntax-320.webp 320w",
      "/assets/team/syntax-400.webp 400w",
      "/assets/team/syntax.webp 512w",
      "/assets/team/syntax@2x.webp 1024w",
    ].join(", "),
    width: 512,
    height: 512,
  },
  thug: {
    type: "image",
    src: "/assets/team/thug.webp",
    src2x: "/assets/team/thug@2x.webp",
    width: 512,
    height: 512,
  },
  thugo: {
    type: "image",
    src: "/assets/team/thugo.webp",
    src2x: "/assets/team/thugo@2x.webp",
    srcSet: [
      "/assets/team/thugo-320.webp 320w",
      "/assets/team/thugo-400.webp 400w",
      "/assets/team/thugo.webp 512w",
      "/assets/team/thugo@2x.webp 1024w",
    ].join(", "),
    width: 512,
    height: 512,
  },
  whirle: {
    type: "image",
    src: "/assets/team/whirle.webp",
    src2x: "/assets/team/whirle@2x.webp",
    srcSet: [
      "/assets/team/whirle-320.webp 320w",
      "/assets/team/whirle-400.webp 400w",
      "/assets/team/whirle.webp 512w",
      "/assets/team/whirle@2x.webp 1024w",
    ].join(", "),
    width: 512,
    height: 512,
  },
  yuki: {
    type: "image",
    src: "/assets/team/yuki.webp",
    src2x: "/assets/team/yuki@2x.webp",
    width: 512,
    height: 512,
  },
  zark: {
    type: "image",
    src: "/assets/team/zark.webp",
    src2x: "/assets/team/zark@2x.webp",
    srcSet: [
      "/assets/team/zark-320.webp 320w",
      "/assets/team/zark-400.webp 400w",
      "/assets/team/zark.webp 512w",
      "/assets/team/zark-832.webp 832w",
    ].join(", "),
    width: 512,
    height: 512,
  },
} as const satisfies Record<string, ImageAsset | VideoAsset>;
