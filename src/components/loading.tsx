import  { useEffect, useState } from 'react';

export default function LoadingAnimation () {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 15) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-full w-full bg-white/80 z-[1000]">
      <div className="flex relative">

        <div className="w-32 h-32 rounded-full  border-gray-200 flex items-center justify-center">

          <div 
            className="absolute w-full h-full"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
              <div 
                key={angle}
                className={`absolute w-4 h-4 rounded-full ${index % 2 === 0 ? 'bg-1' : 'bg-4'}`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-14px)`,
                  transformOrigin: 'center calc(100% - 14px)'
                }}
              />
            ))}
          </div>
          
          <div className="w-16 h-16 bg-[#fba601] rounded-full animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-2 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
