import { AnimatePresence, m } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const items = [
  {
    question: "What is Six Bullets Studio?",
    answer:
      "Six Bullets is an independent Roblox game studio focused on creating original games and memorable worlds.",
  },
  {
    question: "What are you working on?",
    answer:
      "Our current project is Happy Town, a horror and investigation game set in a city that becomes dangerous after dark.",
  },
  {
    question: "Can I play Happy Town yet?",
    answer:
      "Happy Town is in development. We have not announced a release date. Confirmed updates will be shared through our official channels.",
  },
  {
    question: "Can I join the team?",
    answer:
      "Team needs change over time, so openings may not always be available. If you contact us, include your specialty and relevant work or portfolio.",
  },
  {
    question: "Are you open to partnerships?",
    answer:
      "We welcome relevant conversations about collaboration, publishing, and project support. Proposals are considered individually.",
  },
  {
    question: "Where can I follow updates?",
    answer:
      "Our current community links are available in the Contact section. Additional social channels will be listed when they are ready.",
  },
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="six-faq relative px-5 py-16 sm:px-8 md:py-20 xl:px-[4vw]"
      aria-labelledby="faq-title"
    >
      <div className="six-faq__layout mx-auto grid w-full max-w-[1400px] gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="six-faq__intro">
          <p className="six-faq__eyebrow">A few answers</p>
          <h2 id="faq-title" className="six-faq__heading">
            Frequently asked questions<span>.</span>
          </h2>
          <p className="six-faq__description">
            More about the studio, our current project, and working together.
          </p>
        </div>

        <div className="six-faq__list">
          {items.map((item, index) => {
            const active = activeIndex === index;

            return (
              <div className={`six-faq__item${active ? " is-open" : ""}`} key={item.question}>
                <button
                  type="button"
                  className="six-faq__question"
                  aria-expanded={active}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setActiveIndex(active ? null : index)}
                >
                  <span className="six-faq__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="six-faq__title">{item.question}</span>
                  <Plus aria-hidden="true" className="six-faq__icon" />
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <m.div
                      key={`answer-${index}`}
                      id={`faq-answer-${index}`}
                      className="six-faq__answer-clip"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.2 },
                      }}
                    >
                      <m.p
                        className="six-faq__answer"
                        initial={{ y: -5 }}
                        animate={{ y: 0 }}
                        exit={{ y: -3 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      >
                        {item.answer}
                      </m.p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
