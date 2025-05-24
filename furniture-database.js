// Crate & Barrel Furniture Database with exact dimensions
const furnitureDatabase = {
    sofas: [
        {
            id: 'cb-lounge',
            name: 'Lounge 93" Regular Sofa',
            brand: 'Crate & Barrel',
            dimensions: { width: 93, depth: 41, height: 25 },
            price: 2399,
            material: 'Polyester',
            color: 'Various',
            style: 'Contemporary',
            features: ['Deep Seating', 'Feather-Down Cushions'],
            image: 'lounge-sofa.jpg'
        },
        {
            id: 'cb-gather',
            name: 'Gather 89" Sofa',
            brand: 'Crate & Barrel',
            dimensions: { width: 89, depth: 38, height: 32 },
            price: 2499,
            material: 'Performance Fabric',
            color: 'Various',
            style: 'Modern',
            features: ['Bench Cushion', 'Clean-lined'],
            image: 'gather-sofa.jpg'
        },
        {
            id: 'cb-axis',
            name: 'Axis II 88" Sofa',
            brand: 'Crate & Barrel',
            dimensions: { width: 88, depth: 43, height: 32 },
            price: 1999,
            material: 'Microfiber',
            color: 'Light Grey',
            style: 'Modern',
            features: ['Track Arms', 'Deep Seating'],
            image: 'axis-sofa.jpg'
        },
        {
            id: 'cb-apartment',
            name: 'Petrie 74" Apartment Sofa',
            brand: 'Crate & Barrel',
            dimensions: { width: 74, depth: 38, height: 35 },
            price: 1899,
            material: 'Velvet',
            color: 'Various',
            style: 'Traditional',
            features: ['Rolled Arms', 'Compact Size'],
            image: 'petrie-apartment-sofa.jpg'
        },
        {
            id: 'cb-sectional',
            name: 'Retreat 4-Piece L-Shaped Sectional',
            brand: 'Crate & Barrel',
            dimensions: { width: 134, depth: 96, height: 32 },
            price: 4799,
            material: 'Performance Fabric',
            color: 'Various',
            style: 'Contemporary',
            features: ['Deep Seats', 'Wide Arms', 'Modular'],
            image: 'retreat-sectional.jpg'
        }
    ],
    chairs: [
        {
            id: 'cb-blake-chair',
            name: 'Blake Grey Wash Chair',
            brand: 'Crate & Barrel',
            dimensions: { width: 30, depth: 33, height: 31 },
            price: 999,
            color: 'Grey Wash',
            style: 'Contemporary',
            image: 'chair-blake.jpg'
        },
        {
            id: 'cb-miles-chair',
            name: 'Miles Accent Chair',
            brand: 'Crate & Barrel',
            dimensions: { width: 28, depth: 31, height: 32 },
            price: 899,
            color: 'Dove',
            style: 'Modern',
            image: 'chair-miles.jpg'
        },
        {
            id: 'cb-cooper-chair',
            name: 'Cooper Swivel Chair',
            brand: 'Crate & Barrel',
            dimensions: { width: 32, depth: 34, height: 30 },
            price: 1299,
            color: 'Vail Storm',
            style: 'Contemporary',
            image: 'chair-cooper.jpg'
        }
    ],
    tables: [
        {
            id: 'cb-parsons-coffee',
            name: 'Parsons Coffee Table',
            brand: 'Crate & Barrel',
            dimensions: { width: 48, depth: 24, height: 16 },
            price: 699,
            material: 'Walnut',
            style: 'Modern',
            image: 'table-parsons.jpg'
        },
        {
            id: 'cb-yukon-coffee',
            name: 'Yukon Coffee Table',
            brand: 'Crate & Barrel',
            dimensions: { width: 60, depth: 28, height: 16 },
            price: 999,
            material: 'Natural Oak',
            style: 'Rustic Modern',
            image: 'table-yukon.jpg'
        },
        {
            id: 'cb-mill-coffee',
            name: 'Mill Coffee Table',
            brand: 'Crate & Barrel',
            dimensions: { width: 42, depth: 22, height: 16 },
            price: 549,
            material: 'Black Steel',
            style: 'Industrial',
            image: 'table-mill.jpg'
        },
        {
            id: 'cb-span-side',
            name: 'Span Side Table',
            brand: 'Crate & Barrel',
            dimensions: { width: 20, depth: 20, height: 24 },
            price: 299,
            material: 'White Oak',
            style: 'Scandinavian',
            image: 'table-span.jpg'
        }
    ],
    storage: [
        {
            id: 'cb-metro-rack',
            name: 'Metro Wire Shelving Unit',
            brand: 'Metro',
            dimensions: { width: 48, depth: 18, height: 72 },
            price: 299,
            material: 'Chrome Wire',
            color: 'Chrome',
            style: 'Industrial',
            features: ['Adjustable Shelves', '800 lbs per shelf capacity', 'NSF Certified'],
            image: 'metro-rack.jpg'
        },
        {
            id: 'cb-media-console',
            name: 'Rigby 80.5" Media Console',
            brand: 'Crate & Barrel',
            dimensions: { width: 80.5, depth: 18, height: 24 },
            price: 1899,
            material: 'Walnut Veneer',
            color: 'Natural Walnut',
            style: 'Mid-Century Modern',
            features: ['Cable Management', 'Adjustable Shelves'],
            image: 'rigby-media-console.jpg'
        },
        {
            id: 'cb-bookcase',
            name: 'Aspect Modular Bookcase',
            brand: 'Crate & Barrel',
            dimensions: { width: 71, depth: 13, height: 73 },
            price: 1199,
            material: 'White Oak',
            style: 'Modern',
            image: 'bookcase-aspect.jpg'
        },
        {
            id: 'cb-credenza',
            name: 'Tate Walnut Credenza',
            brand: 'Crate & Barrel',
            dimensions: { width: 60, depth: 18, height: 30 },
            price: 1599,
            material: 'Walnut',
            style: 'Contemporary',
            image: 'credenza-tate.jpg'
        }
    ],
    rugs: [
        {
            id: 'cb-rug-savoy',
            name: 'Savoy Cream Rug',
            brand: 'Crate & Barrel',
            dimensions: { width: 108, depth: 144 }, // 9x12 feet
            price: 999,
            material: 'Wool',
            style: 'Traditional',
            image: 'rug-savoy.jpg'
        },
        {
            id: 'cb-rug-alvarez',
            name: 'Alvarez Mineral Blue Rug',
            brand: 'Crate & Barrel',
            dimensions: { width: 96, depth: 120 }, // 8x10 feet
            price: 799,
            material: 'Wool Blend',
            style: 'Contemporary',
            image: 'rug-alvarez.jpg'
        },
        {
            id: 'cb-rug-quinn',
            name: 'Quinn Natural Rug',
            brand: 'Crate & Barrel',
            dimensions: { width: 72, depth: 108 }, // 6x9 feet
            price: 599,
            material: 'Jute',
            style: 'Natural',
            image: 'rug-quinn.jpg'
        }
    ],
    lighting: [
        {
            id: 'cb-lamp-marino',
            name: 'Marino Table Lamp',
            brand: 'Crate & Barrel',
            dimensions: { width: 16, depth: 16, height: 28 },
            price: 299,
            style: 'Modern',
            image: 'lamp-marino.jpg'
        },
        {
            id: 'cb-floor-lamp',
            name: 'Cfl Floor Lamp',
            brand: 'Crate & Barrel',
            dimensions: { width: 12, depth: 12, height: 65 },
            price: 399,
            style: 'Contemporary',
            image: 'lamp-floor.jpg'
        }
    ],
    // Additional furniture items for preset layouts
    additionalFurniture: [
        {
            id: 'cb-span-side',
            name: 'Span Side Table',
            brand: 'Crate & Barrel',
            dimensions: { width: 18, depth: 18, height: 21 },
            price: 399,
            color: 'Natural',
            style: 'Modern',
            material: 'Wood'
        },
        {
            id: 'cb-media-console',
            name: 'Media Console',
            brand: 'Crate & Barrel',
            dimensions: { width: 72, depth: 20, height: 24 },
            price: 1299,
            color: 'Walnut',
            style: 'Modern',
            material: 'Wood'
        },
        {
            id: 'cb-rug-alvarez',
            name: 'Alvarez Blue Rug',
            brand: 'Crate & Barrel',
            dimensions: { width: 96, depth: 120, height: 0.5 },
            price: 899,
            color: 'Blue',
            style: 'Contemporary',
            material: 'Wool'
        },
        {
            id: 'wc-sectional',
            name: 'Harmony Sectional',
            brand: 'West Elm',
            dimensions: { width: 111, depth: 87, height: 33 },
            price: 3499,
            color: 'Dove Gray',
            style: 'Modern',
            type: 'sectional'
        },
        {
            id: 'rh-ottoman',
            name: 'Maxwell Ottoman',
            brand: 'Restoration Hardware',
            dimensions: { width: 48, depth: 36, height: 17 },
            price: 1295,
            color: 'Belgian Linen',
            style: 'Classic',
            type: 'ottoman'
        }
    ],
    // Bedroom furniture
    bedroom: [
        {
            id: 'cb-bed-king',
            name: 'Tate King Bed',
            brand: 'Crate & Barrel',
            dimensions: { width: 80, depth: 85, height: 48 },
            price: 1899,
            material: 'Walnut',
            style: 'Modern',
            image: 'bed-tate-king.jpg'
        },
        {
            id: 'cb-bed-queen',
            name: 'Andes Queen Bed',
            brand: 'Crate & Barrel',
            dimensions: { width: 64, depth: 85, height: 51 },
            price: 1599,
            material: 'Acacia',
            style: 'Contemporary',
            image: 'bed-andes-queen.jpg'
        },
        {
            id: 'cb-nightstand',
            name: 'Lineage Nightstand',
            brand: 'Crate & Barrel',
            dimensions: { width: 24, depth: 18, height: 24 },
            price: 549,
            material: 'Oak',
            style: 'Modern',
            image: 'nightstand-lineage.jpg'
        },
        {
            id: 'cb-dresser-6drawer',
            name: 'Linea 6-Drawer Dresser',
            brand: 'Crate & Barrel',
            dimensions: { width: 60, depth: 20, height: 30 },
            price: 1799,
            material: 'Natural Oak',
            style: 'Contemporary',
            image: 'dresser-linea.jpg'
        },
        {
            id: 'cb-dresser-tall',
            name: 'Blake Tall Dresser',
            brand: 'Crate & Barrel',
            dimensions: { width: 38, depth: 19, height: 48 },
            price: 1399,
            material: 'Grey Wash',
            style: 'Modern',
            image: 'dresser-blake-tall.jpg'
        },
        {
            id: 'cb-wardrobe',
            name: 'Dawson Wardrobe',
            brand: 'Crate & Barrel',
            dimensions: { width: 40, depth: 24, height: 72 },
            price: 1999,
            material: 'White',
            style: 'Traditional',
            image: 'wardrobe-dawson.jpg'
        },
        {
            id: 'cb-bench-bedroom',
            name: 'Cavett Bench',
            brand: 'Crate & Barrel',
            dimensions: { width: 48, depth: 16, height: 18 },
            price: 699,
            color: 'Graphite',
            style: 'Modern',
            image: 'bench-cavett.jpg'
        }
    ],
    beds: [
        {
            id: 'cb-purple-queen',
            name: 'Purple Mattress Queen Bed Frame',
            brand: 'Purple',
            dimensions: { width: 60, depth: 80, height: 36 },
            price: 1299,
            material: 'Purple Grid Technology',
            color: 'Purple/Grey',
            style: 'Modern',
            features: ['Purple Grid', 'Motion Isolation', 'Temperature Neutral'],
            image: 'purple-queen-bed.jpg'
        },
        {
            id: 'cb-upholstered-king',
            name: 'Tate Upholstered King Bed',
            brand: 'Crate & Barrel',
            dimensions: { width: 76, depth: 85, height: 58 },
            price: 2199,
            material: 'Linen',
            color: 'Natural',
            style: 'Contemporary',
            image: 'tate-king-bed.jpg'
        },
        {
            id: 'cb-wood-queen',
            name: 'Linea II Queen Bed',
            brand: 'Crate & Barrel',
            dimensions: { width: 64.75, depth: 85.75, height: 45 },
            price: 1899,
            material: 'Solid Oak',
            color: 'Natural Oak',
            style: 'Modern',
            image: 'linea-queen-bed.jpg'
        },
        {
            id: 'cb-platform-queen',
            name: 'Andes Acacia Queen Platform Bed',
            brand: 'Crate & Barrel',
            dimensions: { width: 65, depth: 87, height: 14 },
            price: 1599,
            material: 'Acacia Wood',
            color: 'Natural',
            style: 'Minimalist',
            image: 'andes-platform-bed.jpg'
        }
    ],
    // Bathroom furniture
    bathroom: [
        {
            id: 'cb-vanity-single',
            name: 'Knox Single Vanity',
            brand: 'Crate & Barrel',
            dimensions: { width: 30, depth: 22, height: 34 },
            price: 1299,
            material: 'Walnut',
            style: 'Modern',
            image: 'vanity-knox.jpg'
        },
        {
            id: 'cb-vanity-double',
            name: 'Silverton Double Vanity',
            brand: 'Crate & Barrel',
            dimensions: { width: 60, depth: 22, height: 34 },
            price: 2499,
            material: 'White Oak',
            style: 'Contemporary',
            image: 'vanity-silverton.jpg'
        },
        {
            id: 'cb-bath-storage',
            name: 'Danville Storage Tower',
            brand: 'Crate & Barrel',
            dimensions: { width: 16, depth: 14, height: 66 },
            price: 599,
            material: 'White',
            style: 'Traditional',
            image: 'bath-storage.jpg'
        },
        {
            id: 'cb-bath-stool',
            name: 'Teak Bath Stool',
            brand: 'Crate & Barrel',
            dimensions: { width: 18, depth: 12, height: 18 },
            price: 149,
            material: 'Teak',
            style: 'Spa',
            image: 'bath-stool.jpg'
        },
        {
            id: 'cb-hamper',
            name: 'Sedona Hamper',
            brand: 'Crate & Barrel',
            dimensions: { width: 20, depth: 20, height: 26 },
            price: 99,
            material: 'Honey',
            style: 'Natural',
            image: 'hamper-sedona.jpg'
        }
    ],
    // Kitchen furniture
    kitchen: [
        {
            id: 'cb-kitchen-island',
            name: 'Belmont Kitchen Island',
            brand: 'Crate & Barrel',
            dimensions: { width: 48, depth: 24, height: 36 },
            price: 1899,
            material: 'White/Natural',
            style: 'Traditional',
            image: 'kitchen-island.jpg'
        },
        {
            id: 'cb-kitchen-cart',
            name: 'Origami Kitchen Cart',
            brand: 'Crate & Barrel',
            dimensions: { width: 26, depth: 20, height: 36 },
            price: 499,
            material: 'Steel',
            style: 'Industrial',
            image: 'kitchen-cart.jpg'
        },
        {
            id: 'cb-bar-stools',
            name: 'Vienna Bar Stool',
            brand: 'Crate & Barrel',
            dimensions: { width: 18, depth: 20, height: 30 },
            price: 199,
            material: 'Cane/Black',
            style: 'Modern',
            image: 'bar-stool.jpg'
        },
        {
            id: 'cb-dining-table',
            name: 'Basque Dining Table',
            brand: 'Crate & Barrel',
            dimensions: { width: 65, depth: 38, height: 30 },
            price: 1499,
            material: 'Honey',
            style: 'Rustic',
            image: 'dining-table.jpg'
        },
        {
            id: 'cb-dining-bench',
            name: 'Basque Bench',
            brand: 'Crate & Barrel',
            dimensions: { width: 65, depth: 14, height: 18 },
            price: 449,
            material: 'Honey',
            style: 'Rustic',
            image: 'dining-bench.jpg'
        },
        {
            id: 'cb-dining-chairs',
            name: 'Miles Dining Chair',
            brand: 'Crate & Barrel',
            dimensions: { width: 19, depth: 22, height: 34 },
            price: 279,
            material: 'Upholstered',
            style: 'Contemporary',
            image: 'dining-chair.jpg'
        }
    ],
    // Utility/Laundry furniture
    utility: [
        {
            id: 'cb-utility-shelf',
            name: 'Chrome Wire Shelving',
            brand: 'Crate & Barrel',
            dimensions: { width: 36, depth: 14, height: 72 },
            price: 199,
            material: 'Chrome',
            style: 'Industrial',
            image: 'utility-shelf.jpg'
        },
        {
            id: 'cb-laundry-tower',
            name: 'Laundry Storage Tower',
            brand: 'Crate & Barrel',
            dimensions: { width: 27, depth: 16, height: 68 },
            price: 349,
            material: 'White',
            style: 'Modern',
            image: 'laundry-tower.jpg'
        },
        {
            id: 'cb-folding-table',
            name: 'Folding Work Table',
            brand: 'Crate & Barrel',
            dimensions: { width: 48, depth: 24, height: 32 },
            price: 249,
            material: 'Wood/Metal',
            style: 'Utility',
            image: 'folding-table.jpg'
        },
        {
            id: 'cb-storage-bins',
            name: 'Grey Storage Bins',
            brand: 'Crate & Barrel',
            dimensions: { width: 13, depth: 15, height: 10 },
            price: 29,
            material: 'Felt',
            style: 'Modern',
            image: 'storage-bins.jpg'
        }
    ],
    // Foyer/Hall furniture
    foyer: [
        {
            id: 'cb-console-entry',
            name: 'Yukon Entry Console',
            brand: 'Crate & Barrel',
            dimensions: { width: 60, depth: 16, height: 32 },
            price: 899,
            material: 'Natural Grey',
            style: 'Rustic Modern',
            image: 'console-entry.jpg'
        },
        {
            id: 'cb-hall-bench',
            name: 'Nash Storage Bench',
            brand: 'Crate & Barrel',
            dimensions: { width: 48, depth: 18, height: 20 },
            price: 699,
            material: 'Teak',
            style: 'Modern',
            image: 'hall-bench.jpg'
        },
        {
            id: 'cb-coat-rack',
            name: 'Pillar Coat Rack',
            brand: 'Crate & Barrel',
            dimensions: { width: 20, depth: 20, height: 72 },
            price: 299,
            material: 'Black/Walnut',
            style: 'Contemporary',
            image: 'coat-rack.jpg'
        },
        {
            id: 'cb-mirror-entry',
            name: 'Edge Mirror',
            brand: 'Crate & Barrel',
            dimensions: { width: 30, depth: 1, height: 40 },
            price: 349,
            material: 'Brass',
            style: 'Modern',
            image: 'mirror-entry.jpg'
        },
        {
            id: 'cb-umbrella-stand',
            name: 'Umbrella Stand',
            brand: 'Crate & Barrel',
            dimensions: { width: 11, depth: 11, height: 20 },
            price: 89,
            material: 'Black Metal',
            style: 'Minimal',
            image: 'umbrella-stand.jpg'
        }
    ]
};

