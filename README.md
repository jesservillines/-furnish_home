# Floor Plan Furniture Designer

A comprehensive web application for designing room layouts with Crate & Barrel furniture, featuring drag-and-drop functionality, preset layouts, and multi-floor support.

## Features

### Core Functionality
- **Room Selection**: Browse rooms across 3 floors with accurate dimensions from floor plans
- **Furniture Library**: Complete Crate & Barrel catalog with precise dimensions and prices
- **Drag & Drop**: Intuitive furniture placement with grid snapping (12-inch increments)
- **Collision Detection**: Smart validation prevents furniture overlap
- **Rotation Support**: Rotate furniture in 15-degree increments

### Advanced Features
- **Layer Management**: Send furniture to back/front for proper layering (e.g., rugs under tables)
- **Opacity Control**: Adjust furniture transparency (10-100%)
- **Floor View Mode**: See entire floor layout with all rooms and furniture
- **Persistent Storage**: Layouts saved to localStorage and persist between sessions
- **Dimension Editing**: Modify room dimensions (60-600 inches range)
- **Export Options**: Save designs as JSON or PNG

### Pre-designed Layouts
1. Modern Living Room
2. Cozy Traditional
3. Minimalist Design
4. Entertainment Focus

## Room Specifications

### Floor 1 (Lower/Garden Level)
- Sitting Room (north): 11'9" × 15'10"
- Bath: 5'3" × 6'5"
- Utility: 6'2" × 8'7"
- Laundry: 2'8" × 5'2"
- Sitting Room (south): 17'3" × 11'9"

### Floor 2 (Main/Entry Level)
- Living Room: 17'3" × 12'8" (with sliding glass door)
- Kitchen: 10'11" × 12'8"
- Foyer/Stair Landing: 6'0" × 13'0"

### Floor 3 (Upper)
- Primary Bedroom: 17'3" × 10'2"
- Bedroom 2: 14'2" × 9'5"
- Bath: 4'10" × 9'4"

## Technical Architecture

- `index.html` - Main application interface
- `main.js` - Core application logic and event handling
- `furniture-database.js` - Complete Crate & Barrel furniture catalog
- `floor-plan-parser.js` - Room definitions and layout management
- `layout-engine.js` - Furniture placement logic and validation
- `styles.css` - Application styling

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/jesservillines/-furnish_home.git
cd -furnish_home
```

2. Start a local server:
```bash
python -m http.server 8000
# or
npx http-server -p 8000
```

3. Open `http://localhost:8000` in your browser

## Deployment

### Netlify Deployment

This app is configured for easy deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. No build settings required - it's a static site
3. Deploy settings are pre-configured in `netlify.toml`

### Manual Deployment

The app can be deployed to any static hosting service:
- Upload all files to your web server
- No build process required
- No server-side dependencies

## Usage

1. **Select a Room**: Choose from the dropdown menu organized by floor
2. **Add Furniture**: 
   - Browse furniture categories
   - Drag items from the library onto the canvas
   - Or click "Add to Room" button
3. **Arrange Furniture**:
   - Click and drag to move
   - Use rotation controls or arrow keys
   - Adjust opacity and layering as needed
4. **Save Your Design**:
   - Click "Save Layout" to persist the current room
   - Use "Export Design" for JSON/PNG output

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for personal use.

## Credits

Furniture catalog based on Crate & Barrel products. Room dimensions from provided floor plans.
