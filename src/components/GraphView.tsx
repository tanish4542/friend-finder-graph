
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { User } from '@/utils/bfs';

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
      
      return {
        ...user,
        nodeType
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
      
      return { 
        source, 
        target, 
        weight: weight || 1 
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
        // Use different colors for strong vs weak connections
        if (d.weight > 8) return '#4ade80'; // Strong - green
        if (d.weight > 5) return '#fb923c'; // Medium - orange
        return '#666'; // Default
      });
    
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
    
    // Function to get node color based on relationship
    const getNodeColor = (d: any) => {
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
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
    
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
    
  }, [users, connections, highlightedUserId, currentUserId, width, height, onSelectNode]);
  
  return (
    <div className="w-full h-full overflow-hidden">
      <svg ref={svgRef} className="w-full bg-background/50 rounded-lg"></svg>
    </div>
  );
};

export default GraphView;
