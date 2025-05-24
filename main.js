// Main application logic
class FloorPlanDesigner {
    constructor() {
        this.canvas = document.getElementById('floorPlanCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentRoom = null;
        this.selectedFurniture = null;
        this.isDragging = false;
        this.isDraggingFeature = false;
        this.dragOffset = null;
        this.scale = 2; // 2 pixels per inch
        this.gridSize = 12; // 12 inches (1 foot)
        this.floorViewMode = false;
        this.featureEditMode = false;
        this.selectedFeature = null;
        this.allRooms = [];
        this.floorViewScale = 1;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.populateRoomSelector();
        this.populateFurnitureCategories();
        this.populatePresetLayouts();
        this.loadFurnitureLibrary();
        
        // Room loading is handled after DOM content loaded
    }
    
    setupCanvas() {
        // Add mouse event listeners
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleRightClick(e));
        
        // Add touch event listeners for tablet support
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Prevent scrolling when touching the canvas
        this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        
        // Drag and drop
        this.canvas.addEventListener('dragover', (e) => e.preventDefault());
        this.canvas.addEventListener('drop', (e) => this.handleDrop(e));
    }
    
    setupEventListeners() {
        // Canvas mouse events
        const canvas = document.getElementById('floorPlanCanvas');
        if (canvas) {
            canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            canvas.addEventListener('dragover', (e) => e.preventDefault());
            canvas.addEventListener('drop', (e) => this.handleDrop(e));
        }
        
        // Room selector
        const roomSelector = document.getElementById('roomSelector');
        if (roomSelector) {
            roomSelector.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadRoom(e.target.value);
                }
            });
        }
        
        // View toggle
        const viewToggle = document.getElementById('viewToggle');
        if (viewToggle) {
            viewToggle.addEventListener('click', () => {
                this.floorViewMode = !this.floorViewMode;
                document.getElementById('viewToggle').textContent = 
                    this.floorViewMode ? 'Room View' : 'Floor View';
                
                if (this.floorViewMode) {
                    this.loadFloorView();
                } else if (this.currentRoom) {
                    this.loadRoom(this.currentRoom.id);
                }
            });
        }
        
        // Edit features
        const editFeatures = document.getElementById('editFeatures');
        if (editFeatures) {
            editFeatures.addEventListener('click', () => {
                this.featureEditMode = !this.featureEditMode;
                document.getElementById('editFeatures').textContent = 
                    this.featureEditMode ? 'Exit Feature Editor' : 'Edit Features';
                document.getElementById('editFeatures').classList.toggle('active', this.featureEditMode);
                this.selectedFeature = null;
                this.redrawCanvas();
            });
        }
        
        // Furniture tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.displayFurnitureLibrary(e.target.dataset.category);
            });
        });
        
        // Apply preset layout
        const applyPreset = document.getElementById('applyPreset');
        if (applyPreset) {
            applyPreset.addEventListener('click', () => {
                const preset = document.getElementById('layoutPresets').value;
                if (preset && this.currentRoom) {
                    layoutEngine.applyPresetLayout(preset, this.currentRoom);
                    this.redrawCanvas();
                    this.updateSelectedFurnitureList();
                }
            });
        }
        
        // Rotation controls
        const rotateLeft = document.getElementById('rotateLeft');
        if (rotateLeft) {
            rotateLeft.addEventListener('click', () => {
                if (this.selectedFurniture) {
                    this.selectedFurniture.rotation = (this.selectedFurniture.rotation - 15 + 360) % 360;
                    this.updateRotationSlider();
                    this.redrawCanvas();
                }
            });
        }
        
        const rotateRight = document.getElementById('rotateRight');
        if (rotateRight) {
            rotateRight.addEventListener('click', () => {
                if (this.selectedFurniture) {
                    this.selectedFurniture.rotation = (this.selectedFurniture.rotation + 15) % 360;
                    this.updateRotationSlider();
                    this.redrawCanvas();
                }
            });
        }
        
        const rotationSlider = document.getElementById('rotationSlider');
        if (rotationSlider) {
            rotationSlider.addEventListener('input', (e) => {
                if (this.selectedFurniture) {
                    this.selectedFurniture.rotation = parseInt(e.target.value);
                    document.getElementById('rotationValue').textContent = `${e.target.value}°`;
                    this.redrawCanvas();
                }
            });
        }
        
        // Opacity control
        const opacitySlider = document.getElementById('opacitySlider');
        const opacityValue = document.getElementById('opacityValue');
        
        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                if (this.selectedFurniture) {
                    this.selectedFurniture.opacity = parseInt(e.target.value) / 100;
                    document.getElementById('opacityValue').textContent = `${e.target.value}%`;
                    this.redrawCanvas();
                }
            });
        }
        
        // Delete and clear controls
        const deleteSelected = document.getElementById('deleteSelected');
        if (deleteSelected) {
            deleteSelected.addEventListener('click', () => {
                if (this.selectedFurniture) {
                    layoutEngine.removeFurniture(this.selectedFurniture.layoutId);
                    this.selectedFurniture = null;
                    this.redrawCanvas();
                    this.updateSelectedFurnitureList();
                    this.saveLayout();
                    this.showInfoMessage('Furniture deleted');
                }
            });
        }
        
        // Layer controls
        const sendToBack = document.getElementById('sendToBack');
        if (sendToBack) {
            sendToBack.addEventListener('click', () => {
                if (this.selectedFurniture) {
                    layoutEngine.sendToBack(this.selectedFurniture.layoutId);
                    this.redrawCanvas();
                    this.showInfoMessage('Furniture sent to back');
                }
            });
        }
        
        const bringToFront = document.getElementById('bringToFront');
        if (bringToFront) {
            bringToFront.addEventListener('click', () => {
                if (this.selectedFurniture) {
                    layoutEngine.bringToFront(this.selectedFurniture.layoutId);
                    this.redrawCanvas();
                    this.showInfoMessage('Furniture brought to front');
                }
            });
        }
        
        // Add room dimension update handler
        const updateDimensions = document.getElementById('updateDimensions');
        if (updateDimensions) {
            updateDimensions.addEventListener('click', () => {
                this.updateRoomDimensions();
            });
        }
        
        const clearCanvas = document.getElementById('clearCanvas');
        if (clearCanvas) {
            clearCanvas.addEventListener('click', () => {
                if (confirm('Clear all furniture from this room?')) {
                    layoutEngine.clearLayout();
                    this.selectedFurniture = null;
                    this.redrawCanvas();
                    this.updateSelectedFurnitureList();
                }
            });
        }
        
        const saveLayout = document.getElementById('saveLayout');
        if (saveLayout) {
            saveLayout.addEventListener('click', () => {
                this.saveLayout();
            });
        }
        
        const exportDesign = document.getElementById('exportDesign');
        if (exportDesign) {
            exportDesign.addEventListener('click', () => {
                this.exportDesign();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.selectedFurniture) {
                layoutEngine.removeFurniture(this.selectedFurniture);
                this.selectedFurniture = null;
                this.redrawCanvas();
                this.updateSelectedFurnitureList();
            }
        });
    }
    
    populateRoomSelector() {
        console.log('populateRoomSelector called');
        const selector = document.getElementById('roomSelector');
        if (!selector) {
            console.error('Room selector element not found!');
            return;
        }
        selector.innerHTML = '<option value="">Select a room...</option>';
        
        // Group rooms by floor
        const roomsByFloor = {
            1: { label: 'Floor 1 (Lower / Garden Level)', rooms: [] },
            2: { label: 'Floor 2 (Main / Entry Level)', rooms: [] },
            3: { label: 'Floor 3 (Upper)', rooms: [] }
        };
        
        // Sort all rooms by floor
        const allRooms = floorPlanParser.getAllRooms();
        console.log('All rooms:', allRooms);
        
        allRooms.forEach(room => {
            if (roomsByFloor[room.floor]) {
                roomsByFloor[room.floor].rooms.push(room);
            }
        });
        
        // Create options grouped by floor
        Object.keys(roomsByFloor).forEach(floor => {
            const floorData = roomsByFloor[floor];
            if (floorData.rooms.length > 0) {
                // Add floor label
                const optgroup = document.createElement('optgroup');
                optgroup.label = floorData.label;
                
                // Add rooms for this floor
                floorData.rooms.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room.id;
                    option.textContent = room.name;
                    optgroup.appendChild(option);
                });
                
                selector.appendChild(optgroup);
            }
        });
        
        console.log('Room selector populated with', allRooms.length, 'rooms');
        
        // Load first room
        if (allRooms.length > 0) {
            this.loadRoom(allRooms[0].id);
        }
    }
    
    populateFurnitureCategories() {
        const tabs = document.querySelector('.furniture-tabs');
        tabs.innerHTML = '';
        
        // Get all categories from furniture database
        const categories = Object.keys(furnitureDatabase).filter(key => key !== 'additionalFurniture');
        
        categories.forEach((category, index) => {
            const button = document.createElement('button');
            button.className = `tab ${index === 0 ? 'active' : ''}`;
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            button.dataset.category = category;
            
            button.addEventListener('click', (e) => {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                // Add active class to clicked tab
                e.target.classList.add('active');
                // Load furniture for selected category
                this.loadFurnitureCategory(category);
            });
            
            tabs.appendChild(button);
        });
    }
    
    populatePresetLayouts() {
        const select = document.getElementById('layoutPresets');
        const presets = layoutEngine.getPresetLayouts();
        
        // Clear existing options except the default
        select.innerHTML = '<option value="">Select a preset layout...</option>';
        
        // Add preset options
        Object.keys(presets).forEach(presetId => {
            const preset = presets[presetId];
            const option = document.createElement('option');
            option.value = presetId;
            option.textContent = preset.name;
            select.appendChild(option);
        });
    }
    
    loadRoom(roomId) {
        // Save current room layout first
        if (this.currentRoom) {
            this.saveLayout();
        }
        
        this.currentRoom = floorPlanParser.getRoomById(roomId);
        if (!this.currentRoom) return;
        
        // Load the room in single room view
        this.floorViewMode = false;
        document.getElementById('viewToggle').textContent = 'Floor View';
        
        // Clear current layout engine
        layoutEngine.clearLayout();
        
        // Load saved furniture from localStorage
        if (floorPlanParser.customLayouts[roomId]?.furniture) {
            const savedFurniture = floorPlanParser.customLayouts[roomId].furniture;
            savedFurniture.forEach(item => {
                layoutEngine.addFurniture(item);
            });
        }
        
        this.selectedFurniture = null;
        this.updateRoomInfo();
        this.updateRoomDimensionInputs();
        this.resizeCanvasToRoom();
        this.redrawCanvas();
        this.updateSelectedFurnitureList();
    }
    
    resizeCanvasToRoom() {
        if (!this.currentRoom) return;
        
        // Set canvas size based on room dimensions
        this.canvas.width = this.currentRoom.dimensions.width * this.scale + 40; // Add padding
        this.canvas.height = this.currentRoom.dimensions.depth * this.scale + 40; // Add padding
    }
    
    loadFloorView() {
        // Get all rooms on current floor
        const currentFloor = this.currentRoom ? this.currentRoom.floor : 2;
        this.allRooms = floorPlanParser.getRoomsByFloor(currentFloor);
        
        // Calculate floor bounds
        let maxX = 0;
        let maxY = 0;
        this.allRooms.forEach(room => {
            const roomRight = (room.position?.x || 0) + room.dimensions.width;
            const roomBottom = (room.position?.y || 0) + room.dimensions.depth;
            maxX = Math.max(maxX, roomRight);
            maxY = Math.max(maxY, roomBottom);
        });
        
        // Calculate scale to fit floor on canvas with padding
        const padding = 40;
        const scaleX = (this.canvas.width - 2 * padding) / maxX;
        const scaleY = (this.canvas.height - 2 * padding) / maxY;
        this.floorViewScale = Math.min(scaleX, scaleY, 2); // Cap at 2x scale
        
        // Update canvas size
        this.canvas.width = maxX * this.floorViewScale + 2 * padding;
        this.canvas.height = maxY * this.floorViewScale + 2 * padding;
        
        this.redrawCanvas();
    }
    
    loadRoomSpecificFurniture() {
        if (!this.currentRoom) return;
        
        // Determine room type from name
        const roomName = this.currentRoom.name.toLowerCase();
        let category = 'sofas'; // default
        
        if (roomName.includes('bedroom')) {
            category = 'bedroom';
        } else if (roomName.includes('bath')) {
            category = 'bathroom';
        } else if (roomName.includes('kitchen')) {
            category = 'kitchen';
        } else if (roomName.includes('dining')) {
            category = 'kitchen';
        } else if (roomName.includes('foyer') || roomName.includes('entry')) {
            category = 'foyer';
        } else if (roomName.includes('utility') || roomName.includes('laundry')) {
            category = 'utility';
        }
        
        // Load appropriate furniture category
        this.loadFurnitureCategory(category);
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
    }
    
    loadFurnitureLibrary() {
        this.loadFurnitureCategory('sofas');
    }
    
    loadFurnitureCategory(category) {
        const container = document.getElementById('furnitureItems');
        container.innerHTML = '';
        
        let items = furnitureDatabase[category] || [];
        
        // Add the "Add Selected" button at the top
        const addButton = document.createElement('button');
        addButton.id = 'addSelectedFurniture';
        addButton.className = 'add-selected-btn';
        addButton.textContent = 'Add Selected Furniture';
        
        addButton.addEventListener('click', () => {
            if (this.selectedFurnitureItem) {
                this.addFurnitureToCanvas(
                    this.selectedFurnitureItem.category,
                    this.selectedFurnitureItem.id
                );
            } else {
                this.showInfoMessage('Please select a furniture item first');
            }
        });
        
        container.appendChild(addButton);
        
        items.forEach(furniture => {
            const item = document.createElement('div');
            item.className = 'furniture-item';
            item.draggable = true;
            item.dataset.furnitureId = furniture.id;
            
            const icon = this.getFurnitureIcon(category);
            const price = furniture.price ? `$${furniture.price}` : '';
            
            item.innerHTML = `
                <div class="furniture-icon">${icon}</div>
                <div class="furniture-info">
                    <div class="furniture-name">${furniture.name}</div>
                    <div class="furniture-dimensions">${furniture.dimensions.width}" × ${furniture.dimensions.depth}"</div>
                    <div class="furniture-price">${price}</div>
                </div>
            `;
            
            // Add click handler for tablet selection
            item.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.furniture-item').forEach(el => el.classList.remove('selected'));
                // Add selection to clicked item
                item.classList.add('selected');
                // Store selected furniture info
                this.selectedFurnitureItem = { category, id: furniture.id };
            });
            
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('furnitureId', furniture.id);
                e.dataTransfer.setData('category', category);
            });
            
            container.appendChild(item);
        });
    }
    
    getFurnitureIcon(category) {
        const icons = {
            sofas: '🛋️',
            chairs: '🪑',
            tables: '⬛',
            storage: '🗄️',
            rugs: '▭',
            lighting: '💡',
            beds: '🛏️',
            bathroom: '🚿',
            kitchen: '🍴',
            utility: '🧺',
            foyer: '🚪'
        };
        return icons[category] || '📦';
    }
    
    addFurnitureToCanvas(category, furnitureId) {
        const furnitureData = this.getFurnitureById(category, furnitureId);
        if (!furnitureData) return;
        
        // Add furniture at center of visible area
        const centerX = Math.round((this.currentRoom.dimensions.width / 2) / this.gridSize) * this.gridSize;
        const centerY = Math.round((this.currentRoom.dimensions.depth / 2) / this.gridSize) * this.gridSize;
        
        const layoutId = layoutEngine.addFurniture({
            ...furnitureData,
            x: centerX,
            y: centerY,
            rotation: 0
        });
        
        this.redrawCanvas();
        this.updateSelectedFurnitureList();
        this.saveLayout();
        this.showInfoMessage('Furniture added to canvas');
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        const furnitureId = e.dataTransfer.getData('furnitureId');
        const category = e.dataTransfer.getData('category');
        
        // Find furniture in database
        const furniture = furnitureDatabase[category]?.find(f => f.id === furnitureId);
        if (!furniture) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        
        if (this.floorViewMode) {
            // Handle drop in floor view
            const padding = 40;
            
            // Find which room the furniture is being dropped in
            let targetRoom = null;
            let roomRelativeX = 0;
            let roomRelativeY = 0;
            
            for (const room of this.allRooms) {
                const roomX = (room.position?.x || 0) * this.floorViewScale + padding;
                const roomY = (room.position?.y || 0) * this.floorViewScale + padding;
                const roomWidth = room.dimensions.width * this.floorViewScale;
                const roomHeight = room.dimensions.depth * this.floorViewScale;
                
                if (canvasX >= roomX && canvasX <= roomX + roomWidth &&
                    canvasY >= roomY && canvasY <= roomY + roomHeight) {
                    targetRoom = room;
                    roomRelativeX = (canvasX - roomX) / this.floorViewScale;
                    roomRelativeY = (canvasY - roomY) / this.floorViewScale;
                    break;
                }
            }
            
            if (targetRoom) {
                // Ensure the room has a furniture layout in customLayouts
                if (!floorPlanParser.customLayouts[targetRoom.id]) {
                    floorPlanParser.customLayouts[targetRoom.id] = {};
                }
                if (!floorPlanParser.customLayouts[targetRoom.id].furniture) {
                    floorPlanParser.customLayouts[targetRoom.id].furniture = [];
                }
                
                // Add furniture to the target room
                const x = Math.round(roomRelativeX / this.gridSize) * this.gridSize;
                const y = Math.round(roomRelativeY / this.gridSize) * this.gridSize;
                
                const newFurniture = {
                    ...furniture,
                    width: furniture.dimensions.width,
                    depth: furniture.dimensions.depth,
                    x: x,
                    y: y,
                    rotation: 0,
                    layoutId: `furniture-${Date.now()}`,
                    opacity: furniture.category === 'rugs' ? 0.7 : 1.0
                };
                
                floorPlanParser.customLayouts[targetRoom.id].furniture.push(newFurniture);
                localStorage.setItem('customLayouts', JSON.stringify(floorPlanParser.customLayouts));
                
                this.redrawCanvas();
                
                // Show success message
                const info = document.getElementById('infoMessage');
                info.textContent = `Added ${furniture.name} to ${targetRoom.name}`;
                info.style.display = 'block';
                setTimeout(() => { info.style.display = 'none'; }, 2000);
            }
        } else {
            // Handle drop in single room view
            if (!this.currentRoom) return;
            
            // Calculate position
            const x = Math.round(canvasX / this.scale / this.gridSize) * this.gridSize;
            const y = Math.round(canvasY / this.scale / this.gridSize) * this.gridSize;
            
            // Add furniture to layout with proper structure
            const placedFurniture = layoutEngine.addFurniture({
                ...furniture,
                width: furniture.dimensions.width,
                depth: furniture.dimensions.depth,
                x: x,
                y: y,
                rotation: 0
            });
            
            this.selectedFurniture = placedFurniture;
            this.redrawCanvas();
            this.updateSelectedFurnitureList();
            this.saveLayout();
        }
    }
    
    handleMouseDown(e) {
        if (!this.currentRoom) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.scale;
        const y = (e.clientY - rect.top) / this.scale;
        
        if (this.featureEditMode) {
            // Handle feature selection
            this.selectedFeature = this.getFeatureAt(x, y);
            if (this.selectedFeature) {
                this.isDraggingFeature = true;
                this.dragOffset = {
                    x: x - this.selectedFeature.position.x,
                    y: y - this.selectedFeature.position.y
                };
            }
        } else {
            // Handle furniture selection
            const furniture = layoutEngine.getFurnitureAt(x, y);
            if (furniture) {
                this.selectedFurniture = furniture;
                this.isDragging = true;
                this.dragOffset = {
                    x: x - furniture.x,
                    y: y - furniture.y
                };
                
                // Update rotation slider
                document.getElementById('rotationSlider').value = furniture.rotation || 0;
                document.getElementById('rotationValue').textContent = `${furniture.rotation || 0}°`;
                
                // Update opacity slider
                const opacity = furniture.opacity || 1.0;
                document.getElementById('opacitySlider').value = opacity * 100;
                document.getElementById('opacityValue').textContent = `${Math.round(opacity * 100)}%`;
            } else {
                this.selectedFurniture = null;
            }
        }
        
        this.redrawCanvas();
    }
    
    handleMouseMove(e) {
        if (!this.isDragging && !this.isDraggingFeature) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.scale;
        const y = (e.clientY - rect.top) / this.scale;
        
        if (this.isDraggingFeature && this.selectedFeature) {
            // Update feature position
            const newX = Math.round((x - this.dragOffset.x) / this.gridSize) * this.gridSize;
            const newY = Math.round((y - this.dragOffset.y) / this.gridSize) * this.gridSize;
            
            this.selectedFeature.position = { x: newX, y: newY };
            this.redrawCanvas();
        } else if (this.isDragging && this.selectedFurniture) {
            // Update furniture position
            const newX = Math.round((x - this.dragOffset.x) / this.gridSize) * this.gridSize;
            const newY = Math.round((y - this.dragOffset.y) / this.gridSize) * this.gridSize;
            
            // Check boundaries
            const bounds = layoutEngine.getFurnitureBounds({
                ...this.selectedFurniture,
                x: newX,
                y: newY
            });
            
            if (bounds.left >= 0 && bounds.top >= 0 &&
                bounds.right <= this.currentRoom.dimensions.width &&
                bounds.bottom <= this.currentRoom.dimensions.depth) {
                this.selectedFurniture.x = newX;
                this.selectedFurniture.y = newY;
                this.redrawCanvas();
            }
        }
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
        this.isDraggingFeature = false;
        this.dragOffset = null;
        
        if (this.selectedFeature) {
            this.saveCustomFeatures();
        }
    }
    
    // Touch event handlers for tablet support
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        
        // Create a synthetic mouse event
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true
        });
        
        this.handleMouseDown(mouseEvent);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.isDragging && !this.isDraggingFeature) return;
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        
        // Create a synthetic mouse event
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true
        });
        
        this.handleMouseMove(mouseEvent);
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        
        // Create a synthetic mouse event
        const mouseEvent = new MouseEvent('mouseup', {
            bubbles: true
        });
        
        this.handleMouseUp(mouseEvent);
    }
    
    getFeatureAt(x, y) {
        if (!this.currentRoom) return null;
        
        const features = this.currentRoom.features;
        const scaledX = x;
        const scaledY = y;
        
        // Check windows
        for (let window of features.windows) {
            if (scaledX >= window.position.x && scaledX <= window.position.x + window.width &&
                scaledY >= window.position.y && scaledY <= window.position.y + 6) {
                return { type: 'window', data: window, position: window.position };
            }
        }
        
        // Check doors
        for (let door of features.doors) {
            if (scaledX >= door.position.x && scaledX <= door.position.x + door.width &&
                scaledY >= door.position.y && scaledY <= door.position.y + 6) {
                return { type: 'door', data: door, position: door.position };
            }
        }
        
        // Check stairs
        if (features.stairs) {
            if (scaledX >= features.stairs.position.x && 
                scaledX <= features.stairs.position.x + features.stairs.dimensions.width &&
                scaledY >= features.stairs.position.y && 
                scaledY <= features.stairs.position.y + features.stairs.dimensions.depth) {
                return { type: 'stairs', data: features.stairs, position: features.stairs.position };
            }
        }
        
        return null;
    }
    
    redrawCanvas() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.floorViewMode) {
            this.drawFloorView();
        } else {
            // Single room view
            this.drawGrid();
            this.drawRoom();
            this.drawFurniture();
            
            if (this.featureEditMode && this.selectedFeature) {
                this.highlightSelectedFeature();
            }
        }
    }
    
    drawFloorView() {
        // Clear canvas
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Get all rooms for the current floor
        const floorRooms = floorPlanParser.getRoomsByFloor(this.currentRoom.floor);
        
        // Calculate floor bounds
        let maxX = 0;
        let maxY = 0;
        floorRooms.forEach(room => {
            const roomRight = (room.position?.x || 0) + room.dimensions.width;
            const roomBottom = (room.position?.y || 0) + room.dimensions.depth;
            maxX = Math.max(maxX, roomRight);
            maxY = Math.max(maxY, roomBottom);
        });
        
        // Calculate scale to fit floor on canvas with padding
        const padding = 40;
        const scaleX = (this.canvas.width - 2 * padding) / maxX;
        const scaleY = (this.canvas.height - 2 * padding) / maxY;
        this.floorViewScale = Math.min(scaleX, scaleY, 2); // Cap at 2x scale
        
        // Draw each room
        floorRooms.forEach(room => {
            const x = (room.position?.x || 0) * this.floorViewScale + padding;
            const y = (room.position?.y || 0) * this.floorViewScale + padding;
            const width = room.dimensions.width * this.floorViewScale;
            const height = room.dimensions.depth * this.floorViewScale;
            
            // Draw room outline
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, width, height);
            
            // Fill room
            this.ctx.fillStyle = '#f9f9f9';
            this.ctx.fillRect(x, y, width, height);
            
            // Draw room features (doors, windows, stairs)
            this.drawRoomFeaturesInFloorView(room, x, y, this.floorViewScale);
            
            // Draw room name
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(room.name, x + width/2, y + height/2);
            
            // Draw furniture if saved
            if (floorPlanParser.customLayouts[room.id]?.furniture) {
                this.drawFurnitureInFloorView(room, x, y, this.floorViewScale);
            }
        });
        
        // Draw floor label
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Floor ${this.currentRoom.floor}`, padding, 25);
    }
    
    drawRoomFeaturesInFloorView(room, roomX, roomY, scale) {
        // Draw doors
        room.features.doors?.forEach(door => {
            this.ctx.strokeStyle = '#8B4513';
            this.ctx.lineWidth = 3;
            
            if (door.position === 'top') {
                this.ctx.beginPath();
                this.ctx.moveTo(roomX + room.dimensions.width * scale * 0.4, roomY);
                this.ctx.lineTo(roomX + room.dimensions.width * scale * 0.6, roomY);
                this.ctx.stroke();
            } else if (door.position === 'bottom') {
                this.ctx.beginPath();
                this.ctx.moveTo(roomX + room.dimensions.width * scale * 0.4, roomY + room.dimensions.depth * scale);
                this.ctx.lineTo(roomX + room.dimensions.width * scale * 0.6, roomY + room.dimensions.depth * scale);
                this.ctx.stroke();
            } else if (door.position === 'left') {
                this.ctx.beginPath();
                this.ctx.moveTo(roomX, roomY + room.dimensions.depth * scale * 0.4);
                this.ctx.lineTo(roomX, roomY + room.dimensions.depth * scale * 0.6);
                this.ctx.stroke();
            } else if (door.position === 'right') {
                this.ctx.beginPath();
                this.ctx.moveTo(roomX + room.dimensions.width * scale, roomY + room.dimensions.depth * scale * 0.4);
                this.ctx.lineTo(roomX + room.dimensions.width * scale, roomY + room.dimensions.depth * scale * 0.6);
                this.ctx.stroke();
            } else if (door.position?.x !== undefined) {
                // Positioned door
                const doorX = roomX + door.position.x * scale;
                const doorY = roomY + door.position.y * scale;
                const doorWidth = (door.width || 30) * scale;
                
                if (door.position.y === 0) {
                    // Top wall
                    this.ctx.beginPath();
                    this.ctx.moveTo(doorX, doorY);
                    this.ctx.lineTo(doorX + doorWidth, doorY);
                    this.ctx.stroke();
                } else {
                    // Other positions
                    this.ctx.beginPath();
                    this.ctx.moveTo(doorX, doorY);
                    this.ctx.lineTo(doorX + doorWidth, doorY);
                    this.ctx.stroke();
                }
            }
        });
        
        // Draw windows
        room.features.windows?.forEach(window => {
            this.ctx.strokeStyle = '#87CEEB';
            this.ctx.lineWidth = 4;
            
            if (window.position?.x !== undefined) {
                const winX = roomX + window.position.x * scale;
                const winY = roomY + window.position.y * scale;
                const winWidth = window.width * scale;
                
                if (window.position.y === 0) {
                    // Top wall window
                    this.ctx.beginPath();
                    this.ctx.moveTo(winX, winY);
                    this.ctx.lineTo(winX + winWidth, winY);
                    this.ctx.stroke();
                } else if (window.position.x === 0) {
                    // Left wall window
                    this.ctx.beginPath();
                    this.ctx.moveTo(winX, winY);
                    this.ctx.lineTo(winX, winY + winWidth);
                    this.ctx.stroke();
                } else {
                    // Bottom wall window
                    this.ctx.beginPath();
                    this.ctx.moveTo(winX, winY);
                    this.ctx.lineTo(winX + winWidth, winY);
                    this.ctx.stroke();
                }
            }
        });
        
        // Draw stairs
        if (room.features.stairs) {
            this.ctx.fillStyle = '#666';
            this.ctx.font = '10px Arial';
            const stairX = roomX + (room.features.stairs.position?.x || room.dimensions.width / 2) * scale;
            const stairY = roomY + (room.features.stairs.position?.y || room.dimensions.depth / 2) * scale;
            
            // Draw stair symbol
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                this.ctx.moveTo(stairX - 10, stairY - 10 + i * 5);
                this.ctx.lineTo(stairX + 10, stairY - 10 + i * 5);
            }
            this.ctx.stroke();
            
            // Draw direction arrow
            this.ctx.fillText(room.features.stairs.direction === 'up' ? '↑' : '↓', stairX, stairY + 20);
        }
    }
    
    drawFurnitureInFloorView(room, roomX, roomY, scale) {
        const furniture = floorPlanParser.customLayouts[room.id].furniture;
        
        furniture.forEach(item => {
            this.ctx.save();
            
            // Set opacity
            this.ctx.globalAlpha = item.opacity || 1.0;
            
            // Calculate furniture position
            const furnitureX = roomX + item.x * scale;
            const furnitureY = roomY + item.y * scale;
            const furnitureWidth = item.width * scale;
            const furnitureDepth = item.depth * scale;
            
            // Apply rotation
            const centerX = furnitureX + furnitureWidth / 2;
            const centerY = furnitureY + furnitureDepth / 2;
            
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate((item.rotation || 0) * Math.PI / 180);
            this.ctx.translate(-centerX, -centerY);
            
            // Draw furniture with category colors
            const categoryColors = {
                rugs: '#c4a57b',
                sofas: '#8b7355',
                chairs: '#a0826d',
                tables: '#654321',
                storage: '#7d6d5d',
                lighting: '#f4d03f',
                bedroom: '#9b7b6b',
                bathroom: '#a8a8a8',
                kitchen: '#808080'
            };
            
            this.ctx.fillStyle = categoryColors[item.category] || '#8b7355';
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 1;
            
            this.ctx.fillRect(
                furnitureX,
                furnitureY,
                furnitureWidth,
                furnitureDepth
            );
            this.ctx.strokeRect(
                furnitureX,
                furnitureY,
                furnitureWidth,
                furnitureDepth
            );
            
            this.ctx.restore();
        });
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.gridSize * this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.gridSize * this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawRoom(room) {
        if (!room) return;
        
        const roomToUse = room || this.currentRoom;
        
        // Draw walls
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(0, 0, roomToUse.dimensions.width * this.scale, roomToUse.dimensions.depth * this.scale);
        
        // Draw windows
        this.ctx.strokeStyle = '#4a90e2';
        this.ctx.lineWidth = 4;
        roomToUse.features.windows.forEach(window => {
            this.ctx.beginPath();
            this.ctx.moveTo(window.position.x * this.scale, window.position.y * this.scale);
            this.ctx.lineTo((window.position.x + window.width) * this.scale, window.position.y * this.scale);
            this.ctx.stroke();
            
            // Add window sill
            this.ctx.fillStyle = '#e0e0e0';
            this.ctx.fillRect(window.position.x * this.scale - 2, window.position.y * this.scale - 2, 
                            (window.width * this.scale) + 4, 4);
            
            // Highlight if selected in edit mode
            if (this.featureEditMode && this.selectedFeature && 
                this.selectedFeature.type === 'window' && this.selectedFeature.data === window) {
                this.ctx.strokeStyle = '#ff6b6b';
                this.ctx.strokeRect(window.position.x * this.scale - 5, window.position.y * this.scale - 5,
                                  window.width * this.scale + 10, 10);
            }
        });
        
        // Draw doors
        this.ctx.strokeStyle = '#8b572a';
        this.ctx.lineWidth = 3;
        roomToUse.features.doors.forEach(door => {
            this.ctx.strokeRect(door.position.x * this.scale, door.position.y * this.scale, 
                               door.width * this.scale, 6 * this.scale);
            
            // Draw door arc
            this.drawDoorArc(door.position, door.width);
            
            // Highlight if selected in edit mode
            if (this.featureEditMode && this.selectedFeature && 
                this.selectedFeature.type === 'door' && this.selectedFeature.data === door) {
                this.ctx.strokeStyle = '#ff6b6b';
                this.ctx.strokeRect(door.position.x * this.scale - 5, door.position.y * this.scale - 5,
                                  door.width * this.scale + 10, 16);
            }
        });
        
        // Draw stairs if present
        if (roomToUse.features.stairs) {
            this.drawStairs(roomToUse.features.stairs);
            
            // Highlight if selected in edit mode
            if (this.featureEditMode && this.selectedFeature && 
                this.selectedFeature.type === 'stairs') {
                this.ctx.strokeStyle = '#ff6b6b';
                this.ctx.strokeRect(roomToUse.features.stairs.position.x * this.scale - 5, 
                                  roomToUse.features.stairs.position.y * this.scale - 5,
                                  roomToUse.features.stairs.dimensions.width * this.scale + 10, 
                                  roomToUse.features.stairs.dimensions.depth * this.scale + 10);
            }
        }
        
        // Draw room label in floor view
        if (this.floorViewMode) {
            this.ctx.fillStyle = '#333';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(roomToUse.name, 
                            roomToUse.dimensions.width * this.scale / 2,
                            roomToUse.dimensions.depth * this.scale / 2);
        }
    }
    
    drawFurniture() {
        const layout = layoutEngine.getLayout();
        
        layout.forEach(furniture => {
            this.ctx.save();
            
            // Set opacity
            this.ctx.globalAlpha = furniture.opacity || 1.0;
            
            // Calculate center point for rotation
            const centerX = furniture.x + furniture.width / 2;
            const centerY = furniture.y + furniture.depth / 2;
            
            // Apply rotation
            this.ctx.translate(centerX * this.scale, centerY * this.scale);
            this.ctx.rotate((furniture.rotation || 0) * Math.PI / 180);
            this.ctx.translate(-centerX * this.scale, -centerY * this.scale);
            
            // Draw furniture with selection highlight
            if (this.selectedFurniture && this.selectedFurniture.layoutId === furniture.layoutId) {
                this.ctx.strokeStyle = '#4a90e2';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(
                    (furniture.x - 2) * this.scale,
                    (furniture.y - 2) * this.scale,
                    (furniture.width + 4) * this.scale,
                    (furniture.depth + 4) * this.scale
                );
            }
            
            // Draw furniture with category-specific colors
            const categoryColors = {
                rugs: '#c4a57b',
                sofas: '#8b7355',
                chairs: '#a0826d',
                tables: '#654321',
                storage: '#7d6d5d',
                lighting: '#f4d03f',
                bedroom: '#9b7b6b',
                bathroom: '#a8a8a8',
                kitchen: '#808080'
            };
            
            this.ctx.fillStyle = categoryColors[furniture.category] || '#8b7355';
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 2;
            
            this.ctx.fillRect(
                furniture.x * this.scale,
                furniture.y * this.scale,
                furniture.width * this.scale,
                furniture.depth * this.scale
            );
            this.ctx.strokeRect(
                furniture.x * this.scale,
                furniture.y * this.scale,
                furniture.width * this.scale,
                furniture.depth * this.scale
            );
            
            // Add furniture name
            this.ctx.fillStyle = '#333';
            this.ctx.font = '11px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Only show name if furniture is large enough
            if (furniture.width > 24) {
                this.ctx.fillText(
                    furniture.name,
                    (furniture.x + furniture.width / 2) * this.scale,
                    (furniture.y + furniture.depth / 2) * this.scale
                );
            }
            
            this.ctx.restore();
        });
    }
    
    drawDoorArc(position, width) {
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        
        if (position.x === 0) {
            // Left wall door
            this.ctx.arc(position.x * this.scale, 
                        (position.y + width) * this.scale, 
                        width * this.scale, 
                        -Math.PI * 0.5, 0);
        } else if (position.y === 0) {
            // Top wall door
            this.ctx.arc((position.x + width) * this.scale, 
                        position.y * this.scale, 
                        width * this.scale, 
                        Math.PI * 0.5, Math.PI);
        } else {
            // Default arc
            this.ctx.arc(position.x * this.scale + width * this.scale / 2, 
                        position.y * this.scale + width * this.scale / 2, 
                        width * this.scale / 2, 
                        0, Math.PI * 0.5);
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawStairs(stairs) {
        this.ctx.fillStyle = '#d0d0d0';
        this.ctx.fillRect(stairs.position.x * this.scale, 
                         stairs.position.y * this.scale,
                         stairs.dimensions.width * this.scale,
                         stairs.dimensions.depth * this.scale);
        
        // Draw steps
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        const stepCount = 10;
        const stepHeight = stairs.dimensions.depth / stepCount;
        
        for (let i = 0; i < stepCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(stairs.position.x * this.scale, 
                           (stairs.position.y + i * stepHeight) * this.scale);
            this.ctx.lineTo((stairs.position.x + stairs.dimensions.width) * this.scale, 
                           (stairs.position.y + i * stepHeight) * this.scale);
            this.ctx.stroke();
        }
        
        // Draw arrow indicating direction
        this.ctx.fillStyle = '#333';
        const centerX = (stairs.position.x + stairs.dimensions.width / 2) * this.scale;
        const centerY = (stairs.position.y + stairs.dimensions.depth / 2) * this.scale;
        
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('▲', centerX, centerY);
    }
    
    updateRoomInfo() {
        const roomInfo = document.getElementById('roomInfo');
        if (!this.currentRoom) {
            roomInfo.innerHTML = '<p>No room selected</p>';
            return;
        }
        
        const space = floorPlanParser.calculateUsableSpace(this.currentRoom);
        const sqft = Math.round(space / 144);
        
        roomInfo.innerHTML = `
            <div class="room-stat">
                <strong>${this.currentRoom.name}</strong>
            </div>
            <div class="room-stat">
                Dimensions: ${Math.floor(this.currentRoom.dimensions.width / 12)}'${this.currentRoom.dimensions.width % 12}" × 
                ${Math.floor(this.currentRoom.dimensions.depth / 12)}'${this.currentRoom.dimensions.depth % 12}"
            </div>
            <div class="room-stat">
                Total Area: ${sqft} sq ft
            </div>
            <div class="room-stat">
                Furniture Count: ${layoutEngine.getLayout().length}
            </div>
        `;
    }
    
    updateRoomDimensionInputs() {
        const widthInput = document.getElementById('roomWidth');
        const depthInput = document.getElementById('roomDepth');
        
        if (!widthInput || !depthInput) {
            console.error('Room dimension inputs not found');
            return;
        }
        
        if (!this.currentRoom) {
            widthInput.value = '';
            depthInput.value = '';
            return;
        }
        
        widthInput.value = this.currentRoom.dimensions.width;
        depthInput.value = this.currentRoom.dimensions.depth;
    }
    
    updateSelectedFurnitureList() {
        const container = document.getElementById('selectedFurniture');
        const layout = layoutEngine.getLayout();
        
        if (layout.length === 0) {
            container.innerHTML = '<p style="color: #999;">No furniture placed yet</p>';
            return;
        }
        
        let html = '<ul class="furniture-list">';
        let totalPrice = 0;
        
        layout.forEach((furniture, index) => {
            html += `<li>${furniture.name} - $${furniture.price || 'N/A'}</li>`;
            if (furniture.price) totalPrice += furniture.price;
        });
        
        html += '</ul>';
        html += `<div style="margin-top: 10px; font-weight: bold;">Total: $${totalPrice}</div>`;
        
        container.innerHTML = html;
    }
    
    updateDimensionsDisplay() {
        const display = document.getElementById('dimensionsInfo');
        if (this.currentRoom) {
            display.textContent = `Room: ${Math.floor(this.currentRoom.dimensions.width / 12)}'${this.currentRoom.dimensions.width % 12}" × ${Math.floor(this.currentRoom.dimensions.depth / 12)}'${this.currentRoom.dimensions.depth % 12}" | Grid: 1ft`;
        }
    }
    
    showDesignTips() {
        const tips = document.getElementById('designTips');
        
        const designTips = [
            'Leave at least 3 feet of walking space between furniture pieces',
            'Position seating 8-10 feet from TV for optimal viewing',
            'Use area rugs to define conversation areas',
            'Keep coffee tables 14-18 inches from sofas',
            'Ensure clear pathways to all exits and windows'
        ];
        
        let html = '';
        designTips.forEach(tip => {
            html += `<div class="tip">${tip}</div>`;
        });
        
        tips.innerHTML = html;
    }
    
    applyPresetLayout(presetId) {
        if (!this.currentRoom) return;
        
        // Clear existing furniture
        layoutEngine.clearLayout();
        
        // Apply the preset
        const result = layoutEngine.applyPresetLayout(presetId, this.currentRoom);
        
        if (result.success) {
            // Save the layout
            this.saveLayout();
            
            // Update UI
            this.selectedFurniture = null;
            this.redrawCanvas();
            this.updateSelectedFurnitureList();
            this.showDesignTips();
            
            // Show success message
            const info = document.getElementById('infoMessage');
            info.textContent = `Applied ${result.layoutName} layout successfully!`;
            info.style.display = 'block';
            setTimeout(() => { info.style.display = 'none'; }, 3000);
        } else {
            alert('Failed to apply preset layout: ' + result.error);
        }
    }
    
    saveLayout() {
        if (!this.currentRoom) return;
        
        // Get current furniture layout
        const layout = layoutEngine.getLayout();
        
        // Save to localStorage via floorPlanParser
        if (!floorPlanParser.customLayouts[this.currentRoom.id]) {
            floorPlanParser.customLayouts[this.currentRoom.id] = {};
        }
        
        floorPlanParser.customLayouts[this.currentRoom.id].furniture = layout;
        localStorage.setItem('customLayouts', JSON.stringify(floorPlanParser.customLayouts));
        
        // Show success message
        const info = document.getElementById('infoMessage');
        info.textContent = `Layout saved for ${this.currentRoom.name}!`;
        info.style.display = 'block';
        setTimeout(() => { info.style.display = 'none'; }, 3000);
    }
    
    exportDesign() {
        // Create a new canvas for export
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Set higher resolution for export
        const exportScale = 4;
        exportCanvas.width = this.canvas.width * exportScale / this.scale;
        exportCanvas.height = this.canvas.height * exportScale / this.scale;
        
        // Set white background
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // Draw at higher resolution
        const tempScale = this.scale;
        this.scale = exportScale;
        this.ctx = exportCtx;
        this.canvas = exportCanvas;
        
        this.redrawCanvas();
        
        // Add title and info
        exportCtx.fillStyle = '#333';
        exportCtx.font = 'bold 24px Arial';
        exportCtx.textAlign = 'left';
        exportCtx.fillText(this.currentRoom.name + ' - Furniture Layout', 20, 30);
        
        exportCtx.font = '16px Arial';
        exportCtx.fillText(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
        
        // Convert to image
        exportCanvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentRoom.name.replace(/\s+/g, '_')}_design_${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
        
        // Restore original canvas
        this.scale = tempScale;
        this.ctx = document.getElementById('floorPlanCanvas').getContext('2d');
        this.canvas = document.getElementById('floorPlanCanvas');
        this.redrawCanvas();
    }
    
    handleRightClick(e) {
        e.preventDefault();
        
        if (this.selectedFurniture) {
            // Rotate by 90 degrees
            const newRotation = (this.selectedFurniture.rotation + 90) % 360;
            this.selectedFurniture.rotation = newRotation;
            
            // Update rotation slider
            document.getElementById('rotationSlider').value = newRotation;
            document.getElementById('rotationValue').textContent = `${newRotation}°`;
            
            this.redrawCanvas();
        }
    }
    
    updateRoomDimensions() {
        const widthInput = document.getElementById('roomWidth');
        const depthInput = document.getElementById('roomDepth');
        
        if (!widthInput || !depthInput || !this.currentRoom) return;
        
        const newWidth = parseInt(widthInput.value);
        const newDepth = parseInt(depthInput.value);
        
        // Validate dimensions
        if (newWidth < 60 || newWidth > 600 || newDepth < 60 || newDepth > 600) {
            alert('Room dimensions must be between 60 and 600 inches (5 to 50 feet)');
            return;
        }
        
        // Update room dimensions
        this.currentRoom.dimensions.width = newWidth;
        this.currentRoom.dimensions.depth = newDepth;
        
        // Save to custom layouts
        if (!floorPlanParser.customLayouts[this.currentRoom.id]) {
            floorPlanParser.customLayouts[this.currentRoom.id] = {};
        }
        floorPlanParser.customLayouts[this.currentRoom.id].dimensions = {
            width: newWidth,
            depth: newDepth
        };
        
        // Save to localStorage
        localStorage.setItem('customLayouts', JSON.stringify(floorPlanParser.customLayouts));
        
        // Update canvas and redraw
        this.resizeCanvasToRoom();
        this.updateRoomInfo();
        this.redrawCanvas();
        
        // Show success message
        this.showInfoMessage('Room dimensions updated successfully!');
    }
    
    saveFeaturePosition() {
        if (!this.currentRoom || !this.selectedFeature) return;
        
        // Update the room's features
        const features = { ...this.currentRoom.features };
        
        // Save to localStorage via floorPlanParser
        if (!floorPlanParser.customLayouts[this.currentRoom.id]) {
            floorPlanParser.customLayouts[this.currentRoom.id] = {};
        }
        
        if (!floorPlanParser.customLayouts[this.currentRoom.id].features) {
            floorPlanParser.customLayouts[this.currentRoom.id].features = {};
        }
        
        floorPlanParser.customLayouts[this.currentRoom.id].features = features;
        localStorage.setItem('customLayouts', JSON.stringify(floorPlanParser.customLayouts));
    }
    
    showInfoMessage(message) {
        const infoMessage = document.getElementById('infoMessage');
        if (infoMessage) {
            infoMessage.textContent = message;
            infoMessage.style.display = 'block';
            setTimeout(() => {
                infoMessage.style.display = 'none';
            }, 3000);
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    const app = new FloorPlanDesigner();
    
    // Auto-select living room
    const selector = document.getElementById('roomSelector');
    console.log('Room selector element:', selector);
    console.log('Available rooms:', floorPlanParser.getAllRooms());
    
    if (selector) {
        selector.value = 'living-floor2';
        app.loadRoom('living-floor2');
    } else {
        console.error('Room selector not found!');
    }
});
