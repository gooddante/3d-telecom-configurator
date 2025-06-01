# Fiber Optic Configurator - 3D Viewer

A 3D viewer application for fiber optic products using Three.js. The application allows users to view 3D models of different fiber optic products, configure their properties, and view technical specifications.

## Features

- **3D Model Viewer**: View detailed 3D models of fiber optic products
- **Product Selection**: Choose from a variety of fiber optic products organized by category
- **Technical Specifications**: View detailed technical specifications for each product
- **Product Properties Configuration**: Configure product properties such as color, material, and connector type
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Visual feedback during model loading with progress tracking

## Technologies Used

- **Three.js v0.159.0**: For 3D rendering
- **Vite v5.0.0**: For build tooling and development server
- **JavaScript**: For application logic
- **HTML/CSS**: For user interface
- **GLTF Pipeline**: For 3D model optimization

## Project Structure

- **src/**: Source code directory
  - **main.js**: Main application logic
  - **index.html**: Main HTML file
  - **modules/**: Core application modules
    - **scene.js**: Three.js scene setup
    - **camera.js**: Camera configuration
    - **renderer.js**: WebGL renderer setup
    - **light.js**: Lighting setup
    - **orbitControls.js**: Camera controls
    - **model.js**: Model loading and manipulation
    - **productLoader.js**: Product data loading and management
    - **uiManager.js**: User interface management
    - **urlManager.js**: URL parameter handling
    - **navigationBuilder.js**: Navigation menu construction
    - **animate.js**: Animation loop
  - **styles/**: CSS styles
    - **style.css**: Main styles
- **public/**: Static assets
- **assets/**: Contains 3D models and data files
  - **models.json**: Product data including specifications and configurable properties
  - **model*.glb**: 3D models of fiber optic products
- **scripts/**: Utility scripts
  - **compress-models.js**: Script for optimizing 3D models
  - **utils.js**: Utility functions
- **dist/**: Build output directory

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run deploy`: Deploy to GitHub Pages
- `npm run compress`: Optimize 3D models

## Usage

1. Select a product from the dropdown menu
2. View the 3D model in the viewer
3. Read the technical specifications in the specifications panel
4. Configure product properties in the properties panel
5. Use mouse/touch controls to rotate, pan, and zoom the 3D model

## Future Enhancements

- **Model Property Updates**: Implement more sophisticated model updating based on property changes
- **UI Enhancements**: Improve responsive design and add animations
- **Performance Optimization**: Implement model caching and optimize rendering
- **Export Functionality**: Allow users to export configuration data
- **Comparison Tool**: Compare multiple products side by side

## License

This project is licensed under the MIT License - see the LICENSE file for details. 