
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
      .force('link', d3.forceLink(links).id((d: any) => d.index).distance(120)) // Increased distance
      .force('charge', d3.forceManyBody().strength(-180)) // Stronger repulsion
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40)); // Increased collision radius
    
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
          return 14;
        case 'direct-friend': 
          return 12;
        default: 
          return 10;
      }
    };
    
    // Create group for node labels (background)
    svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => getNodeRadius(d) + 18)
      .attr('font-size', '10px')
      .attr('fill', 'white')
      .attr('stroke', 'rgba(0,0,0,0.5)')
      .attr('stroke-width', 3)
      .attr('paint-order', 'stroke')
      .style('pointer-events', 'none')
      .text((d: any) => d.name);
    
    // Create group for node labels (foreground text)
    svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => getNodeRadius(d) + 18)
      .attr('font-size', '10px')
      .attr('fill', 'white')
      .style('pointer-events', 'none')
      .text((d: any) => d.name);
    
    // Create a group for the nodes
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', getNodeRadius)
      .attr('fill', getNodeColor)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        onSelectNode(d.id);
      });
    
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
    
    node.on('mouseover', (event, d: any) => {
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
    
    // Add user initials inside nodes
    svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none')
      .text((d: any) => d.name.split(' ').map(n => n[0]).join(''));
    
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
    
    node.call(drag(simulation));
    
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
        
      // Update node labels position
      svg.selectAll('text')
        .filter(function() {
          return !this.classList.contains('tooltip-text');
        })
        .each(function(d: any, i: number) {
          const element = d3.select(this);
          if (element.text() === d.name) {
            // This is a name label
            element.attr('x', d.x).attr('y', d.y + getNodeRadius(d) + 18);
          } else if (element.text().length <= 2) {
            // This is an initial
            element.attr('x', d.x).attr('y', d.y + 1);
          }
        });
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
