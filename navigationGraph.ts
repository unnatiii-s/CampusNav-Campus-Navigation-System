export type NodeType = 'hallway' | 'room' | 'entrance' | 'stairs' | 'elevator' | 'outdoor';

export interface NavNode {
    id: string;
    name: string;
    type: NodeType;
    description: string;
    coordinates?: { x: number; y: number }; // Percentage 0-100
    connections: { nodeId: string; direction: string; distance: number }[];
}

// Graph based on provided Campus Map Image
export const CAMPUS_GRAPH: Record<string, NavNode> = {
    'main gate': {
        id: 'main gate',
        name: 'Main Gate',
        type: 'entrance',
        description: 'Main entrance to the campus.',
        coordinates: { x: 70, y: 90 },
        connections: [
            { nodeId: 'admin block', direction: 'straight', distance: 100 },
            { nodeId: 'parking', direction: 'right', distance: 20 },
            { nodeId: 'cricket ground', direction: 'left', distance: 50 }
        ]
    },
    'parking': {
        id: 'parking', name: 'Parking', type: 'outdoor', description: 'Vehicle Parking',
        coordinates: { x: 75, y: 75 },
        connections: [{ nodeId: 'main gate', direction: 'left', distance: 20 }]
    },
    'cricket ground': {
        id: 'cricket ground', name: 'Cricket Ground', type: 'outdoor', description: 'Cricket Ground',
        coordinates: { x: 30, y: 75 },
        connections: [{ nodeId: 'main gate', direction: 'right', distance: 50 }]
    },

    // Administrative Area
    'admin block': {
        id: 'admin block',
        name: 'Admin Block',
        type: 'room',
        description: 'Administrative building.',
        coordinates: { x: 60, y: 35 },
        connections: [
            { nodeId: 'main gate', direction: 'straight', distance: 100 },
            { nodeId: 'library', direction: 'right', distance: 30 },
            { nodeId: 'faculty block 1', direction: 'left', distance: 30 },
            { nodeId: 'lab block', direction: 'back', distance: 40 },
            { nodeId: 'auditorium', direction: 'front', distance: 20 }
        ]
    },
    'library': {
        id: 'library',
        name: 'Library',
        type: 'room',
        description: 'Central Library.',
        coordinates: { x: 65, y: 50 },
        connections: [
            { nodeId: 'admin block', direction: 'right', distance: 30 },
            { nodeId: 'lab block', direction: 'left', distance: 20 }
        ]
    },
    'lab block': {
        id: 'lab block',
        name: 'Lab Block',
        type: 'room',
        description: 'Science and Computer Labs.',
        coordinates: { x: 55, y: 50 },
        connections: [
            // { nodeId: 'admin block', direction: 'left', distance: 40 }, // Removed to force Fac Block 1 route
            { nodeId: 'library', direction: 'back', distance: 20 },
            { nodeId: 'canteen', direction: 'left', distance: 20 },
            { nodeId: 'faculty block 1', direction: 'back', distance: 10 }
        ]
    },

    // Faculty & Academic
    'faculty block 1': {
        id: 'faculty block 1', name: 'Faculty Block 1', type: 'room', description: 'Faculty Offices',
        coordinates: { x: 55, y: 40 },
        connections: [
            { nodeId: 'admin block', direction: 'right', distance: 10 },
            { nodeId: 'faculty block 2', direction: 'straight', distance: 20 },
            { nodeId: 'fr', direction: 'left', distance: 40 },
            { nodeId: 'auditorium', direction: 'left', distance: 15 },
            { nodeId: 'lab block', direction: 'straight', distance: 10 }
        ]
    },
    'faculty block 2': {
        id: 'faculty block 2', name: 'Faculty Block 2', type: 'room', description: 'Faculty Offices',
        coordinates: { x: 55, y: 28 },
        connections: [
            { nodeId: 'faculty block 1', direction: 'back', distance: 20 },
            { nodeId: 'ncr', direction: 'straight', distance: 30 }
        ]
    },
    'fr': {
        id: 'fr', name: 'FR Block', type: 'room', description: 'Faculty Residences',
        coordinates: { x: 10, y: 40 },
        connections: [{ nodeId: 'faculty block 1', direction: 'right', distance: 40 }]
    },

    // Classes
    'ncr': {
        id: 'ncr', name: 'NCR Block', type: 'room', description: 'New Class Rooms',
        coordinates: { x: 50, y: 15 },
        connections: [
            { nodeId: 'faculty block 2', direction: 'back', distance: 30 },
            { nodeId: 'cr', direction: 'right', distance: 20 },
            { nodeId: 'basketball court', direction: 'left', distance: 20 }
        ]
    },
    'cr': {
        id: 'cr', name: 'CR Block', type: 'room', description: 'Class Rooms',
        coordinates: { x: 58, y: 15 },
        connections: [{ nodeId: 'ncr', direction: 'left', distance: 20 }]
    },
    'basketball court': {
        id: 'basketball court', name: 'Basketball Court', type: 'outdoor', description: 'Outdoor Court',
        coordinates: { x: 45, y: 15 },
        connections: [{ nodeId: 'ncr', direction: 'right', distance: 20 }]
    },

    // Student Hub
    'canteen': {
        id: 'canteen',
        name: 'Canteen',
        type: 'room',
        description: 'Food and refreshments.',
        coordinates: { x: 45, y: 55 },
        connections: [
            { nodeId: 'lab block', direction: 'right', distance: 20 },
            { nodeId: 'dining hall', direction: 'left', distance: 20 },
            { nodeId: 'gh1', direction: 'left', distance: 40 },
            { nodeId: 'bh1', direction: 'back', distance: 50 },
            { nodeId: 'auditorium', direction: 'straight', distance: 100 }
        ]
    },
    'dining hall': {
        id: 'dining hall',
        name: 'Dining Hall',
        type: 'room',
        description: 'Mess hall for students.',
        coordinates: { x: 40, y: 55 },
        connections: [
            { nodeId: 'canteen', direction: 'right', distance: 20 },
            { nodeId: 'gh1', direction: 'left', distance: 50 },
            { nodeId: 'bh1', direction: 'straight', distance: 60 }
        ]
    },

    // Hostels - Boys
    'bh1': {
        id: 'bh1', name: 'Boys Hostel 1', type: 'room', description: 'BH1',
        coordinates: { x: 35, y: 25 },
        connections: [
            { nodeId: 'bh2', direction: 'right', distance: 20 },
            { nodeId: 'dining hall', direction: 'back', distance: 60 },
            { nodeId: 'football ground', direction: 'left', distance: 40 }
        ]
    },
    'bh2': {
        id: 'bh2', name: 'Boys Hostel 2', type: 'room', description: 'BH2',
        coordinates: { x: 28, y: 15 },
        connections: [
            { nodeId: 'bh1', direction: 'left', distance: 20 },
            { nodeId: 'bh3', direction: 'straight', distance: 20 }
        ]
    },
    'bh3': {
        id: 'bh3', name: 'Boys Hostel 3', type: 'room', description: 'BH3',
        coordinates: { x: 20, y: 20 },
        connections: [
            { nodeId: 'bh2', direction: 'back', distance: 20 },
            { nodeId: 'bh4', direction: 'straight', distance: 20 }
        ]
    },
    'bh4': {
        id: 'bh4', name: 'Boys Hostel 4', type: 'room', description: 'BH4',
        coordinates: { x: 90, y: 35 },
        connections: [
            { nodeId: 'bh3', direction: 'back', distance: 20 },
            { nodeId: 'bh5', direction: 'right', distance: 20 }
        ]
    },
    'bh5': {
        id: 'bh5', name: 'Boys Hostel 5', type: 'room', description: 'BH5',
        coordinates: { x: 90, y: 20 },
        connections: [
            { nodeId: 'bh4', direction: 'left', distance: 20 },
            { nodeId: 'ncc ground', direction: 'straight', distance: 40 }
        ]
    },

    // Hostels - Girls
    'gh1': {
        id: 'gh1', name: 'Girls Hostel 1', type: 'room', description: 'GH1',
        coordinates: { x: 32, y: 53 },
        connections: [
            { nodeId: 'dining hall', direction: 'right', distance: 50 },
            { nodeId: 'gh2', direction: 'straight', distance: 20 }
        ]
    },
    'gh2': {
        id: 'gh2', name: 'Girls Hostel 2', type: 'room', description: 'GH2',
        coordinates: { x: 28, y: 53 },
        connections: [
            { nodeId: 'gh1', direction: 'back', distance: 20 },
            { nodeId: 'gh3', direction: 'straight', distance: 20 }
        ]
    },
    'gh3': {
        id: 'gh3', name: 'Girls Hostel 3', type: 'room', description: 'GH3',
        coordinates: { x: 24, y: 53 },
        connections: [
            { nodeId: 'gh2', direction: 'back', distance: 20 }
        ]
    },

    // Sports (Additional)
    'football ground': {
        id: 'football ground', name: 'Football Ground', type: 'outdoor', description: 'Sports ground',
        coordinates: { x: 30, y: 40 },
        connections: [{ nodeId: 'bh1', direction: 'right', distance: 40 }]
    },
    'ncc ground': {
        id: 'ncc ground', name: 'NCC Ground', type: 'outdoor', description: 'NCC Training Ground',
        coordinates: { x: 80, y: 20 },
        connections: [{ nodeId: 'bh5', direction: 'back', distance: 40 }]
    },
    'old canteen': {
        id: 'old canteen', name: 'Old Canteen', type: 'room', description: 'Old Canteen',
        coordinates: { x: 10, y: 60 }, // Estimated
        connections: []
    },
    'auditorium': {
        id: 'auditorium', name: 'Auditorium', type: 'room', description: 'Main Campus Auditorium',
        coordinates: { x: 52, y: 34 },
        connections: [
            { nodeId: 'faculty block 1', direction: 'right', distance: 15 },
            { nodeId: 'admin block', direction: 'back', distance: 20 },
            { nodeId: 'canteen', direction: 'straight', distance: 25 }
        ]
    }
};
