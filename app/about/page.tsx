"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function About() {
  const { lang } = useLanguage();
  const t = translations[lang].about;

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-5xl font-bold text-white"
        >
          {t.heading} <span className="text-cyan-400">Nexora</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6 max-w-2xl text-lg text-gray-400"
        >
          {t.subtitle}
        </motion.p>
      </section>

      {/* How It Works */}
      <section className="border-t border-gray-800 bg-gray-900/50 px-8 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-white"
          >
            {t.howItWorks}
          </motion.h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center"
              >
                <span className="text-sm font-bold text-cyan-400">{item.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-gray-800 px-8 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-white"
          >
            {t.ourMission}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-center text-lg text-gray-400"
          >
            {t.missionText}
          </motion.p>
        </div>
      </section>

      {/* Why Nexora */}
      <section className="border-t border-gray-800 bg-gray-900/50 px-8 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-white"
          >
            {t.whyNexora}
          </motion.h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center"
              >
                <div className="text-4xl">{value.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-gray-500">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-800 px-8 py-20">
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
          {t.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-cyan-400">{stat.number}</p>
              <p className="mt-2 text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800 bg-gray-900/50 px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-3xl font-bold text-white">{t.cta.heading}</h2>
          <p className="mt-4 text-gray-400">{t.cta.sub}</p>
          <a
            href="/sign-up"
            className="mt-8 rounded-lg bg-cyan-500 px-8 py-3 font-semibold text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-200"
          >
            {t.cta.button}
          </a>
        </motion.div>
      </section>
    </div>
  );
}
