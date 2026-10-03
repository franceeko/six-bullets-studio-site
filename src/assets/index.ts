export type ImageAsset = {
  type: "image";
  src: string;
  src2x: string;
  fallbackSrc: string;
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
    fallbackSrc: "/assets/team/happy-town-banner.png",
    width: 1697,
    height: 927,
  },
} as const satisfies Record<string, ImageAsset>;

export const devAvatars = {
  eater: {
    type: "image",
    src: "/assets/team/rex.webp",
    src2x: "/assets/team/rex@2x.webp",
    fallbackSrc: "/assets/team/rex.png",
    width: 512,
    height: 512,
  },
  francez: {
    type: "image",
    src: "/assets/team/francez.webp",
    src2x: "/assets/team/francez@2x.webp",
    fallbackSrc: "/assets/team/francez.png",
    width: 512,
    height: 512,
  },
  marpuf: {
    type: "video",
    src: "/assets/team/marpuf.mp4",
    poster: "/assets/team/marpuf-poster.webp",
  },
  poli: {
    type: "image",
    src: "/assets/team/poli.webp",
    src2x: "/assets/team/poli@2x.webp",
    fallbackSrc: "/assets/team/poli.png",
    width: 512,
    height: 512,
  },
  samuca: {
    type: "image",
    src: "/assets/team/samuca.webp",
    src2x: "/assets/team/samuca@2x.webp",
    fallbackSrc: "/assets/team/samuca.png",
    width: 512,
    height: 512,
  },
  stray: {
    type: "image",
    src: "/assets/team/stray.webp",
    src2x: "/assets/team/stray@2x.webp",
    fallbackSrc: "/assets/team/stray.png",
    width: 512,
    height: 512,
  },
  syntax: {
    type: "image",
    src: "/assets/team/syntax.webp",
    src2x: "/assets/team/syntax@2x.webp",
    fallbackSrc: "/assets/team/syntax.png",
    width: 512,
    height: 512,
  },
  thug: {
    type: "image",
    src: "/assets/team/thug.webp",
    src2x: "/assets/team/thug@2x.webp",
    fallbackSrc: "/assets/team/thug.png",
    width: 512,
    height: 512,
  },
  thugo: {
    type: "image",
    src: "/assets/team/thugo.webp",
    src2x: "/assets/team/thugo@2x.webp",
    fallbackSrc: "/assets/team/thugo.png",
    width: 512,
    height: 512,
  },
  whirle: {
    type: "image",
    src: "/assets/team/whirle.webp",
    src2x: "/assets/team/whirle@2x.webp",
    fallbackSrc: "/assets/team/whirle.png",
    width: 512,
    height: 512,
  },
  yuki: {
    type: "image",
    src: "/assets/team/yuki.webp",
    src2x: "/assets/team/yuki@2x.webp",
    fallbackSrc: "/assets/team/yuki.png",
    width: 512,
    height: 512,
  },
  zark: {
    type: "image",
    src: "/assets/team/zark.webp",
    src2x: "/assets/team/zark@2x.webp",
    fallbackSrc: "/assets/team/zark.png",
    width: 512,
    height: 512,
  },
} as const satisfies Record<string, ImageAsset | VideoAsset>;
