import { useGetAllFollowers } from '../hooks/useDailyFollowers';

export default function FollowerWall() {
  const { data: allFollowers = [] } = useGetAllFollowers();

  if (allFollowers.length === 0) {
    return null;
  }

  // Create a randomized layout for the names
  const getRandomPosition = (index: number) => {
    // Use index as seed for consistent positioning
    const seed = index * 2654435761;
    const x = (seed % 90) + 5; // 5-95%
    const y = ((seed >> 8) % 90) + 5; // 5-95%
    const rotation = ((seed >> 16) % 30) - 15; // -15 to 15 degrees
    const scale = 0.8 + ((seed >> 24) % 60) / 100; // 0.8 to 1.4
    
    return { x, y, rotation, scale };
  };

  const getRandomColor = (index: number) => {
    const colors = [
      'oklch(0.75 0.15 30)', // warm orange
      'oklch(0.70 0.18 350)', // pink
      'oklch(0.65 0.20 280)', // purple
      'oklch(0.70 0.15 180)', // cyan
      'oklch(0.75 0.18 120)', // green
      'oklch(0.80 0.15 80)', // yellow
      'oklch(0.65 0.20 25)', // red-orange
      'oklch(0.70 0.15 220)', // blue
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="follower-wall">
      {allFollowers.map((name, index) => {
        const pos = getRandomPosition(index);
        const color = getRandomColor(index);
        
        return (
          <div
            key={`${name}-${index}`}
            className="follower-name"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
              '--hover-color': color,
            } as React.CSSProperties}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
}
