import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { User } from '@/utils/bfs';

interface GraphViewProps {
  users: User[];
  connections: { source: number; target: number }[];
  highlightedUserId?: number;
  width?: number;
  height?: number;
  onSelectNode?: (userId: number) => void;
}

const GraphView = ({ 
  users, 
  connections, 
  highlightedUserId,
  width = 800, 
  height = 600,
  onSelectNode
}: GraphViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up the force-directed graph (very simple version)
    const nodeRadius = 20;
    const nodes = users.map((user) => {
      const isHighlighted = user.id === highlightedUserId;
      
      return {
        id: user.id,
        name: user.name,
        x: Math.random() * (width - 2 * nodeRadius) + nodeRadius,
        y: Math.random() * (height - 2 * nodeRadius) + nodeRadius,
        radius: isHighlighted ? nodeRadius * 1.2 : nodeRadius,
        color: isHighlighted ? '#9b87f5' : '#7E69AB',
        textColor: isHighlighted ? '#9b87f5' : '#333333',
        isHighlighted
      };
    });
    
    // Simple force-directed layout algorithm
    const simulation = () => {
      // Repulsive force between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = 0.2;
            const fx = dx / distance * force;
            const fy = dy / distance * force;
            
            nodes[j].x += fx;
            nodes[j].y += fy;
            nodes[i].x -= fx;
            nodes[i].y -= fy;
          }
        }
      }
      
      // Attractive force for connections
      for (const connection of connections) {
        const source = nodes.find(node => node.id === connection.source);
        const target = nodes.find(node => node.id === connection.target);
        
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 100) {
            const force = 0.05;
            const fx = dx * force;
            const fy = dy * force;
            
            source.x += fx;
            target.x -= fx;
            source.y += fy;
            target.y -= fy;
          }
        }
      }
      
      // Keep nodes within bounds
      nodes.forEach(node => {
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
      });
    };
    
    // Run the simulation a few times
    for (let i = 0; i < 100; i++) {
      simulation();
    }
    
    // Draw connections
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (const connection of connections) {
      const source = nodes.find(node => node.id === connection.source);
      const target = nodes.find(node => node.id === connection.target);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    }
    
    // Draw nodes
    nodes.forEach(node => {
      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw node label
      ctx.fillStyle = 'white';
      ctx.font = node.isHighlighted ? 'bold 12px Inter, sans-serif' : '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Get first letter of first and last name
      const initials = node.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
      
      ctx.fillText(initials, node.x, node.y);
      
      // Draw node name below
      ctx.fillStyle = node.textColor;
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(node.name, node.x, node.y + node.radius + 12);
    });
    
    // Add click handler
    if (onSelectNode) {
      canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if click is inside any node
        for (const node of nodes) {
          const distance = Math.sqrt(
            Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
          );
          
          if (distance <= node.radius) {
            onSelectNode(node.id);
            break;
          }
        }
      };
    }
    
  }, [users, connections, width, height, highlightedUserId, onSelectNode]);

  return (
    <Card className="p-4 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="w-full h-full max-w-full max-h-[70vh]"
      />
    </Card>
  );
};

export default GraphView;
