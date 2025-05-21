
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { User } from '@/utils/bfs';

interface GraphViewProps {
  users: User[];
  connections: { source: number; target: number }[];
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
    
    // Create links data from connections
    const links = connections.map(conn => {
      const source = nodes.findIndex(node => node.id === conn.source);
      const target = nodes.findIndex(node => node.id === conn.target);
      return { source, target };
    });
    
    // Set up the simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.index).distance(150)) // Increased distance further
      .force('charge', d3.forceManyBody().strength(-200)) // Stronger repulsion
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60)); // Increased collision radius
    
    // Create a group for the links
    const link = svg.append('g')
      .attr('stroke', '#666')
      .attr('stroke-opacity', 0.3)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 1.5);
    
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
          return 30; // Increased size for better visibility
        case 'direct-friend': 
          return 25; // Increased size
        default: 
          return 20; // Increased size
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
    
    // Add background for text labels
    nodeGroups.append('rect')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', 'rgba(0,0,0,0.6)')
      .attr('width', (d: any) => Math.max(d.name.length * 7, 60))
      .attr('height', 18)
      .attr('x', (d: any) => -(Math.max(d.name.length * 7, 60) / 2))
      .attr('y', (d: any) => getNodeRadius(d) + 5);
    
    // Add text labels for nodes
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => getNodeRadius(d) + 18)
      .attr('font-size', '12px')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .text((d: any) => d.name);
    
    // Add user initials inside nodes
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text((d: any) => d.name.split(' ').map((n: string) => n[0]).join(''));
    
    // Add tooltips (username on hover)
    const tooltip = svg.append('g')
      .attr('class', 'tooltip')
      .style('pointer-events', 'none')
      .style('visibility', 'hidden');
    
    const tooltipRect = tooltip.append('rect')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', 'rgba(0,0,0,0.7)')
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
      
      // Enhanced tooltip content
      const tooltipContent = [
        d.name,
        `@${d.username}`,
        d.friends.length > 0 ? `${d.friends.length} connections` : 'No connections'
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
    })
    .on('mousemove', (event) => {
      tooltip.attr('transform', `translate(${event.offsetX}, ${event.offsetY - 40})`);
    })
    .on('mouseout', () => {
      tooltip.style('visibility', 'hidden');
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
    
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      // Update node group positions
      nodeGroups.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });
    
    // Optional: Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });
    
    svg.call(zoom as any);
    
  }, [users, connections, highlightedUserId, currentUserId, width, height, onSelectNode]);
  
  return (
    <div className="w-full h-full overflow-hidden">
      <svg ref={svgRef} className="w-full bg-background/50 rounded-lg"></svg>
    </div>
  );
};

export default GraphView;
