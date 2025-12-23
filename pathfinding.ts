import { CAMPUS_GRAPH, NavNode } from './navigationGraph';

export interface RouteStep {
    nodeId: string;
    instruction: string; // Instruction to reach this node from previous
}

export function findPath(startId: string, endId: string): RouteStep[] | null {
    if (startId === endId) return [{ nodeId: startId, instruction: 'You are already here.' }];

    const queue: { id: string, path: RouteStep[], totalDist: number }[] = [];
    const visited = new Map<string, number>(); // NodeId -> Shortest dist found so far

    queue.push({ id: startId, path: [{ nodeId: startId, instruction: 'Start' }], totalDist: 0 });

    while (queue.length > 0) {
        // Sort by distance to simulate Priority Queue
        queue.sort((a, b) => a.totalDist - b.totalDist);
        const current = queue.shift()!;

        // Optimization: If we found a shorter way to this node already, skip
        if (visited.has(current.id) && visited.get(current.id)! <= current.totalDist) continue;
        visited.set(current.id, current.totalDist);

        if (current.id === endId) {
            return current.path;
        }

        const currentNode = CAMPUS_GRAPH[current.id];
        if (!currentNode) continue;

        for (const edge of currentNode.connections) {
            const newDist = current.totalDist + edge.distance;
            // Only add if we haven't found a shorter path to neighbor
            if (!visited.has(edge.nodeId) || visited.get(edge.nodeId)! > newDist) {
                let instr = `Go ${edge.direction}`;
                if (edge.direction === 'exit') instr = 'Exit the room';

                queue.push({
                    id: edge.nodeId,
                    path: [...current.path, { nodeId: edge.nodeId, instruction: instr }],
                    totalDist: newDist
                });
            }
        }
    }

    return null; // No path found
}
