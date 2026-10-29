import { motion } from 'framer-motion';

export default function LoadingAnimation({ label = 'Working with AI...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div className="flex gap-2">
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            className="h-3 w-3 rounded-full bg-cyan-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: item * 0.12 }}
          />
        ))}
      </div>
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  );
}