// Function to get furniture by category
function getFurnitureByCategory(category) {
    return furnitureDatabase[category] || [];
}

// Function to get all furniture items
function getAllFurniture() {
    const allItems = [];
    Object.keys(furnitureDatabase).forEach(category => {
        if (category !== 'additionalFurniture') {
            allItems.push(...furnitureDatabase[category]);
        }
    });
    return allItems;
}

// Function to check if furniture fits in space
function checkFurnitureFit(furniture, roomDimensions, existingFurniture = []) {
    // Convert room dimensions from feet-inches to inches
    const roomWidth = roomDimensions.width;
    const roomDepth = roomDimensions.depth;
    
    // Check basic fit
    if (furniture.dimensions.width > roomWidth || furniture.dimensions.depth > roomDepth) {
        return false;
    }
    
    // Check for overlaps with existing furniture
    for (const existing of existingFurniture) {
        if (checkOverlap(furniture, existing)) {
            return false;
        }
    }
    
    return true;
}

// Function to check overlap between furniture pieces
function checkOverlap(furniture1, furniture2) {
    const buffer = 18; // 18 inches minimum spacing
    
    return !(furniture1.position.x + furniture1.dimensions.width + buffer < furniture2.position.x ||
             furniture2.position.x + furniture2.dimensions.width + buffer < furniture1.position.x ||
             furniture1.position.y + furniture1.dimensions.depth + buffer < furniture2.position.y ||
             furniture2.position.y + furniture2.dimensions.depth + buffer < furniture1.position.y);
}
