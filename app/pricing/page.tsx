"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import AnimatedBackground from "@/app/components/AnimatedBackground";
import { useState } from "react";

export default function Pricing() {
  const { lang } = useLanguage();
  const t = translations[lang].pricing;
  const [isAnnual, setIsAnnual] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as any } },
  };

  const tiers = t.tiers as unknown as any[];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-950 px-4 py-24 sm:px-6 lg:px-8">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            {t.heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-cyan-100 max-w-2xl mx-auto mb-10"
          >
            {t.sub}
          </motion.p>

          {/* Billing Toggle (Language Toggle Style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="flex items-center bg-gray-900/50 backdrop-blur rounded-full p-1 border border-gray-800">

              <button
                onClick={() => setIsAnnual(false)}
                className={`relative text-sm font-medium px-6 py-2 rounded-full transition-colors duration-300 ${!isAnnual
                  ? "text-black"
                  : "text-gray-400 transition-all hover:text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                  }`}
              >
                {!isAnnual && (
                  <motion.div
                    layoutId="activeBilling"
                    className="absolute inset-0 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t.monthlyBilling}</span>
              </button>

              <button
                onClick={() => setIsAnnual(true)}
                className={`flex items-center relative text-sm font-medium px-6 py-2 rounded-full transition-colors duration-300 ${isAnnual
                  ? "text-black"
                  : "text-gray-400 transition-all hover:text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                  }`}
              >
                {isAnnual && (
                  <motion.div
                    layoutId="activeBilling"
                    className="absolute inset-0 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  {t.annualBilling}
                  <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold border transition-colors ${isAnnual
                    ? "bg-black/20 text-black border-black/30"
                    : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    }`}>
                    {t.save15}
                  </span>
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`relative flex flex-col rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 ${tier.popular
                ? "bg-gray-900 border-2 border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.2)] md:-mt-4 md:mb-4"
                : "bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/50"
                }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    {t.mostPopular}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold ${tier.popular ? 'text-cyan-400' : 'text-gray-100'}`}>
                  {tier.name}
                </h3>
                <p className="mt-2 text-sm text-gray-400 min-h-[40px]">
                  {tier.description}
                </p>
              </div>

              <div className="mb-6 flex flex-col">
                <div className="flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">
                    ${tier.price === "0" ? "0" : isAnnual ? Math.floor(Number(tier.price) * 0.85) : tier.price}
                  </span>
                  {tier.price !== "0" && <span className="ml-1 text-xl font-medium text-gray-400">{t.monthly}</span>}
                </div>
                {tier.price !== "0" && isAnnual && (
                  <span className="text-sm text-cyan-400 mt-1 font-medium">{t.billedAnnually}</span>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {tier.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <Check className={`h-5 w-5 shrink-0 mr-3 mt-0.5 ${tier.popular ? "text-cyan-400" : "text-cyan-500"}`} />
                    <span className="text-sm text-gray-300 leading-snug">{feature}</span>
                  </li>
                ))}

                {/* Unavailable Features */}
                {tier.unavailableFeatures && tier.unavailableFeatures.map((feature: string, idx: number) => (
                  <li key={`unavail-${idx}`} className="flex items-start opacity-50">
                    <X className="h-5 w-5 shrink-0 mr-3 mt-0.5 text-gray-500" />
                    <span className="text-sm text-gray-500 line-through decoration-gray-600 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 mt-auto ${tier.id === "free"
                  ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-gray-600 hover:-translate-y-0.5"
                  : "bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:-translate-y-0.5"
                  }`}
              >
                {tier.buttonText}
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400">
            {lang === 'en' ? 'Need a custom enterprise plan?' : lang === 'he' ? 'צריך תוכנית ארגונית מותאמת אישית?' : 'هل تحتاج إلى خطة مؤسسية مخصصة؟'}
            {" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">
              {t.contactSales}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
