interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`glass-panel glow-border relative overflow-hidden rounded-[28px] ${className}`}>
      <div className="shimmer-bg absolute inset-0 animate-shimmer opacity-60" />
      <div className="absolute inset-x-6 top-0 h-24 animate-scan bg-gradient-to-b from-cyan-300/20 to-transparent blur-xl" />
      <div className="relative space-y-4 p-6">
        <div className="h-4 w-28 rounded-full bg-white/10" />
        <div className="h-10 w-32 rounded-full bg-white/10" />
        <div className="h-24 rounded-3xl bg-white/5" />
      </div>
    </div>
  );
}
