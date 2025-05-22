
import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { User } from '@/utils/bfs';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, RefreshCw } from 'lucide-react';

interface GraphViewProps {
  users: User[];
  connections: { source: number; target: number; weight?: number }[];
  highlightedUserId?: number;
  currentUserId?: number;
  width: number;
  height: number;
  onSelectNode: (id: number) => void;
}

const GraphView = ({ 
  users, 
  connections, 
  highlightedUserId,
  currentUserId,
  width = 800, 
  height = 600,
  onSelectNode 
}: GraphViewProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // ms per step
  const [animationStep, setAnimationStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const [bfsPath, setBfsPath] = useState<number[][]>([]);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate BFS animation steps
  useEffect(() => {
    if (!currentUserId && !highlightedUserId) return;
    
    const startUserId = highlightedUserId || currentUserId;
    if (!startUserId) return;
    
    const bfsSteps = generateBFSSteps(startUserId, users);
    setBfsPath(bfsSteps);
    setMaxSteps(bfsSteps.length);
    setAnimationStep(0);
  }, [users, highlightedUserId, currentUserId]);
  
  // Animation control functions
  const startAnimation = () => {
    if (animationStep >= maxSteps) {
      setAnimationStep(0);
    }
    
    setIsAnimating(true);
  };
  
  const pauseAnimation = () => {
    setIsAnimating(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };
  
  const resetAnimation = () => {
    pauseAnimation();
    setAnimationStep(0);
  };
  
  const stepForward = () => {
    if (animationStep < maxSteps) {
      setAnimationStep(prevStep => prevStep + 1);
    }
  };
  
  const stepBackward = () => {
    if (animationStep > 0) {
      setAnimationStep(prevStep => prevStep - 1);
    }
  };
  
  // Handle the animation loop
  useEffect(() => {
    if (isAnimating && animationStep < maxSteps) {
      animationRef.current = setTimeout(() => {
        setAnimationStep(prevStep => prevStep + 1);
      }, animationSpeed);
    } else if (animationStep >= maxSteps) {
      setIsAnimating(false);
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, animationStep, maxSteps, animationSpeed]);
  
  // Generate BFS steps from a starting user
  const generateBFSSteps = (startUserId: number, users: User[]): number[][] => {
    const steps: number[][] = [];
    const visited = new Set<number>();
    const queue: number[] = [];
    
    // Initialize with the starting user
    queue.push(startUserId);
    visited.add(startUserId);
    steps.push([...queue]); // First step shows just the starting node
    
    while (queue.length > 0) {
      const currentUserId = queue.shift()!;
      const currentUser = users.find(u => u.id === currentUserId);
      
      if (!currentUser) continue;
      
      // For each friend of the current user
      let levelDiscovered: number[] = [];
      
      for (const friendId of currentUser.friends) {
        if (!visited.has(friendId)) {
          visited.add(friendId);
          queue.push(friendId);
          levelDiscovered.push(friendId);
        }
      }
      
      if (levelDiscovered.length > 0) {
        // Add this level's discoveries as a step
        steps.push([...visited].filter(id => id !== startUserId));
      }
    }
    
    return steps;
  };
  
  useEffect(() => {
    if (!svgRef.current || users.length === 0) return;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
    
    // Create nodes data (with additional properties)
    const nodes = users.map(user => {
      // Determine node type for coloring
      let nodeType = 'regular'; // Default
      
      // Current user's view
      if (currentUserId) {
        if (user.id === currentUserId) {
          nodeType = 'self';
        } else if (user.id === highlightedUserId) {
          nodeType = 'highlighted';
        } else if (currentUserId && 
                  users.find(u => u.id === currentUserId)?.friends.includes(user.id)) {
          nodeType = 'direct-friend';
        } else if (highlightedUserId && 
                  users.find(u => u.id === highlightedUserId)?.friends.includes(user.id)) {
          nodeType = 'friend-of-friend';
        }
      } else if (user.id === highlightedUserId) {
        nodeType = 'highlighted';
      }
      
      // Add animation state for BFS
      let animationState = 'not-visited';
      
      if (animationStep > 0 && bfsPath.length > 0) {
        const currentAnimationPath = bfsPath[Math.min(animationStep, bfsPath.length - 1)];
        
        if (user.id === (highlightedUserId || currentUserId)) {
          animationState = 'source';
        } else if (currentAnimationPath.includes(user.id)) {
          animationState = 'visited';
        }
      }
      
      return {
        ...user,
        nodeType,
        animationState
      };
    });
    
    // Enhance connections with interaction weights
    const links = connections.map(conn => {
      const source = nodes.findIndex(node => node.id === conn.source);
      const target = nodes.findIndex(node => node.id === conn.target);
      
      // Find interaction weight if available
      const sourceUser = users.find(user => user.id === conn.source);
      const targetUser = users.find(user => user.id === conn.target);
      
      let weight = conn.weight || 0;
      
      if (sourceUser && !weight) {
        const interaction = sourceUser.interactions?.find(i => i.userId === conn.target);
        if (interaction) {
          weight = interaction.weight;
        }
      }
      
      if (!weight && targetUser) {
        const interaction = targetUser.interactions?.find(i => i.userId === conn.source);
        if (interaction) {
          weight = interaction.weight;
        }
      }
      
      // Highlight edges in the current BFS path
      let animationState = 'normal';
      
      if (animationStep > 0 && bfsPath.length > 0) {
        const currentAnimationPath = bfsPath[Math.min(animationStep, bfsPath.length - 1)];
        const startId = highlightedUserId || currentUserId;
        
        if (startId && 
            ((conn.source === startId && currentAnimationPath.includes(conn.target)) || 
             (conn.target === startId && currentAnimationPath.includes(conn.source)))) {
          animationState = 'active';
        } else if (currentAnimationPath.includes(conn.source) && 
                   currentAnimationPath.includes(conn.target)) {
          animationState = 'active';
        }
      }
      
      return { 
        source, 
        target, 
        weight: weight || 1,
        animationState
      };
    });
    
    // Set up the simulation with adjusted link distance based on weights
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.index)
        .distance((d: any) => 150 / (Math.sqrt(d.weight) || 1))) // Stronger links (higher weight) are shorter
      .force('charge', d3.forceManyBody().strength(-200)) 
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60)); 
    
    // Create a group for the links
    const link = svg.append('g')
      .attr('stroke', '#666')
      .attr('stroke-opacity', 0.3)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.weight) * 1.5 || 1.5) // Thicker lines for stronger connections
      .attr('stroke', (d: any) => {
        // BFS animation effect on edges
        if (d.animationState === 'active') {
          return '#f97316'; // Orange for active BFS edges
        }
        
        // Use different colors for strong vs weak connections
        if (d.weight > 8) return '#4ade80'; // Strong - green
        if (d.weight > 5) return '#fb923c'; // Medium - orange
        return '#666'; // Default
      })
      .attr('stroke-opacity', (d: any) => d.animationState === 'active' ? 0.8 : 0.3)
      .attr('stroke-dasharray', (d: any) => d.animationState === 'active' ? '5,5' : 'none');
    
    // Add edge labels for interaction weights
    const edgeLabels = svg.append('g')
      .selectAll('text')
      .data(links.filter((d: any) => d.weight > 1)) // Only show labels for weighted edges
      .join('text')
      .attr('dy', -3)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 0.2)
      .attr('paint-order', 'stroke')
      .text((d: any) => d.weight)
      .style('pointer-events', 'none');
    
    // Function to get node color based on relationship and animation state
    const getNodeColor = (d: any) => {
      // Animation colors take precedence during animation
      if (animationStep > 0) {
        if (d.animationState === 'source') {
          return '#6366f1'; // Indigo for source node
        } else if (d.animationState === 'visited') {
          return '#f97316'; // Orange for visited nodes in animation
        }
      }
      
      // Default coloring based on relationship
      switch(d.nodeType) {
        case 'self': 
          return '#4f46e5'; // Current user - indigo
        case 'highlighted': 
          return '#8b5cf6'; // Selected user - violet
        case 'direct-friend': 
          return '#10b981'; // Direct friend - emerald
        case 'friend-of-friend': 
          return '#f97316'; // Friend of the selected user - orange
        default: 
          return '#9333ea'; // Regular node - purple
      }
    };
    
    // Function to get node size based on relationship
    const getNodeRadius = (d: any) => {
      // Animation effect: make visited nodes bigger
      if (animationStep > 0 && d.animationState !== 'not-visited') {
        return d.animationState === 'source' ? 40 : 35;
      }
      
      switch(d.nodeType) {
        case 'self':
        case 'highlighted': 
          return 35; // Increased size for better visibility
        case 'direct-friend': 
          return 28; // Increased size
        default: 
          return 22; // Increased size
      }
    };
    
    // Create node containers (groups for node + label)
    const nodeGroups = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        onSelectNode(d.id);
      });
    
    // Add circles to the node groups
    nodeGroups.append('circle')
      .attr('r', getNodeRadius)
      .attr('fill', getNodeColor)
      .attr('stroke', (d: any) => {
        // Add pulsing effect to nodes in current BFS step
        if (d.animationState === 'visited' || d.animationState === 'source') {
          return '#f97316';
        }
        return '#fff';
      })
      .attr('stroke-width', (d: any) => {
        if (d.animationState === 'visited' || d.animationState === 'source') {
          return 3;
        }
        return 1.5;
      })
      .attr('class', (d: any) => {
        if (d.animationState === 'visited' || d.animationState === 'source') {
          return 'pulse';
        }
        return '';
      });
    
    // Add background for text labels (name below node)
    nodeGroups.append('rect')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', 'rgba(0,0,0,0.6)')
      .attr('width', (d: any) => Math.max(d.name.length * 6.5, 60))
      .attr('height', 20)
      .attr('x', (d: any) => -(Math.max(d.name.length * 6.5, 60) / 2))
      .attr('y', (d: any) => getNodeRadius(d) + 5);
    
    // Add text labels for nodes below the node
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => getNodeRadius(d) + 19)
      .attr('font-size', '12px')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .text((d: any) => d.name);
    
    // Add user initials inside nodes
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('fill', 'white')
      .attr('font-size', (d: any) => getNodeRadius(d) > 30 ? '14px' : '12px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text((d: any) => d.name.split(' ').map((n: string) => n[0]).join(''));
    
    // Enhanced tooltip with more details
    const tooltip = svg.append('g')
      .attr('class', 'tooltip')
      .style('pointer-events', 'none')
      .style('visibility', 'hidden');
    
    const tooltipRect = tooltip.append('rect')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', 'rgba(0,0,0,0.8)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .attr('padding', 5);
    
    const tooltipText = tooltip.append('text')
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '12px')
      .style('pointer-events', 'none');
    
    nodeGroups.on('mouseover', (event, d: any) => {
      tooltip.style('visibility', 'visible');
      
      // Get direct friends for this user
      const directFriends = users.filter(u => d.friends.includes(u.id));
      
      // Enhanced tooltip content
      const tooltipContent = [
        d.name,
        `@${d.username}`,
        directFriends.length > 0 ? `${directFriends.length} connections` : 'No connections',
        directFriends.length > 0 ? `Friends: ${directFriends.slice(0, 3).map(f => f.name).join(', ')}${directFriends.length > 3 ? '...' : ''}` : ''
      ].filter(Boolean).join('\n');
      
      tooltipText.selectAll('tspan').remove();
      
      tooltipText.selectAll('tspan')
        .data(tooltipContent.split('\n'))
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('dy', (_, i) => i === 0 ? 0 : 15)
        .text(d => d);
      
      const textBBox = (tooltipText.node() as SVGTextElement).getBBox();
      
      tooltipRect
        .attr('width', textBBox.width + 20)
        .attr('height', textBBox.height + 15)
        .attr('x', -textBBox.width / 2 - 10)
        .attr('y', -textBBox.height / 2 - 5);
    })
    .on('mousemove', (event) => {
      tooltip.attr('transform', `translate(${event.offsetX}, ${event.offsetY - 40})`);
    })
    .on('mouseout', () => {
      tooltip.style('visibility', 'hidden');
    });
    
    // Add tooltip for edges showing interaction strength
    link.on('mouseover', function(event, d: any) {
      const sourceUser = nodes[d.source.index];
      const targetUser = nodes[d.target.index];
      
      if (!sourceUser || !targetUser) return;
      
      tooltip.style('visibility', 'visible');
      
      const tooltipContent = [
        `${sourceUser.name} — ${targetUser.name}`,
        `Interaction strength: ${d.weight}`
      ].join('\n');
      
      tooltipText.selectAll('tspan').remove();
      
      tooltipText.selectAll('tspan')
        .data(tooltipContent.split('\n'))
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('dy', (_, i) => i === 0 ? 0 : 15)
        .text(d => d);
      
      const textBBox = (tooltipText.node() as SVGTextElement).getBBox();
      
      tooltipRect
        .attr('width', textBBox.width + 20)
        .attr('height', textBBox.height + 15)
        .attr('x', -textBBox.width / 2 - 10)
        .attr('y', -textBBox.height / 2 - 5);
        
      // Highlight the current edge
      d3.select(this)
        .attr('stroke-opacity', 1)
        .attr('stroke-width', (d: any) => (Math.sqrt(d.weight) * 2) || 3);
    })
    .on('mousemove', (event) => {
      tooltip.attr('transform', `translate(${event.offsetX}, ${event.offsetY - 40})`);
    })
    .on('mouseout', function() {
      tooltip.style('visibility', 'hidden');
      // Restore edge styling
      d3.select(this)
        .attr('stroke-opacity', 0.3)
        .attr('stroke-width', (d: any) => (Math.sqrt(d.weight) * 1.5) || 1.5);
    });
    
    // Add drag behavior
    const drag = (simulation: any) => {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    };
    
    nodeGroups.call(drag(simulation) as any);
    
    // Update edge positions in tick events
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      // Update edge label positions
      edgeLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);
      
      // Update node group positions
      nodeGroups.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });
    
    // Optional: Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });
    
    svg.call(zoom as any);
    
    // Optional: Initial zoom to fit all nodes
    const initialScale = 0.9;
    const initialTransform = d3.zoomIdentity
      .translate(width/2, height/2)
      .scale(initialScale)
      .translate(-width/2, -height/2);
    
    svg.call((zoom as any).transform, initialTransform);
    
  }, [users, connections, highlightedUserId, currentUserId, width, height, onSelectNode, animationStep, bfsPath]);
  
  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-center gap-2 mb-4 p-2 bg-background/60 rounded-lg">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={resetAnimation} 
          className="flex items-center gap-1"
        >
          <RefreshCw size={14} />
          Reset
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={stepBackward}
          disabled={animationStep <= 0}
          className="flex items-center"
        >
          <SkipBack size={14} />
        </Button>
        
        {isAnimating ? (
          <Button 
            size="sm" 
            onClick={pauseAnimation} 
            variant="default"
            className="bg-social-primary hover:bg-social-primary/80"
          >
            <Pause size={14} className="mr-1" /> Pause
          </Button>
        ) : (
          <Button 
            size="sm" 
            onClick={startAnimation} 
            variant="default"
            className="bg-social-primary hover:bg-social-primary/80"
            disabled={animationStep >= maxSteps}
          >
            <Play size={14} className="mr-1" /> {animationStep >= maxSteps ? "Reset" : "Start BFS"}
          </Button>
        )}
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={stepForward}
          disabled={animationStep >= maxSteps}
          className="flex items-center"
        >
          <SkipForward size={14} />
        </Button>
        
        <div className="text-xs text-muted-foreground ml-2">
          Step {animationStep}/{maxSteps > 0 ? maxSteps - 1 : 0}
        </div>
      </div>
      
      <div className="relative flex-grow">
        <svg ref={svgRef} className="w-full bg-background/50 rounded-lg"></svg>
        
        {animationStep === 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-4 bg-background/80 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-2">BFS Animation</h3>
            <p className="text-muted-foreground text-sm">
              Click "Start BFS" to visualize the breadth-first search algorithm starting from the selected user.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphView;
