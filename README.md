# Waves Example

A lightweight WebGL demo that renders animated ocean waves with [three.js](https://threejs.org/). A custom vertex function displaces a plane geometry to mimic waves while a shader blends two textures for a simple curtain effect.

## Features

- Animated wave surface generated on the CPU in `app.js` via a configurable `updateWaves` function.
- Shader material that mixes two textures and colors the mesh using normals.
- Orbit controls for basic camera interaction.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   The example uses bare module imports, so it needs a dev server or bundler to resolve them. The project works out of the box with [Vite](https://vitejs.dev/):

   ```bash
   npx vite
   ```

   Open the printed URL (by default [http://localhost:5173](http://localhost:5173)) to view the demo.

## Project Structure

- `index.html` – loads `app.js` as an ES module.
- `app.js` – sets up the scene, wave animation, and shader material.
- `1.png`, `2.png`, `ocean.jpg` – texture assets.

## License

This example is provided for learning purposes. Feel free to adapt it for your own experiments.
