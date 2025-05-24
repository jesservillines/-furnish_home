// Layout Engine - Manages furniture placement and pre-designed layouts
class LayoutEngine {
    constructor() {
        this.currentLayout = [];
        this.gridSize = 6; // 6-inch grid for snapping
        this.furnitureIdCounter = 1;
        this.nextZIndex = 1;
    }
    
    // Pre-designed layouts for living room (17'3" x 12'8")
    getPresetLayouts() {
        return {
            'modern-living': {
                name: 'Modern Living Room',
                description: 'Clean lines with focus on conversation',
                furniture: [
                    {
                        itemId: 'cb-lounge-sofa',
                        position: { x: 36, y: 36 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-yukon-coffee',
                        position: { x: 60, y: 84 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-blake-chair',
                        position: { x: 156, y: 48 },
                        rotation: 270
                    },
                    {
                        itemId: 'cb-miles-chair',
                        position: { x: 156, y: 96 },
                        rotation: 270
                    },
                    {
                        itemId: 'cb-media-console',
                        position: { x: 24, y: 120 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-rug-alvarez',
                        position: { x: 48, y: 24 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-span-side',
                        position: { x: 36, y: 48 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-span-side',
                        position: { x: 144, y: 48 },
                        rotation: 0
                    }
                ]
            },
            'cozy-traditional': {
                name: 'Cozy Traditional',
                description: 'Warm and inviting with classic arrangement',
                furniture: [
                    {
                        itemId: 'cb-willow-sofa',
                        position: { x: 48, y: 36 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-parsons-coffee',
                        position: { x: 72, y: 84 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-cooper-chair',
                        position: { x: 36, y: 96 },
                        rotation: 45
                    },
                    {
                        itemId: 'cb-cooper-chair',
                        position: { x: 144, y: 96 },
                        rotation: 315
                    },
                    {
                        itemId: 'cb-credenza',
                        position: { x: 144, y: 24 },
                        rotation: 90
                    },
                    {
                        itemId: 'cb-rug-savoy',
                        position: { x: 48, y: 24 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-lamp-marino',
                        position: { x: 168, y: 36 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-floor-lamp',
                        position: { x: 36, y: 120 },
                        rotation: 0
                    }
                ]
            },
            'minimalist': {
                name: 'Minimalist Design',
                description: 'Simple, clean with essential pieces only',
                furniture: [
                    {
                        itemId: 'cb-gather-sofa',
                        position: { x: 60, y: 48 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-mill-coffee',
                        position: { x: 84, y: 96 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-media-console',
                        position: { x: 48, y: 132 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-rug-quinn',
                        position: { x: 60, y: 36 },
                        rotation: 0
                    }
                ]
            },
            'entertainment': {
                name: 'Entertainment Focus',
                description: 'Optimized for TV viewing and gatherings',
                furniture: [
                    {
                        itemId: 'wc-sectional',
                        position: { x: 36, y: 36 },
                        rotation: 0
                    },
                    {
                        itemId: 'rh-ottoman',
                        position: { x: 96, y: 84 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-media-console',
                        position: { x: 156, y: 36 },
                        rotation: 90
                    },
                    {
                        itemId: 'cb-span-side',
                        position: { x: 36, y: 60 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-span-side',
                        position: { x: 132, y: 36 },
                        rotation: 0
                    },
                    {
                        itemId: 'cb-rug-alvarez',
                        position: { x: 36, y: 24 },
                        rotation: 0
                    }
                ]
            }
        };
    }
    
    // Place furniture in room
    placeFurniture(room, furniture, position, rotation = 0) {
        const placement = {
            ...furniture,
            position: this.snapToGrid(position),
            rotation: rotation
        };
        
        // Check if placement is valid
        if (this.isValidPlacement(room, placement)) {
            this.currentLayout.push(placement);
            return true;
        }
        
        return false;
    }
    
    // Snap position to grid
    snapToGrid(position) {
        return {
            x: Math.round(position.x / this.gridSize) * this.gridSize,
            y: Math.round(position.y / this.gridSize) * this.gridSize
        };
    }
    
    // Check if furniture placement is valid
    isValidPlacement(room, furniture) {
        const { width, depth } = furniture.dimensions;
        const { x, y } = furniture.position;
        const rotation = furniture.rotation || 0;
        
        // Calculate rotated dimensions
        const rotatedWidth = rotation % 180 === 0 ? width : depth;
        const rotatedDepth = rotation % 180 === 0 ? depth : width;
        
        // Check room boundaries
        if (x < 0 || y < 0 || 
            x + rotatedWidth > room.dimensions.width || 
            y + rotatedDepth > room.dimensions.depth) {
            return false;
        }
        
        // Check for overlaps with existing furniture
        for (const existing of this.currentLayout) {
            if (this.checkOverlap(furniture, existing)) {
                return false;
            }
        }
        
        // Check clearance from walls (minimum 18 inches for walkways)
        const wallClearance = 18;
        const features = room.features;
        
        // Check door clearances
        for (const door of features.doors) {
            if (door.type === 'sliding-glass' && door.position === 'left') {
                // Ensure clear path to sliding door
                if (x < 96 && y + rotatedDepth > room.dimensions.depth - 36) {
                    return false;
                }
            }
        }
        
        // Check window clearances
        for (const window of features.windows || []) {
            // Ensure furniture doesn't block windows
            if (window.position.includes('top') && y < 24) {
                return false;
            }
        }
        
        return true;
    }
    
    // Check overlap between two furniture pieces
    checkOverlap(furniture1, furniture2) {
        const buffer = 18; // Minimum spacing between furniture
        
        const f1 = this.getFurnitureBounds(furniture1);
        const f2 = this.getFurnitureBounds(furniture2);
        
        return !(f1.right + buffer < f2.left || 
                 f2.right + buffer < f1.left || 
                 f1.bottom + buffer < f2.top || 
                 f2.bottom + buffer < f1.top);
    }
    
    // Get furniture bounds considering rotation
    getFurnitureBounds(furniture) {
        const { x, y } = furniture.position;
        const { width, depth } = furniture.dimensions;
        const rotation = furniture.rotation || 0;
        
        const rotatedWidth = rotation % 180 === 0 ? width : depth;
        const rotatedDepth = rotation % 180 === 0 ? depth : width;
        
        return {
            left: x,
            top: y,
            right: x + rotatedWidth,
            bottom: y + rotatedDepth
        };
    }
    
    // Apply preset layout
    applyPreset(room, presetId) {
        const preset = this.getPresetLayouts()[presetId];
        if (!preset) return;
        
        this.currentLayout = [];
        
        preset.furniture.forEach(item => {
            const furniture = this.findFurnitureById(item.itemId);
            if (furniture) {
                this.addFurniture({
                    ...furniture,
                    id: Date.now() + Math.random(), // Unique instance ID
                    x: item.position.x,
                    y: item.position.y,
                    rotation: item.rotation || 0,
                    width: furniture.dimensions.width,
                    depth: furniture.dimensions.depth,
                    height: furniture.dimensions.height
                });
            }
        });
    }
    
    findFurnitureById(itemId) {
        // Search through all furniture categories
        for (const category in furnitureDatabase) {
            const found = furnitureDatabase[category].find(f => f.id === itemId);
            if (found) return found;
        }
        
        // Check additional furniture
        const additional = furnitureDatabase.additionalFurniture?.find(f => f.id === itemId);
        if (additional) return additional;
        
        return null;
    }
    
    addFurniture(furnitureData) {
        const newFurniture = {
            ...furnitureData,
            layoutId: `furniture-${this.furnitureIdCounter++}`,
            x: furnitureData.x || 0,
            y: furnitureData.y || 0,
            rotation: furnitureData.rotation || 0,
            zIndex: furnitureData.zIndex || this.nextZIndex++,
            opacity: furnitureData.opacity || (furnitureData.category === 'rugs' ? 0.7 : 1.0)
        };
        
        this.currentLayout.push(newFurniture);
        this.sortByZIndex();
        return newFurniture;
    }
    
    getLayout() {
        return this.currentLayout;
    }
    
    clearLayout() {
        this.currentLayout = [];
    }
    
    removeFurniture(layoutId) {
        this.currentLayout = this.currentLayout.filter(f => f.layoutId !== layoutId);
    }
    
    updateFurniturePosition(layoutId, x, y) {
        const furniture = this.currentLayout.find(f => f.layoutId === layoutId);
        if (furniture) {
            furniture.x = x;
            furniture.y = y;
        }
    }
    
    updateFurnitureRotation(layoutId, rotation) {
        const furniture = this.currentLayout.find(f => f.layoutId === layoutId);
        if (furniture) {
            furniture.rotation = rotation;
        }
    }
    
    getFurnitureAt(x, y) {
        // Check from top to bottom (reverse order for top-most first)
        for (let i = this.currentLayout.length - 1; i >= 0; i--) {
            const furniture = this.currentLayout[i];
            const bounds = this.getFurnitureBounds(furniture);
            
            if (x >= bounds.left && x <= bounds.right &&
                y >= bounds.top && y <= bounds.bottom) {
                return furniture;
            }
        }
        return null;
    }
    
    getFurnitureBounds(furniture) {
        const rotation = furniture.rotation || 0;
        const width = furniture.width || furniture.dimensions?.width || 0;
        const depth = furniture.depth || furniture.dimensions?.depth || 0;
        
        // Swap dimensions if rotated 90 or 270 degrees
        const rotatedWidth = rotation % 180 === 0 ? width : depth;
        const rotatedDepth = rotation % 180 === 0 ? depth : width;
        
        return {
            left: furniture.x,
            top: furniture.y,
            right: furniture.x + rotatedWidth,
            bottom: furniture.y + rotatedDepth
        };
    }
    
    checkClearances(furniture, room) {
        const bounds = this.getFurnitureBounds(furniture);
        const features = room.features;
        
        // Check door clearances
        for (const door of features.doors) {
            const doorClearance = 36; // 3 feet clearance for doors
            
            if (door.position.x < doorClearance && bounds.left < doorClearance) {
                return false;
            }
            if (door.position.y < doorClearance && bounds.top < doorClearance) {
                return false;
            }
        }
        
        // Check window clearances
        for (const window of features.windows) {
            const windowClearance = 24; // 2 feet from windows
            
            if (window.position.y === 0 && bounds.top < windowClearance) {
                return false;
            }
        }
        
        return true;
    }
    
    calculateLayoutScore(room) {
        let score = 100;
        
        // Penalize for blocked pathways
        const pathways = this.checkPathways(room);
        if (!pathways.toSliding) score -= 20;
        if (!pathways.toKitchen) score -= 15;
        if (!pathways.toStairs) score -= 15;
        
        // Reward for good furniture spacing
        const avgSpacing = this.calculateAverageSpacing();
        if (avgSpacing > 36) score += 10;
        if (avgSpacing < 24) score -= 10;
        
        // Reward for focal point alignment
        if (this.checkFocalPointAlignment(room)) score += 15;
        
        // Penalize for furniture blocking windows
        if (this.checkWindowBlockage(room)) score -= 20;
        
        return Math.max(0, Math.min(100, score));
    }
    
    checkPathways(room) {
        // Simplified pathway checking
        return {
            toSliding: true,
            toKitchen: true,
            toStairs: true
        };
    }
    
    calculateAverageSpacing() {
        if (this.currentLayout.length < 2) return 100;
        
        let totalDistance = 0;
        let count = 0;
        
        for (let i = 0; i < this.currentLayout.length - 1; i++) {
            for (let j = i + 1; j < this.currentLayout.length; j++) {
                const f1 = this.getFurnitureBounds(this.currentLayout[i]);
                const f2 = this.getFurnitureBounds(this.currentLayout[j]);
                
                const distance = Math.min(
                    Math.abs(f1.right - f2.left),
                    Math.abs(f2.right - f1.left),
                    Math.abs(f1.bottom - f2.top),
                    Math.abs(f2.bottom - f1.top)
                );
                
                totalDistance += distance;
                count++;
            }
        }
        
        return totalDistance / count;
    }
    
    checkFocalPointAlignment(room) {
        // Check if seating is oriented toward TV/media console
        const mediaConsole = this.currentLayout.find(f => f.id && f.id.includes('media-console'));
        const seating = this.currentLayout.filter(f => f.id && (f.id.includes('sofa') || f.id.includes('chair')));
        
        if (!mediaConsole || seating.length === 0) return false;
        
        // Simplified check - at least one seat faces media
        return true;
    }
    
    checkWindowBlockage(room) {
        const windows = room.features.windows || [];
        
        for (const window of windows) {
            for (const furniture of this.currentLayout) {
                const bounds = this.getFurnitureBounds(furniture);
                
                // Check if furniture is too tall and blocks window
                if (furniture.dimensions.height > 36) {
                    if (window.position.includes('top') && bounds.top < 36) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // Apply preset layout with success feedback
    applyPresetLayout(presetId, roomId) {
        const preset = this.getPresetLayouts()[presetId];
        if (!preset) {
            return { success: false, error: 'Preset not found' };
        }
        
        // Clear current layout
        this.currentLayout = [];
        
        // Add each furniture piece from the preset
        let addedCount = 0;
        preset.furniture.forEach(item => {
            const furniture = this.findFurnitureById(item.itemId);
            if (furniture) {
                this.addFurniture({
                    ...furniture,
                    width: furniture.dimensions.width,
                    depth: furniture.dimensions.depth,
                    x: item.position.x,
                    y: item.position.y,
                    rotation: item.rotation || 0
                });
                addedCount++;
            }
        });
        
        return { 
            success: true, 
            layoutName: preset.name,
            furnitureCount: addedCount 
        };
    }
    
    // Sort furniture by z-index for proper rendering order
    sortByZIndex() {
        this.currentLayout.sort((a, b) => a.zIndex - b.zIndex);
    }
    
    // Send furniture to back (lowest z-index)
    sendToBack(layoutId) {
        const furniture = this.currentLayout.find(f => f.layoutId === layoutId);
        if (furniture) {
            const minZIndex = Math.min(...this.currentLayout.map(f => f.zIndex));
            furniture.zIndex = minZIndex - 1;
            this.sortByZIndex();
        }
    }
    
    // Bring furniture to front (highest z-index)
    bringToFront(layoutId) {
        const furniture = this.currentLayout.find(f => f.layoutId === layoutId);
        if (furniture) {
            const maxZIndex = Math.max(...this.currentLayout.map(f => f.zIndex));
            furniture.zIndex = maxZIndex + 1;
            this.sortByZIndex();
        }
    }
    
    // Update furniture opacity
    updateFurnitureOpacity(layoutId, opacity) {
        const furniture = this.currentLayout.find(f => f.layoutId === layoutId);
        if (furniture) {
            furniture.opacity = Math.max(0.1, Math.min(1.0, opacity));
        }
    }
}

// Export for use
const layoutEngine = new LayoutEngine();
