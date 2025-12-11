interface Props {
  className?: string;
  size?: number;
}

export const Loader = ({ className, size = 70 }: Props) => {
  // Use inline style for size to handle dynamic overlapping rings
  const containerStyle = {
    width: size,
    height: size,
  };

  return (
    <div
      className={
        className ? className : "flex items-center justify-center h-screen"
      }
    >
      <div className="relative flex items-center justify-center" style={containerStyle}>

        {/* Outer Ring - Slow Rotate */}
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-r-black border-l-black/40 animate-[spin_3s_linear_infinite]"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Middle Ring - Medium Rotate Reverse */}
        <div
          className="absolute rounded-full border-[3px] border-transparent border-b-rose-600 border-t-rose-600/30 animate-[spin_2s_linear_infinite_reverse]"
          style={{ width: '75%', height: '75%' }}
        />

        {/* Inner Ring - Fast Rotate */}
        <div
          className="absolute rounded-full border-[3px] border-transparent border-r-orange-500 border-l-orange-600/40 animate-[spin_1s_linear_infinite]"
          style={{ width: '50%', height: '50%' }}
        />

        {/* Core - Pulse */}
        <div
          className="rounded-full bg-black animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          style={{ width: '25%', height: '25%' }}
        />
      </div>
    </div>
  );
};
