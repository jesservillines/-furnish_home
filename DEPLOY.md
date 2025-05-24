# Deployment Instructions

## Netlify Deployment (Recommended)

1. **Connect Repository**
   - Log in to [Netlify](https://www.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize access
   - Select the repository: `jesservillines/-furnish_home`

2. **Configure Build Settings**
   - Build command: Leave empty (no build required)
   - Publish directory: `.` (root directory)
   - All other settings are configured in `netlify.toml`

3. **Deploy**
   - Click "Deploy site"
   - Your site will be live at a Netlify URL
   - You can add a custom domain later if desired

## Features Configured for Netlify

- **netlify.toml**: Contains all deployment configuration
- **_redirects**: Handles routing for single-page app behavior
- **Headers**: Security headers and CORS configured
- **No build process**: Site deploys instantly

## Post-Deployment

1. Test all functionality:
   - Room selector
   - Furniture drag & drop
   - Layout saving
   - Export features

2. Optional enhancements:
   - Add custom domain
   - Enable Netlify Forms (if adding contact form)
   - Set up deployment notifications

## Environment Variables

No environment variables are required for this application.

## Troubleshooting

If the site doesn't load properly:
1. Check browser console for errors
2. Verify all files were uploaded
3. Clear browser cache
4. Check Netlify deploy logs
