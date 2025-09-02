import React from "react";

// Modern Spinner Loader
const SpinnerLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-muted rounded-full animate-spin">
          <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Inner Pulse */}
        <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping"></div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-1">
          <span className="text-foreground font-medium">Loading</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Please wait while we fetch your content</p>
      </div>
    </div>
  );
};

// Wave Loader
const WaveLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Wave Animation */}
      <div className="flex items-center justify-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-8 bg-primary rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s',
              transform: `scaleY(${0.5 + Math.sin(i * 0.5) * 0.5})`
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-foreground font-medium">Loading</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Please wait while we fetch your content</p>
      </div>
    </div>
  );
};

// Ring Loader
const RingLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Ring Animation */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 w-20 h-20 border-4 border-muted rounded-full"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 w-16 h-16 border-4 border-primary/30 border-r-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-foreground font-medium">Loading</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Please wait while we fetch your content</p>
      </div>
    </div>
  );
};

// Simple Minimal Loader
const SimpleLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Simple Spinner */}
      <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      
      {/* Loading Text */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

// Music-themed Loader
const MusicLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Musical Notes Animation */}
      <div className="flex items-center justify-center space-x-2">
        {['♪', '♫', '♬', '♪'].map((note, i) => (
          <div
            key={i}
            className="text-3xl text-primary animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          >
            {note}
          </div>
        ))}
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-foreground font-medium">Loading Music</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Finding the perfect tunes for you</p>
      </div>
    </div>
  );
};

// Default Loader (uses SpinnerLoader)
const Loader: React.FC = () => {
  return <SpinnerLoader />;
};

export default Loader;
export { SpinnerLoader, WaveLoader, RingLoader, SimpleLoader, MusicLoader };
