
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, ArrowRight, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

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
              
              <div className="bg-social-light p-4 rounded-lg mb-4">
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
              
              <div className="flex justify-center my-6">
                <div className="relative w-full max-w-md h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  {/* Simplified BFS visualization */}
                  <div className="absolute w-10 h-10 rounded-full bg-social-primary text-white flex items-center justify-center top-4 left-1/2 transform -translate-x-1/2">
                    A
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-secondary text-white flex items-center justify-center top-20 left-1/4 transform -translate-x-1/2">
                    B
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-secondary text-white flex items-center justify-center top-20 left-3/4 transform -translate-x-1/2">
                    C
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-tertiary text-white flex items-center justify-center bottom-4 left-1/6 transform -translate-x-1/2">
                    D
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-tertiary text-white flex items-center justify-center bottom-4 left-1/3 transform -translate-x-1/2">
                    E
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-tertiary text-white flex items-center justify-center bottom-4 left-2/3 transform -translate-x-1/2">
                    F
                  </div>
                  
                  <div className="absolute w-10 h-10 rounded-full bg-social-tertiary text-white flex items-center justify-center bottom-4 left-5/6 transform -translate-x-1/2">
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
                  
                  <div className="absolute right-2 top-2 text-xs text-muted-foreground">
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
            
            <div className="md:w-1/2 bg-gray-50 p-4 rounded-lg">
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
                <TabsList className="mb-4">
                  <TabsTrigger value="bfs">BFS Algorithm</TabsTrigger>
                  <TabsTrigger value="dfs">BFS vs DFS</TabsTrigger>
                </TabsList>
                <TabsContent value="bfs">
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
                <TabsContent value="dfs">
                  <h3 className="font-medium mb-2">BFS vs DFS Comparison</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Breadth-First Search (BFS)</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Uses a queue (FIFO)</li>
                        <li>Explores level by level</li>
                        <li>Finds shortest paths</li>
                        <li>Better for finding nearby nodes</li>
                        <li>Uses more memory (stores all nodes at current level)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Depth-First Search (DFS)</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Uses a stack (LIFO)</li>
                        <li>Explores as far as possible along a branch</li>
                        <li>Doesn't guarantee shortest path</li>
                        <li>Better for maze solving and exhaustive searches</li>
                        <li>Uses less memory (stores only the current path)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>When to use BFS:</strong> Finding shortest paths, level-ordered traversal, finding nodes closest to starting point
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>When to use DFS:</strong> Exploring all possible paths, maze solving, detecting cycles
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Real-World Applications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Friend Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Social media platforms use BFS to suggest people you might know based on mutual connections.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Network Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  BFS helps analyze the structure of social networks and identify communities.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Content Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Finding relevant content based on your network's interests and activity.
                </p>
              </CardContent>
            </Card>
            
            <Card>
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
            Explore the Friend Finder app to see BFS in action. Search for users, view the network graph, and discover potential connections.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button size="lg" className="bg-social-primary hover:bg-social-tertiary">
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
