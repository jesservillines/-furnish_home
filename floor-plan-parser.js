// Floor Plan Parser - Extracts room dimensions and features from floor plans
class FloorPlanParser {
    constructor() {
        this.rooms = [];
        this.scale = 1; // pixels per inch
        this.customLayouts = JSON.parse(localStorage.getItem('customLayouts') || '{}');
    }
    
    // Parse dimensions from text (e.g., "17'3" x 12'8"")
    parseDimension(dimText) {
        const regex = /(\d+)'(\d+)"\s*x\s*(\d+)'(\d+)"/;
        const match = dimText.match(regex);
        
        if (match) {
            const width = parseInt(match[1]) * 12 + parseInt(match[2]);
            const height = parseInt(match[3]) * 12 + parseInt(match[4]);
            return { width, height };
        }
        
        return null;
    }
    
    // Convert feet and inches to total inches
    feetInchesToInches(feet, inches) {
        return feet * 12 + inches;
    }
    
    // Hardcoded room data based on the floor plans shown
    getHardcodedRooms() {
        return [
            // Floor 1 (Lower / Garden Level)
            {
                id: 'sitting-north-floor1',
                name: 'Sitting Room (north)',
                floor: 1,
                dimensions: { width: 141, depth: 190 }, // 11'9" × 15'10"
                position: { x: 0, y: 0 },
                features: {
                    doors: [{ type: 'standard', position: 'bottom' }],
                    windows: [{ position: { x: 70, y: 0 }, width: 36 }],
                    stairs: { position: { x: 100, y: 150 }, direction: 'up' }
                }
            },
            {
                id: 'bath-floor1',
                name: 'Bath',
                floor: 1,
                dimensions: { width: 63, depth: 77 }, // 5'3" × 6'5"
                position: { x: 141, y: 0 },
                features: {
                    doors: [{ type: 'standard', position: 'left' }],
                    windows: [],
                    fixtures: ['toilet', 'sink', 'shower']
                }
            },
            {
                id: 'utility-floor1',
                name: 'Utility',
                floor: 1,
                dimensions: { width: 74, depth: 103 }, // 6'2" × 8'7"
                position: { x: 204, y: 0 },
                features: {
                    doors: [{ type: 'standard', position: 'bottom' }],
                    windows: []
                }
            },
            {
                id: 'laundry-floor1',
                name: 'Laundry',
                floor: 1,
                dimensions: { width: 32, depth: 62 }, // 2'8" × 5'2"
                position: { x: 141, y: 77 },
                features: {
                    doors: [{ type: 'standard', position: 'bottom' }],
                    windows: [],
                    fixtures: ['washer', 'dryer']
                }
            },
            {
                id: 'sitting-south-floor1',
                name: 'Sitting Room (south)',
                floor: 1,
                dimensions: { width: 207, depth: 141 }, // 17'3" × 11'9"
                position: { x: 0, y: 190 },
                features: {
                    doors: [{ type: 'standard', position: 'top' }],
                    windows: [
                        { position: { x: 50, y: 141 }, width: 48 },
                        { position: { x: 150, y: 141 }, width: 48 }
                    ],
                    stairs: null
                }
            },
            
            // Floor 2 (Main / Entry Level)
            {
                id: 'living-floor2',
                name: 'Living Room',
                floor: 2,
                dimensions: { width: 207, depth: 152 }, // 17'3" × 12'8"
                position: { x: 0, y: 0 },
                features: {
                    doors: [
                        { type: 'sliding', position: { x: 50, y: 0 }, width: 72 }
                    ],
                    windows: [
                        { position: { x: 175, y: 0 }, width: 30 }
                    ],
                    stairs: null
                }
            },
            {
                id: 'kitchen-floor2',
                name: 'Kitchen',
                floor: 2,
                dimensions: { width: 131, depth: 152 }, // 10'11" × 12'8"
                position: { x: 207, y: 0 },
                features: {
                    doors: [],
                    windows: [{ position: { x: 65, y: 152 }, width: 36 }],
                    fixtures: ['stove', 'sink', 'refrigerator', 'dishwasher']
                }
            },
            {
                id: 'foyer-floor2',
                name: 'Foyer / Stair Landing',
                floor: 2,
                dimensions: { width: 72, depth: 156 }, // 6'0" × 13'0"
                position: { x: 338, y: 0 },
                features: {
                    doors: [
                        { type: 'standard', position: { x: 72, y: 78 }, isExterior: true }
                    ],
                    windows: [],
                    stairs: { position: { x: 36, y: 78 }, direction: 'up' }
                }
            },
            
            // Floor 3 (Upper)
            {
                id: 'primary-bedroom-floor3',
                name: 'Primary Bedroom',
                floor: 3,
                dimensions: { width: 207, depth: 122 }, // 17'3" × 10'2"
                position: { x: 0, y: 0 },
                features: {
                    doors: [{ type: 'standard', position: 'right' }],
                    windows: [
                        { position: { x: 50, y: 0 }, width: 48 },
                        { position: { x: 150, y: 0 }, width: 48 }
                    ]
                }
            },
            {
                id: 'bedroom2-floor3',
                name: 'Bedroom 2',
                floor: 3,
                dimensions: { width: 170, depth: 113 }, // 14'2" × 9'5"
                position: { x: 0, y: 122 },
                features: {
                    doors: [{ type: 'standard', position: 'top' }],
                    windows: [{ position: { x: 85, y: 113 }, width: 48 }]
                }
            },
            {
                id: 'bath-floor3',
                name: 'Bath',
                floor: 3,
                dimensions: { width: 58, depth: 112 }, // 4'10" × 9'4"
                position: { x: 207, y: 0 },
                features: {
                    doors: [{ type: 'standard', position: 'bottom' }],
                    windows: [],
                    fixtures: ['toilet', 'sink', 'bathtub']
                }
            },
            {
                id: 'hall-floor3',
                name: 'Hall / Landing',
                floor: 3,
                dimensions: { width: 111, depth: 36 }, // 9'3" × ~3'0"
                position: { x: 170, y: 122 },
                features: {
                    doors: [],
                    windows: [],
                    stairs: { position: { x: 55, y: 18 }, direction: 'down' }
                }
            }
        ];
    }
    
