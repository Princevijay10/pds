import { motion } from "framer-motion";
import { Target, Eye, Gem, Rocket } from "lucide-react";
import SEO from "../components/SEO.jsx";
import banner from "../assets/banner.jpg";

const values = [
  {
    icon: Target,
    title: "Purpose-Driven Design",
    desc: "Every pixel and line of code serves your business goals — not just aesthetics.",
  },
  {
    icon: Gem,
    title: "Premium Craftsmanship",
    desc: "We treat every project, big or small, with the same attention to detail and finish.",
  },
  {
    icon: Eye,
    title: "Transparent Process",
    desc: "Clear timelines, honest pricing, and regular updates from brief to launch.",
  },
  {
    icon: Rocket,
    title: "Growth Focused",
    desc: "Design and development decisions are made to help your brand scale, not just look good.",
  },
];

const About = () => (
  <>
    <SEO
      title="About Us"
      description="Learn about Prince Digital Studio — a premium design and development studio led by Prince Vijayvargiy, building brands that create real impact."
      path="/about"
    />

    <section className="section">
      <div className="container-px mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="eyebrow">About Prince Digital Studio</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl lg:text-5xl">
            A Studio Built on <span className="gold-text">Craft &amp; Trust</span>
          </h1>
          <p className="mt-6 text-ivory/60 leading-relaxed">
            Prince Digital Studio (PDS) is a full-service creative studio helping brands look,
            feel, and perform premium online. Founded and led by{" "}
            <span className="text-ivory">Prince Vijayvargiy</span>, we work with businesses of
            every size — from first-time founders to established enterprises — to design
            websites, brand identities, and digital content that don&apos;t just look good, but
            drive real results.
          </p>
          <p className="mt-4 text-ivory/60 leading-relaxed">
            Our black, white &amp; gold identity reflects the way we work: bold, precise, and
            premium in every detail. We believe good design is not decoration — it&apos;s a
            business decision.
          </p>
        </motion.div>
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          src={banner}
          alt="Prince Digital Studio at work"
          className="rounded-2xl border border-gold-400/20 shadow-2xl"
        />
      </div>
    </section>

    <section className="section border-t border-obsidian-border">
      <div className="container-px mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">Our Values</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl">
            What Guides Every Project
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-surface p-7"
            >
              <div className="badge-medallion h-12 w-12 text-gold-400">
                <v.icon size={22} />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-ivory">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/60">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section border-t border-obsidian-border">
      <div className="container-px mx-auto max-w-4xl text-center">
        <span className="eyebrow justify-center">Our Founder</span>
        <h2 className="mt-4 font-display text-3xl font-bold text-ivory">Prince Vijayvargiy</h2>
        <p className="mt-2 font-accent text-sm uppercase tracking-widest text-gold-400">Owner / CEO</p>
        <p className="mx-auto mt-6 max-w-2xl text-ivory/60 leading-relaxed">
          With a hands-on approach to every client relationship, Prince leads the studio&apos;s
          design and development process personally — ensuring every project reflects the
          premium standard PDS is known for.
        </p>
      </div>
    </section>
  </>
);

export default About;
