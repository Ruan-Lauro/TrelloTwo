import { useState, useEffect, useRef } from 'react';

interface WaveHeaderProps {
  companyName?: string;
  subtitle?: string;
}

interface WavePoint {
  x: number;
  y: number;
  strength: number;
  timeCreated: number;
}

export default function WaveHeader({ 
  companyName = "Sun Lion Logistics Transportes Internacionais Ltda",
  subtitle = "Solicite uma cotação" 
}: WaveHeaderProps) {
  const [phase, setPhase] = useState(0);
  const [boatPosition, setBoatPosition] = useState(10);
  const [clickPoints, setClickPoints] = useState<WavePoint[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Handle wave click
  const handleWaveClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = ((e.clientX - svgRect.left) / svgRect.width) * 100;
      const y = 50; // Fixed y position for simplicity
      
      setClickPoints(prev => [
        ...prev, 
        { 
          x, 
          y, 
          strength: 18,
          timeCreated: Date.now()
        }
      ]);
    }
  };

  useEffect(() => {
    // Wave animation
    const animateWaves = () => {
      setPhase(prev => (prev + 0.05) % (Math.PI * 2));
      
      // Move boat with the wave
      setBoatPosition(prev => {
        const newPos = prev + 0.3;
        return newPos > 110 ? -10 : newPos;
      });
      
      // Fade out click points over time
      setClickPoints(prev => 
        prev
          .map(point => ({
            ...point,
            strength: point.strength * 0.92
          }))
          .filter(point => point.strength > 0.5 && Date.now() - point.timeCreated < 3000)
      );
    };
    
    const animationId = setInterval(animateWaves, 50);
    return () => clearInterval(animationId);
  }, []);

  // SVG path generator for wave shape with click point influence
  const createWavePath = (amplitude: number, frequency: number, phase: number, yOffset: number): string => {
    const points = [];
    const segments = 50;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 100;
      
      // Base wave
      let y = amplitude * Math.sin((frequency * x) + phase);
      
      // Add influence from click points
      clickPoints.forEach(point => {
        const distance = Math.abs(x - point.x);
        if (distance < 25) {
          const influence = point.strength * Math.cos((distance / 25) * Math.PI / 2);
          y -= influence * (1 - distance / 25);
        }
      });
      
      points.push(`${x},${y + yOffset}`);
    }
    
    return `M0,${yOffset} Q${points.join(' ')} 100,${yOffset} L100,100 L0,100 Z`;
  };

  // Calculate boat's y position based on wave function
  const getBoatYPosition = () => {
    const x = boatPosition;
    const baseWaveY = 8 * Math.sin((0.08 * x) + phase) + 30;
    
    // Add influence from click points
    let additionalOffset = 0;
    clickPoints.forEach(point => {
      const distance = Math.abs(x - point.x);
      if (distance < 25) {
        const influence = point.strength * Math.cos((distance / 25) * Math.PI / 2);
        additionalOffset -= influence * (1 - distance / 25);
      }
    });
    
    return baseWaveY + additionalOffset;
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Company name */}
      <div className="px-6 py-4 text-gray-800 text-lg font-medium">
        {companyName}
      </div>
      
      {/* Wave container */}
      <div className="relative h-64 w-full">
        <svg 
          ref={svgRef}
          className="absolute bottom-0 w-full h-full" 
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          onClick={handleWaveClick}
        >
          {/* Top lighter wave */}
          <path
            d={createWavePath(8, 0.08, phase, 30)}
            fill="#FFF2C6"
          />
          
          {/* Middle wave */}
          <path
            d={createWavePath(10, 0.06, phase + 0.5, 40)}
            fill="#FFDD70"
          />
          
          {/* Bottom darker wave */}
          <path
            d={createWavePath(6, 0.1, phase + 1, 50)}
            fill="#FFCF33"
          />
        </svg>
        
        {/* Custom Cargo Ship based on the image provided */}
        <div 
          className="absolute" 
          style={{ 
            left: `${boatPosition}%`, 
            top: `${getBoatYPosition()}%`,
            transform: 'translate(-50%, -80%)',
            transition: 'top 0.2s ease',
            zIndex: 20
          }}
        >
          <svg width="60" height="50" viewBox="0 0 512 512">
            {/* Ship hull (red part) */}
            <path d="M17,340 L495,340 L450,430 L62,430 C45,380 25,380 17,340 Z" fill="#F44336" stroke="#000000" strokeWidth="16" />
            
            {/* Ship deck (gray part) */}
            <path d="M17,340 L495,340 L495,320 L17,320 Z" fill="#9E9E9E" stroke="#000000" strokeWidth="8" />
            
            {/* Ship cabin structure */}
            <path d="M120,320 L380,320 L380,160 L120,160 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="16" />
            
            {/* Ship antenna/pole */}
            <path d="M205,160 L205,50 L235,50 L235,160 Z" fill="#000000" />
            <path d="M210,50 L230,50 L230,160 L210,160 Z" fill="#9E9E9E" />
            
            {/* Ship bridge */}
            <path d="M280,160 L330,160 L330,220 L280,220 Z" fill="#9E9E9E" stroke="#000000" strokeWidth="16" />
            
            {/* Ship windows */}
            <rect x="140" y="230" width="80" height="40" fill="#03A9F4" stroke="#000000" strokeWidth="16" rx="8" />
            
            {/* Chimney */}
            <path d="M350,160 L430,160 L470,320 L410,320 Z" fill="#9E9E9E" stroke="#000000" strokeWidth="12" />
            <path d="M380,180 L415,180 L440,300 L410,300 Z" fill="#616161" />
            
            {/* Ship portholes */}
            <circle cx="100" cy="385" r="20" fill="#03A9F4" stroke="#000000" strokeWidth="8" />
            <circle cx="180" cy="385" r="20" fill="#03A9F4" stroke="#000000" strokeWidth="8" />
            <circle cx="260" cy="385" r="20" fill="#03A9F4" stroke="#000000" strokeWidth="8" />
            <circle cx="340" cy="385" r="20" fill="#03A9F4" stroke="#000000" strokeWidth="8" />
            <circle cx="420" cy="385" r="20" fill="#03A9F4" stroke="#000000" strokeWidth="8" />
          </svg>
        </div>
        
        {/* Subtitle text */}
        <div className="absolute bottom-16 w-full text-center text-4xl font-bold text-gray-700 z-10">
          {subtitle}
        </div>
      </div>
    </div>
  );
}