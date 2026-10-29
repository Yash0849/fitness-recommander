import { motion } from 'framer-motion';

export default function WorkoutLoader() {
  return (
    <div className="space-y-6">
      <motion.div
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="h-36 rounded-[2rem] bg-slate-800/80"
      />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <motion.div
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          className="h-[420px] rounded-[2rem] bg-slate-800/80"
        />
        <motion.div
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          className="h-[420px] rounded-[2rem] bg-slate-800/80"
        />
      </div>
    </div>
  );
}