    // Get all rooms
    getAllRooms() {
        return this.getHardcodedRooms();
    }
    
    // Get rooms by floor
    getRoomsByFloor(floor) {
        return this.getHardcodedRooms().filter(room => room.floor === floor);
    }
    
    saveCustomLayout(roomId, layoutData) {
        if (!this.customLayouts[roomId]) {
            this.customLayouts[roomId] = {};
        }
        this.customLayouts[roomId] = { ...this.customLayouts[roomId], ...layoutData };
        localStorage.setItem('customLayouts', JSON.stringify(this.customLayouts));
    }
    
    // Load custom room layouts from localStorage
    loadCustomLayouts() {
        const saved = localStorage.getItem('customLayouts');
        return saved ? JSON.parse(saved) : {};
    }
    
    // Update room features (windows, doors, stairs)
    updateRoomFeatures(roomId, features) {
        if (!this.customLayouts[roomId]) {
            this.customLayouts[roomId] = {};
        }
        this.customLayouts[roomId].features = features;
        this.saveCustomLayout(roomId, this.customLayouts[roomId]);
    }
    
    // Get room by ID
    getRoomById(roomId) {
        const rooms = this.getHardcodedRooms();
        const room = rooms.find(room => room.id === roomId);
        
        if (room) {
            // Apply custom features and dimensions if they exist
            if (this.customLayouts[roomId]) {
                if (this.customLayouts[roomId].features) {
                    room.features = { ...room.features, ...this.customLayouts[roomId].features };
                }
                if (this.customLayouts[roomId].dimensions) {
                    room.dimensions = { ...room.dimensions, ...this.customLayouts[roomId].dimensions };
                }
            }
        }
        
        return room;
    }
    
    // Calculate usable space considering doors, windows, and fixtures
    calculateUsableSpace(room) {
        const totalArea = room.dimensions.width * room.dimensions.depth;
        let unusableArea = 0;
        
        // Account for door swing space (30" arc)
        room.features.doors.forEach(door => {
            if (door.type === 'standard') {
                unusableArea += 30 * 30; // 30" swing radius
            }
        });
        
        // Account for window space (24" clearance)
        room.features.windows.forEach(window => {
            unusableArea += window.width * 24;
        });
        
        // Account for fixtures
        if (room.features.fixtures) {
            room.features.fixtures.forEach(fixture => {
                switch (fixture) {
                    case 'toilet': unusableArea += 30 * 24; break;
                    case 'sink': unusableArea += 24 * 20; break;
                    case 'shower': unusableArea += 36 * 36; break;
                    case 'tub': unusableArea += 60 * 30; break;
                    case 'refrigerator': unusableArea += 36 * 30; break;
                    case 'stove': unusableArea += 30 * 24; break;
                    case 'washer': unusableArea += 27 * 27; break;
                    case 'dryer': unusableArea += 27 * 27; break;
                }
            });
        }
        
        // Account for traffic paths (36" minimum)
        const pathArea = Math.min(room.dimensions.width, room.dimensions.depth) * 36;
        unusableArea += pathArea;
        
        return {
            total: totalArea,
            usable: totalArea - unusableArea,
            unusableArea: unusableArea
        };
    }
    
    // Get wall segments for furniture placement
    getWallSegments(room) {
        const segments = [];
        const { width, depth } = room.dimensions;
        
        // North wall
        let northSegments = [{ start: 0, end: width, obstructed: false }];
        room.features.windows.forEach(window => {
            if (window.position.includes('top')) {
                northSegments = this.splitSegment(northSegments, window);
            }
        });
        
        // East wall
        let eastSegments = [{ start: 0, end: depth, obstructed: false }];
        room.features.windows.forEach(window => {
            if (window.position.includes('right')) {
                eastSegments = this.splitSegment(eastSegments, window);
            }
        });
        
        // South wall
        let southSegments = [{ start: 0, end: width, obstructed: false }];
        room.features.windows.forEach(window => {
            if (window.position.includes('bottom')) {
                southSegments = this.splitSegment(southSegments, window);
            }
        });
        room.features.doors.forEach(door => {
            if (door.position === 'bottom') {
                southSegments = this.splitSegment(southSegments, door);
            }
        });
        
        // West wall
        let westSegments = [{ start: 0, end: depth, obstructed: false }];
        room.features.doors.forEach(door => {
            if (door.position === 'left') {
                westSegments = this.splitSegment(westSegments, door);
            }
        });
        
        return {
            north: northSegments,
            east: eastSegments,
            south: southSegments,
            west: westSegments
        };
    }
    
    // Split wall segment by obstruction
    splitSegment(segments, obstruction) {
        // Simplified implementation
        return segments;
    }
}

// Export for use in other modules
const floorPlanParser = new FloorPlanParser();
