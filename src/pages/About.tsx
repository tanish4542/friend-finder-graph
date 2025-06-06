
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, ArrowRight, BookOpen, Zap, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import BFSDemo from '@/components/BFSDemo';

const About = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-2">About BFS in Social Networks</h1>
          <p className="text-muted-foreground mb-8">
            Understanding Breadth-First Search and its application in friend recommendation systems
          </p>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4">What is Breadth-First Search (BFS)?</h2>
              
              <p className="mb-4">
                Breadth-First Search is a graph traversal algorithm that explores all vertices at the current depth before moving on to vertices at the next depth level. It's like exploring a maze by checking all possible paths one step at a time.
              </p>
              
              <div className="bg-gradient-to-r from-social-primary/10 to-social-secondary/10 p-4 rounded-lg mb-4 border border-social-primary/20">
                <h3 className="font-medium mb-2">BFS Algorithm Steps:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Start with a root node and mark it as visited</li>
                  <li>Add the root node to a queue</li>
                  <li>While the queue is not empty:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Remove the first node from the queue</li>
                      <li>Process this node (e.g., check if it's the target)</li>
                      <li>Add all unvisited neighbors of this node to the queue</li>
                      <li>Mark all these neighbors as visited</li>
                    </ul>
                  </li>
                  <li>Repeat until the queue is empty or the target is found</li>
                </ol>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">Interactive BFS Demonstration</h3>
                <BFSDemo />
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Click the play button to watch BFS in action, or use the step button to go through the algorithm one step at a time.
                </p>
              </div>
              
              <div className="flex justify-center my-6">
                <div className="relative w-full max-w-md h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  {/* Simplified BFS visualization */}
                  <div className="absolute w-10 h-10 rounded-full bg-social-primary text-white flex items-center justify-center top-4 left-1/2 transform -translate-x-1/2 font-medium shadow-md">
                    A
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-secondary text-white flex items-center justify-center top-20 left-1/4 transform -translate-x-1/2 font-medium shadow-md">
                    B
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-secondary text-white flex items-center justify-center top-20 left-3/4 transform -translate-x-1/2 font-medium shadow-md">
                    C
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-tertiary text-white flex items-center justify-center bottom-4 left-1/6 transform -translate-x-1/2 font-medium shadow-md">
                    D
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-tertiary text-white flex items-center justify-center bottom-4 left-1/3 transform -translate-x-1/2 font-medium shadow-md">
                    E
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-tertiary text-white flex items-center justify-center bottom-4 left-2/3 transform -translate-x-1/2 font-medium shadow-md">
                    F
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-tertiary text-white flex items-center justify-center bottom-4 left-5/6 transform -translate-x-1/2 font-medium shadow-md">
                    G
                  </div>
                  
                  {/* Lines connecting nodes */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* A to B */}
                    <line x1="50%" y1="24" x2="25%" y2="80" stroke="#9b87f5" strokeWidth="2" />
                    {/* A to C */}
                    <line x1="50%" y1="24" x2="75%" y2="80" stroke="#9b87f5" strokeWidth="2" />
                    {/* B to D */}
                    <line x1="25%" y1="80" x2="16.67%" y2="136" stroke="#7E69AB" strokeWidth="2" />
                    {/* B to E */}
                    <line x1="25%" y1="80" x2="33.33%" y2="136" stroke="#7E69AB" strokeWidth="2" />
                    {/* C to F */}
                    <line x1="75%" y1="80" x2="66.67%" y2="136" stroke="#7E69AB" strokeWidth="2" />
                    {/* C to G */}
                    <line x1="75%" y1="80" x2="83.33%" y2="136" stroke="#7E69AB" strokeWidth="2" />
                  </svg>
                  
                  <div className="absolute right-2 top-2 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">
                    BFS Order: A, B, C, D, E, F, G
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mb-4 text-sm text-center">
                <div>
                  <div className="w-4 h-4 rounded-full bg-social-primary mx-auto mb-1"></div>
                  <p>Level 0</p>
                </div>
                <div>
                  <div className="w-4 h-4 rounded-full bg-social-secondary mx-auto mb-1"></div>
                  <p>Level 1</p>
                </div>
                <div>
                  <div className="w-4 h-4 rounded-full bg-social-tertiary mx-auto mb-1"></div>
                  <p>Level 2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4">Why Use BFS?</h2>
              
              <p className="mb-4">
                BFS is particularly useful for finding the shortest path between nodes in an unweighted graph. Some key advantages:
              </p>
              
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Guarantees the shortest path in unweighted graphs</li>
                <li>Level-by-level exploration makes it perfect for social networks</li>
                <li>Can identify all nodes at a given "distance" from the starting point</li>
                <li>Simple implementation using a queue data structure</li>
              </ul>
              
              <p>
                In social networks, this helps us find friends who are directly connected (level 1), friends of friends (level 2), and so on.
              </p>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">BFS in Social Networks</h2>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-medium mb-2">Finding Connections</h3>
              <p className="text-muted-foreground mb-4">
                In a social network, BFS helps discover connections between users:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Level 1: Direct friends</li>
                <li>Level 2: Friends of friends</li>
                <li>Level 3: Extended network</li>
              </ul>
            </div>
            
            <div className="md:w-1/2 bg-gradient-to-r from-social-light/30 to-social-primary/10 p-4 rounded-lg border border-social-primary/20">
              <div className="connection-path mb-2">
                <div className="connection-path-item">You</div>
                <ArrowRight className="connection-path-arrow" size={16} />
                <div className="connection-path-item">Sam</div>
                <ArrowRight className="connection-path-arrow" size={16} />
                <div className="connection-path-item">Alex</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Here, Alex is a Level 2 connection (friend of a friend)
              </p>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Tabs defaultValue="bfs" className="w-full">
                <TabsList className="mb-4 grid w-full grid-cols-3">
                  <TabsTrigger value="bfs">BFS Algorithm</TabsTrigger>
                  <TabsTrigger value="dfs">BFS vs DFS</TabsTrigger>
                  <TabsTrigger value="alpha-beta">Alpha-Beta Pruning</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bfs" className="space-y-4">
                  <h3 className="font-medium mb-2">BFS Algorithm in JavaScript</h3>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-gray-900 text-gray-100 font-mono text-sm">
                    <pre className="text-left">
{`// Breadth-First Search implementation in JavaScript
function bfs(graph, startNode) {
  // Queue to track nodes to visit
  const queue = [startNode];
  
  // Set to track visited nodes
  const visited = new Set([startNode]);
  
  // Track connection level
  const level = { [startNode]: 0 };
  
  // Track paths (optional)
  const parent = { [startNode]: null };
  
  // While we have nodes to visit
  while (queue.length > 0) {
    const currentNode = queue.shift();
    const currentLevel = level[currentNode];
    
    // Process the current node
    console.log(\`Visiting node \${currentNode} at level \${currentLevel}\`);
    
    // Get neighbors of current node
    const neighbors = graph[currentNode] || [];
    
    // Explore all neighbors
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        // Mark as visited and enqueue
        visited.add(neighbor);
        queue.push(neighbor);
        
        // Track connection level
        level[neighbor] = currentLevel + 1;
        
        // Track path
        parent[neighbor] = currentNode;
      }
    }
  }
  
  return {
    levels: level,   // Distance of each node from start
    paths: parent    // Can be used to reconstruct paths
  };
}

// Example usage:
const socialNetwork = {
  'Alice': ['Bob', 'Charlie', 'David'],
  'Bob': ['Alice', 'Eva', 'Frank'],
  'Charlie': ['Alice', 'Gina'],
  'David': ['Alice', 'Helen'],
  'Eva': ['Bob', 'Ivan'],
  'Frank': ['Bob'],
  'Gina': ['Charlie'],
  'Helen': ['David'],
  'Ivan': ['Eva'],
};

const result = bfs(socialNetwork, 'Alice');
console.log('Connection levels:', result.levels);

// Find all friends at level 2 (friends of friends)
const friendsOfFriends = Object.entries(result.levels)
  .filter(([person, level]) => level === 2)
  .map(([person]) => person);

console.log('Friends of friends:', friendsOfFriends);`}
                    </pre>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="dfs" className="space-y-4">
                  <h3 className="font-medium mb-2">BFS vs DFS Comparison</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium mb-2 text-green-800">Breadth-First Search (BFS)</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                        <li>Uses a queue (FIFO)</li>
                        <li>Explores level by level</li>
                        <li>Finds shortest paths</li>
                        <li>Better for finding nearby nodes</li>
                        <li>Uses more memory (stores all nodes at current level)</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium mb-2 text-blue-800">Depth-First Search (DFS)</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                        <li>Uses a stack (LIFO)</li>
                        <li>Explores as far as possible along a branch</li>
                        <li>Doesn't guarantee shortest path</li>
                        <li>Better for maze solving and exhaustive searches</li>
                        <li>Uses less memory (stores only the current path)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong className="text-gray-900">When to use BFS:</strong> Finding shortest paths, level-ordered traversal, finding nodes closest to starting point
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong className="text-gray-900">When to use DFS:</strong> Exploring all possible paths, maze solving, detecting cycles
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="alpha-beta" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-social-primary" />
                    <h3 className="font-medium">Alpha-Beta Pruning Algorithm</h3>
                  </div>
                  
                  <div className="bg-gradient-to-r from-social-primary/10 to-social-secondary/10 p-6 rounded-lg border border-social-primary/20">
                    <p className="text-sm mb-4 text-gray-700">
                      Alpha-Beta pruning is an optimization technique for the minimax algorithm used in game theory and decision trees. 
                      It reduces the number of nodes evaluated in the search tree by eliminating branches that won't affect the final decision.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-600" />
                          <span className="text-green-800">Alpha (α) - Maximizer's Best</span>
                        </h4>
                        <p className="text-xs text-green-700">
                          The best value that the maximizing player can guarantee so far. 
                          It represents the lower bound of possible scores for the maximizing player.
                        </p>
                      </div>
                      
                      <div className="bg-white/70 p-4 rounded-lg border border-red-200">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-red-600" />
                          <span className="text-red-800">Beta (β) - Minimizer's Best</span>
                        </h4>
                        <p className="text-xs text-red-700">
                          The best value that the minimizing player can guarantee so far. 
                          It represents the upper bound of possible scores for the minimizing player.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium mb-2 text-purple-800">How Alpha-Beta Pruning Works:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-purple-700">
                      <li><strong>Initialize:</strong> Start with α = -∞ (worst for maximizer) and β = +∞ (worst for minimizer)</li>
                      <li><strong>Maximizing nodes:</strong> Update α with the maximum value found so far</li>
                      <li><strong>Minimizing nodes:</strong> Update β with the minimum value found so far</li>
                      <li><strong>Pruning condition:</strong> If α ≥ β at any point, prune the remaining branches (cutoff)</li>
                      <li><strong>Result:</strong> This eliminates branches that won't affect the final decision, saving computation time</li>
                    </ol>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-2 text-blue-800">Key Insight: The Pruning Logic</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      When α {'>'}= β, it means the maximizing player has already found a better option elsewhere, 
                      so the minimizing player won't choose this path. We can safely ignore the remaining branches.
                    </p>
                    <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
                      <strong>Example:</strong> If maximizer has α = 5 and minimizer finds β = 3, 
                      the maximizer won't go down this path since they already have a better option (5 {'>'} 3).
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[350px] w-full rounded-md border p-4 bg-gray-900 text-gray-100 font-mono text-xs">
                    <pre className="text-left">
{`// Alpha-Beta Pruning Implementation
function alphaBeta(node, depth, alpha, beta, maximizingPlayer) {
  // Base case: if we've reached max depth or terminal node
  if (depth === 0 || isTerminal(node)) {
    return evaluate(node);
  }
  
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    
    for (let child of getChildren(node)) {
      let eval = alphaBeta(child, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      
      // Beta cutoff - prune remaining branches
      if (beta <= alpha) {
        console.log('🚫 Beta cutoff! Alpha:', alpha, 'Beta:', beta);
        break; // α-β pruning - remaining siblings won't be explored
      }
    }
    return maxEval;
    
  } else {
    let minEval = Infinity;
    
    for (let child of getChildren(node)) {
      let eval = alphaBeta(child, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      
      // Alpha cutoff - prune remaining branches  
      if (beta <= alpha) {
        console.log('✂️ Alpha cutoff! Alpha:', alpha, 'Beta:', beta);
        break; // α-β pruning - remaining siblings won't be explored
      }
    }
    return minEval;
  }
}

// Helper functions (implementation depends on your game)
function isTerminal(node) {
  // Check if this is a leaf node (game over, max depth, etc.)
  return node.gameOver || node.children.length === 0;
}

function evaluate(node) {
  // Return the heuristic value of this position
  // Positive values favor the maximizing player
  // Negative values favor the minimizing player
  return node.score;
}

function getChildren(node) {
  // Return all possible moves/states from current position
  return node.children || [];
}

// Example usage in a game tree
const gameTree = {
  score: null,
  gameOver: false,
  children: [/* ... possible moves ... */]
};

// Find best move using alpha-beta pruning
const bestScore = alphaBeta(gameTree, 6, -Infinity, Infinity, true);
console.log('🎯 Best score for maximizing player:', bestScore);

// Performance comparison:
// Minimax: Explores all ~b^d nodes (b=branching factor, d=depth)
// Alpha-Beta: Explores ~b^(d/2) nodes in best case (50% reduction!)
// In practice: Usually 25-40% reduction in nodes explored`}
                    </pre>
                  </ScrollArea>
                  
                  <div className="mt-4 space-y-3">
                    <h4 className="font-medium text-sm">🚀 Key Benefits of Alpha-Beta Pruning:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground bg-gradient-to-br from-emerald-50 to-green-50 p-3 rounded border border-emerald-200">
                        <li><strong>Efficiency:</strong> Reduces search space by up to 50% in optimal conditions</li>
                        <li><strong>Optimal:</strong> Always finds the same result as minimax but faster</li>
                      </ul>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded border border-blue-200">
                        <li><strong>Memory:</strong> Uses same memory as standard minimax algorithm</li>
                        <li><strong>Practical:</strong> Essential for game AI with large search spaces</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mt-4 border border-green-200">
                    <h4 className="font-medium text-sm text-green-800 mb-2">🎮 Real-world Applications:</h4>
                    <p className="text-sm text-green-700">
                      <strong>Game AI:</strong> Chess engines (Deep Blue, Stockfish), checkers, tic-tac-toe, Go engines<br/>
                      <strong>Decision Trees:</strong> Machine learning optimization, business decision analysis<br/>
                      <strong>Adversarial Search:</strong> Any two-player zero-sum game or competitive scenario
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-sm text-yellow-800 mb-2">⚡ Performance Tips:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• <strong>Move ordering:</strong> Evaluate best moves first for maximum pruning</li>
                      <li>• <strong>Iterative deepening:</strong> Use previous search results to improve ordering</li>
                      <li>• <strong>Transposition tables:</strong> Cache results to avoid re-evaluating same positions</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Real-World Applications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-social-primary/5 to-social-secondary/5 border-social-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Friend Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Social media platforms use BFS to suggest people you might know based on mutual connections.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Network Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  BFS helps analyze the structure of social networks and identify communities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Content Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Finding relevant content based on your network's interests and activity.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Shortest Path Problems</h3>
                <p className="text-sm text-muted-foreground">
                  Finding the shortest path between two users in a network (degrees of separation).
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Try It Yourself</h2>
          <p className="text-muted-foreground mb-6">
            Explore the NodeMingle app to see BFS in action. Search for users, view the network graph, and discover potential connections.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button size="lg" className="bg-social-primary hover:bg-social-secondary">
                <BookOpen className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </Link>
            <Link to="/graph">
              <Button variant="outline" size="lg">
                <BarChart className="mr-2 h-4 w-4" />
                View Network Graph
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
