import React from "react";

const AnimatedGradientBackground: React.FC = () => {
  return (
    <>
      {/* Primary aurora layer */}
      <div 
        className="fixed inset-0 z-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20 bg-[size:200%_200%] animate-pulse opacity-60"
        aria-hidden="true"
      />
      
      {/* Secondary aurora layer with different timing */}
      <div 
        className="fixed inset-0 z-0 bg-gradient-to-tl from-indigo-500/15 via-cyan-500/15 to-emerald-500/15 dark:from-indigo-600/15 dark:via-cyan-600/15 dark:to-emerald-600/15 bg-[size:300%_200%] animate-pulse opacity-30"
        style={{
          animationDelay: '-2s',
          animationDuration: '4s'
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default AnimatedGradientBackground;
