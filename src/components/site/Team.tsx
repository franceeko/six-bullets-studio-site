import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { devs, type Dev } from "@/data/studio";
import { SectionHeader } from "@/components/site/SectionHeader";

function Portrait({ dev }: { dev: Dev }) {
  const [failed, setFailed] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = dev.avatar.type === "video";

  useEffect(() => {
    if (!isVideo) return;

    const video = videoRef.current;
    if (!video) return;

    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setVideoActive(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isVideo]);

  if (failed) return <div className="member-portrait-fallback">{dev.name.slice(0, 2)}</div>;

  if (dev.avatar.type === "video") {
    return (
      <div className="member-card-portrait member-card-portrait--video">
        <video
          ref={videoRef}
          src={videoActive ? dev.avatar.src : undefined}
          poster={videoActive ? dev.avatar.poster : undefined}
          autoPlay={videoActive}
          loop
          muted
          playsInline
          preload={videoActive ? "metadata" : "none"}
          aria-hidden="true"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="member-card-portrait">
      <img
        src={dev.avatar.src}
        srcSet={
          "srcSet" in dev.avatar
            ? dev.avatar.srcSet
            : `${dev.avatar.src} 1x, ${dev.avatar.src2x} 2x`
        }
        sizes="(max-width: 639px) 44vw, (max-width: 1023px) 30vw, 22vw"
        width={dev.avatar.width}
        height={dev.avatar.height}
        alt={`${dev.name} — ${dev.role}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function MemberCard({
  dev,
  index,
  featured = false,
}: {
  dev: Dev;
  index: number;
  featured?: boolean;
}) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [3.2, -3.2]), {
    stiffness: 180,
    damping: 20,
    mass: 0.42,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 180,
    damping: 20,
    mass: 0.42,
  });
  const imageX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 120,
    damping: 24,
  });
  const imageY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-5, 5]), {
    stiffness: 120,
    damping: 24,
  });

  return (
    <m.article
      className={`member-card ${featured ? "member-card--featured" : ""}`}
      initial={{ opacity: 0, y: 32, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.055, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1100 }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
        pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      whileHover={{ y: -7 }}
    >
      <m.div className="member-card-frame" style={{ rotateX, rotateY }}>
        <div className="member-card-topline">
          <span>0{index + 1}</span>
          <span>{dev.tag}</span>
        </div>
        <div className="member-card-portrait-wrap">
          <m.div className="member-card-portrait-motion" style={{ x: imageX, y: imageY }}>
            <Portrait dev={dev} />
          </m.div>
        </div>
        <div className="member-card-caption">
          <div>
            <h3>{dev.name}</h3>
            <p>{dev.role}</p>
          </div>
          <span className="member-card-mark" aria-hidden="true" />
        </div>
        <div className="member-card-sweep" aria-hidden="true" />
      </m.div>
    </m.article>
  );
}

export function Team() {
  const founders = devs.filter((dev) => dev.tag === "Founders");
  const crew = devs.filter((dev) => dev.tag !== "Founders");

  return (
    <section id="equipe" className="team-section" aria-labelledby="team-title">
      <div className="section-shell">
        <SectionHeader title="The Team" titleId="team-title" />

        <div className="team-intro">
          <p>Artists, designers, developers and people keeping the worlds moving.</p>
          <span>6B / PEOPLE</span>
        </div>

        <div className="team-group-head">
          <span>01 / Founders</span>
          <span>Direction, design and the long view.</span>
        </div>
        <div className="team-founders">
          {founders.map((dev, index) => (
            <MemberCard key={dev.id} dev={dev} index={index} featured />
          ))}
        </div>

        <div className="team-group-head team-group-head--crew">
          <span>02 / Crew</span>
          <span>Everyone who makes the worlds move.</span>
        </div>
        <div className="member-formation">
          {crew.map((dev, index) => (
            <MemberCard key={dev.id} dev={dev} index={index + founders.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
