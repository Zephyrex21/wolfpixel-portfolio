import React, { useRef, memo } from "react";
import { motion } from "framer-motion";
import { Code, Globe, Server, Brain, Workflow, Package } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { staggerContainer, fadeUp } from "../../utils/animations";
import { serviceItem } from "../../utils/constants";

gsap.registerPlugin(ScrollTrigger);

const services: serviceItem[] = [
  { icon: "Globe", title: "Full-Stack Web Apps" },
  { icon: "Brain", title: "AI/ML & Agentic Systems" },
  { icon: "Workflow", title: "Algorithm Visualizers" },
  { icon: "Code", title: "DSA & Competitive Programming" },
  { icon: "Server", title: "REST API Design" },
  { icon: "Package", title: "Open-Source Tooling" },
];

const iconMap: Record<string, React.ElementType> = {
  Code,
  Globe,
  Server,
  Brain,
  Workflow,
  Package,
};

const Services: React.FC = () => {
  const topRow = [...services, ...services, ...services]; // Triple for smoother loop
  const bottomRow = [
    ...services.slice().reverse(),
    ...services.slice().reverse(),
    ...services.slice().reverse(),
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Continuous marquee — slow, calm infinite loop in each direction.
      gsap.to(topRowRef.current, {
        xPercent: -50,
        ease: "none",
        repeat: -1,
        duration: 35,
      });

      // Bottom row scrolls the opposite way: start shifted, animate back to 0.
      gsap.set(bottomRowRef.current, { xPercent: -50 });
      gsap.to(bottomRowRef.current, {
        xPercent: 0,
        ease: "none",
        repeat: -1,
        duration: 35,
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="services"
      ref={containerRef}
      className="scroll-mt-14 py-8 lg:py-16 flex flex-col relative z-0 sticky top-16"
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 w-full"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Heading */}
        <motion.div variants={fadeUp}>
          <div className="mb-16">
            <h2 className="font-funnel font-extrabold text-[clamp(3.5rem,8vw,6rem)] leading-[1.05] tracking-tight text-foreground">
              What I <span className="font-extrabold">Build</span>
            </h2>
            <p className="mt-6 text-base sm:text-xl leading-[1.9] text-muted-foreground max-w-3xl">
              The kind of problems I like solving — from full-stack products
              to AI systems and algorithmic tools.
            </p>
          </div>
        </motion.div>

        {/* Scroll Rows Container */}
        <motion.div
          variants={fadeUp}
          className="space-y-16 relative overflow-hidden w-full"
        >
          {/* Top Row - scroll left */}
          <div ref={topRowRef} className="flex gap-4 sm:gap-6 md:gap-8 w-max">
            {topRow.map((service, index) => {
              const Icon = iconMap[service.icon] || Code;
              return (
                <div
                  key={`top-${index}`}
                  className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-shrink-0 flex flex-col items-start cursor-pointer hover:opacity-70 transition-opacity duration-300"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 rounded-full border border-foreground/20">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-foreground" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground">
                    {service.title}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Bottom Row - scroll right */}
          <div
            ref={bottomRowRef}
            className="flex gap-4 sm:gap-6 md:gap-8 w-max"
          >
            {bottomRow.map((service, index) => {
              const Icon = iconMap[service.icon] || Code;
              return (
                <div
                  key={`bottom-${index}`}
                  className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-shrink-0 flex flex-col items-start cursor-pointer hover:opacity-70 transition-opacity duration-300"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-3 rounded-full border border-foreground/20">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-foreground" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground">
                    {service.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(Services);
