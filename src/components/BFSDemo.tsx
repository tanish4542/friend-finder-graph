
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  visited: boolean;
  inQueue: boolean;
  level: number;
}

interface Edge {
  source: string;
  target: string;
  visited: boolean;
}

const BFSDemo = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', label: 'A', visited: false, inQueue: false, level: -1 },
    { id: 'B', label: 'B', visited: false, inQueue: false, level: -1 },
    { id: 'C', label: 'C', visited: false, inQueue: false, level: -1 },
    { id: 'D', label: 'D', visited: false, inQueue: false, level: -1 },
    { id: 'E', label: 'E', visited: false, inQueue: false, level: -1 },
    { id: 'F', label: 'F', visited: false, inQueue: false, level: -1 },
    { id: 'G', label: 'G', visited: false, inQueue: false, level: -1 },
  ]);
  
  const [edges, setEdges] = useState<Edge[]>([
    { source: 'A', target: 'B', visited: false },
    { source: 'A', target: 'C', visited: false },
    { source: 'B', target: 'D', visited: false },
    { source: 'B', target: 'E', visited: false },
    { source: 'C', target: 'F', visited: false },
    { source: 'C', target: 'G', visited: false },
  ]);
  
  const [queue, setQueue] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // ms
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Array<{
    nodes: Node[];
    edges: Edge[];
    queue: string[];
    currentNode: string | null;
    log: string;
  }>>([]);
  
  // Initialize BFS
  const initializeBFS = () => {
    // Reset everything
    const resetNodes = nodes.map(node => ({
      ...node,
      visited: false,
      inQueue: false,
      level: -1
    }));
    
    const resetEdges = edges.map(edge => ({
      ...edge,
      visited: false
    }));
    
    // Start with node A
    const startNode = 'A';
    const updatedNodes = [...resetNodes];
    const nodeIndex = updatedNodes.findIndex(n => n.id === startNode);
    
    if (nodeIndex !== -1) {
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        inQueue: true,
        level: 0
      };
    }
    
    const initialQueue = [startNode];
    
    // Create initial step
    const initialSteps = [{
      nodes: updatedNodes,
      edges: resetEdges,
      queue: initialQueue,
      currentNode: null,
      log: "Starting BFS from node A"
    }];
    
    setNodes(updatedNodes);
    setEdges(resetEdges);
    setQueue(initialQueue);
    setCurrentNode(null);
    setLogs(["Starting BFS from node A"]);
    setIsComplete(false);
    setCurrentStep(0);
    setSteps(initialSteps);
  };
  
  // Reset animation
  const resetAnimation = () => {
    initializeBFS();
    setIsAnimating(false);
  };
  
  // Get neighbors of a node
  const getNeighbors = (nodeId: string): string[] => {
    return edges
      .filter(edge => edge.source === nodeId)
      .map(edge => edge.target);
  };
  
  // Process current node in BFS
  const processStep = () => {
    if (queue.length === 0) {
      setIsAnimating(false);
      setIsComplete(true);
      addLog("BFS complete! All nodes have been visited.");
      return;
    }
    
    // Dequeue the first node
    const nodeId = queue[0];
    const newQueue = queue.slice(1);
    
    // Mark current node as visited
    const updatedNodes = nodes.map(node => 
      node.id === nodeId 
        ? { ...node, visited: true, inQueue: false } 
        : node
    );
    
    // Get unvisited neighbors
    const neighbors = getNeighbors(nodeId);
    const newNodesInQueue: string[] = [];
    
    // Process neighbors
    neighbors.forEach(neighborId => {
      const neighborNode = updatedNodes.find(n => n.id === neighborId);
      
      if (neighborNode && !neighborNode.visited && !neighborNode.inQueue) {
        // Mark this neighbor as in queue
        const nodeIndex = updatedNodes.findIndex(n => n.id === neighborId);
        if (nodeIndex !== -1) {
          const currentNodeObj = updatedNodes.find(n => n.id === nodeId);
          const currentLevel = currentNodeObj ? currentNodeObj.level : 0;
          
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            inQueue: true,
            level: currentLevel + 1
          };
          
          // Add to queue
          newNodesInQueue.push(neighborId);
        }
        
        // Mark the edge as visited
        const edgeIndex = edges.findIndex(e => 
          e.source === nodeId && e.target === neighborId
        );
        
        if (edgeIndex !== -1) {
          edges[edgeIndex] = {
            ...edges[edgeIndex],
            visited: true
          };
        }
      }
    });
    
    // Update queue with new nodes
    const updatedQueue = [...newQueue, ...newNodesInQueue];
    
    // Add log message
    const newLog = `Visited node ${nodeId}. ` +
      (newNodesInQueue.length > 0 
        ? `Added ${newNodesInQueue.join(', ')} to queue.` 
        : 'No new nodes added to queue.');
    
    // Save this step
    const newStep = {
      nodes: [...updatedNodes],
      edges: [...edges],
      queue: updatedQueue,
      currentNode: nodeId,
      log: newLog
    };
    
    setSteps([...steps, newStep]);
    setCurrentStep(currentStep + 1);
    
    // Update state
    setNodes(updatedNodes);
    setQueue(updatedQueue);
    setCurrentNode(nodeId);
    addLog(newLog);
  };
  
  // Add a log message
  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };
  
  // Start or pause animation
  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };
  
  // Step forward manually
  const stepForward = () => {
    if (!isComplete) {
      processStep();
    }
  };
  
  // Run animation when isAnimating is true
  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    
    if (isAnimating && !isComplete) {
      animationTimer = setTimeout(() => {
        processStep();
      }, animationSpeed);
    }
    
    return () => {
      clearTimeout(animationTimer);
    };
  }, [isAnimating, queue, currentNode, isComplete]);
  
  // Initialize on first render
  useEffect(() => {
    resetAnimation();
  }, []);
  
  const nodeSize = 40;
  const canvasWidth = 400;
  const canvasHeight = 180;
  
  // Position nodes in a tree-like structure
  const getNodePosition = (node: Node) => {
    const positions: Record<string, { x: number, y: number }> = {
      'A': { x: canvasWidth / 2, y: 30 },
      'B': { x: canvasWidth / 3, y: 80 },
      'C': { x: (2 * canvasWidth) / 3, y: 80 },
      'D': { x: canvasWidth / 6, y: 140 },
      'E': { x: canvasWidth / 2.5, y: 140 },
      'F': { x: (2 * canvasWidth) / 2.5, y: 140 },
      'G': { x: (5 * canvasWidth) / 6, y: 140 }
    };
    
    return positions[node.id] || { x: 0, y: 0 };
  };
  
  // Get color for node based on its state
  const getNodeColor = (node: Node) => {
    if (node.id === currentNode) return 'bg-indigo-500'; // Current node
    if (node.visited) return getLevelColor(node.level); // Visited node
    if (node.inQueue) return 'bg-yellow-500'; // In queue
    return 'bg-gray-300'; // Not visited
  };
  
  // Get edge color based on its state
  const getEdgeColor = (edge: Edge) => {
    return edge.visited ? 'stroke-orange-500' : 'stroke-gray-400';
  };
  
  // Get edge style based on its state
  const getEdgeStyle = (edge: Edge) => {
    return edge.visited ? 'stroke-[2px]' : 'stroke-[1px]';
  };
  
  // Get color based on level
  const getLevelColor = (level: number) => {
    switch(level) {
      case 0: return 'bg-indigo-500'; // Root node
      case 1: return 'bg-green-500';  // Level 1
      case 2: return 'bg-orange-500'; // Level 2
      default: return 'bg-gray-500';  // Other levels
    }
  };
  
  return (
    <div className="border rounded-lg bg-background shadow-sm p-4">
      <h3 className="font-medium mb-3 text-center">BFS Algorithm Visualization</h3>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Graph visualization */}
        <div className="w-full md:w-3/5">
          <div className="bg-slate-50 rounded-lg relative" style={{ height: canvasHeight, width: '100%' }}>
            {/* Draw edges */}
            <svg className="absolute inset-0 w-full h-full">
              {edges.map((edge, i) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                
                if (!sourceNode || !targetNode) return null;
                
                const sourcePos = getNodePosition(sourceNode);
                const targetPos = getNodePosition(targetNode);
                
                return (
                  <line 
                    key={`edge-${i}`} 
                    x1={sourcePos.x} 
                    y1={sourcePos.y} 
                    x2={targetPos.x} 
                    y2={targetPos.y} 
                    className={`${getEdgeColor(edge)} ${getEdgeStyle(edge)} ${edge.visited ? 'transition-all duration-500' : ''}`} 
                  />
                );
              })}
            </svg>
            
            {/* Draw nodes */}
            {nodes.map(node => {
              const { x, y } = getNodePosition(node);
              
              return (
                <div 
                  key={`node-${node.id}`} 
                  className={`absolute ${getNodeColor(node)} rounded-full flex items-center justify-center text-white font-medium transition-all duration-300`}
                  style={{ 
                    width: nodeSize, 
                    height: nodeSize, 
                    left: x - nodeSize/2, 
                    top: y - nodeSize/2,
                    transform: node.id === currentNode ? 'scale(1.2)' : 'scale(1)'
                  }}
                >
                  {node.id}
                </div>
              );
            })}
          </div>
          
          {/* Controls */}
          <div className="flex justify-center mt-4 space-x-2">
            <Button 
              size="sm" 
              onClick={toggleAnimation}
              variant="outline"
              className="flex items-center gap-1"
            >
              {isAnimating ? <Pause size={14} /> : <Play size={14} />}
              {isAnimating ? 'Pause' : 'Start'}
            </Button>
            
            <Button 
              size="sm" 
              onClick={stepForward}
              variant="outline"
              disabled={isComplete}
              className="flex items-center gap-1"
            >
              <StepForward size={14} />
              Step
            </Button>
            
            <Button 
              size="sm" 
              onClick={resetAnimation}
              variant="outline"
              className="flex items-center gap-1"
            >
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </div>
        
        {/* Status and logs */}
        <div className="w-full md:w-2/5 flex flex-col">
          <div className="bg-slate-50 rounded-lg p-3 mb-3">
            <h4 className="text-sm font-medium mb-2">Current Status</h4>
            <div className="text-sm flex flex-wrap gap-2 mb-2">
              <div>
                <span className="font-medium">Queue:</span>{' '}
                {queue.length > 0 ? queue.join(' → ') : '(empty)'}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <Badge className="bg-indigo-500">Root</Badge>
              <Badge className="bg-green-500">Level 1</Badge>
              <Badge className="bg-orange-500">Level 2</Badge>
              <Badge className="bg-yellow-500">In Queue</Badge>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-3 flex-1 overflow-hidden">
            <h4 className="text-sm font-medium mb-2">Execution Log</h4>
            <div className="text-xs space-y-1 h-24 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className={`py-1 px-1.5 rounded ${i === logs.length - 1 ? 'bg-slate-200' : ''}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BFSDemo;
