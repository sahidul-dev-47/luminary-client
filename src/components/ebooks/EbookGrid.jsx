'use client';

import EbookCard from "@/components/ebooks/EbookCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function EbookGrid({ ebooks }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
      >
        {ebooks.map((ebook) => (
          <EbookCard key={ebook._id || ebook.title} ebook={ebook} />
        ))}
      </motion.div>
    </div>
  );
}
