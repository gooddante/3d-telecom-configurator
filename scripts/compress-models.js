#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Try different import approaches for gltf-pipeline
let processGlb;
try {
    // Method 1: Direct require
    const gltfPipelineModule = require('gltf-pipeline');
    console.log('gltf-pipeline exports:', Object.keys(gltfPipelineModule));
    
    // Use processGlb for GLB files
    processGlb = gltfPipelineModule.processGlb;
    
    if (!processGlb || typeof processGlb !== 'function') {
        console.error('processGlb function not found in gltf-pipeline');
        process.exit(1);
    }
} catch (error) {
    console.error('Failed to import gltf-pipeline:', error.message);
    process.exit(1);
}

/**
 * Compress a GLB file with Draco compression
 * @param {string} inputPath - Path to input GLB file
 * @param {string} outputPath - Path to output compressed GLB file
 */
async function compressModel(inputPath, outputPath) {
    try {
        console.log(`🔄 Compressing: ${inputPath}`);
        
        // Read the input GLB file
        const glb = fs.readFileSync(inputPath);
        
        // Configure Draco compression options - using compressMeshes flag
        const options = {
            compressMeshes: true,
            dracoOptions: {
                compressionLevel: 7, // 0-10, higher = better compression but slower
                quantizePositionBits: 14, // Position quantization bits
                quantizeNormalBits: 10,   // Normal quantization bits  
                quantizeTexcoordBits: 12, // Texture coordinate quantization bits
                quantizeColorBits: 8,     // Color quantization bits
                quantizeGenericBits: 12,  // Generic attribute quantization bits
                unifiedQuantization: false // Use unified quantization
            }
        };
        
        // Get file sizes before compression
        const originalSize = fs.statSync(inputPath).size;
        
        // Compress the GLB using processGlb
        const results = await processGlb(glb, options);
        
        // Debug: Check what processGlb returns
        console.log('processGlb results type:', typeof results);
        console.log('processGlb results keys:', Object.keys(results || {}));
        
        // Write the compressed GLB - handle different return formats
        let outputBuffer;
        if (Buffer.isBuffer(results)) {
            outputBuffer = results;
        } else if (results && results.glb && Buffer.isBuffer(results.glb)) {
            outputBuffer = results.glb;
        } else if (results && Buffer.isBuffer(results.buffer)) {
            outputBuffer = results.buffer;
        } else {
            throw new Error('Unexpected return format from processGlb');
        }
        
        fs.writeFileSync(outputPath, outputBuffer);
        
        // Get file sizes after compression
        const compressedSize = fs.statSync(outputPath).size;
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ Compressed: ${path.basename(inputPath)}`);
        console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Saved: ${compressionRatio}% (${((originalSize - compressedSize) / 1024 / 1024).toFixed(2)} MB)`);
        console.log('');
        
        return {
            originalSize,
            compressedSize,
            compressionRatio: parseFloat(compressionRatio)
        };
        
    } catch (error) {
        console.error(`❌ Error compressing ${inputPath}:`, error.message);
        throw error;
    }
}

/**
 * Compress all GLB files in the assets directory
 */
async function compressAllModels() {
    const assetsDir = path.join(__dirname, '..', 'assets');
    const compressedDir = path.join(assetsDir, 'compressed');
    
    // Create compressed directory if it doesn't exist
    if (!fs.existsSync(compressedDir)) {
        fs.mkdirSync(compressedDir);
        console.log(`📁 Created directory: ${compressedDir}`);
    }
    
    // Get all GLB files
    const files = fs.readdirSync(assetsDir)
        .filter(file => file.endsWith('.glb'))
        .filter(file => !file.includes('compressed')); // Skip already compressed files
    
    if (files.length === 0) {
        console.log('❌ No GLB files found in assets directory');
        return;
    }
    
    console.log(`🚀 Found ${files.length} GLB files to compress`);
    console.log('==========================================');
    
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    const results = [];
    
    // Compress each file
    for (const file of files) {
        const inputPath = path.join(assetsDir, file);
        const outputPath = path.join(compressedDir, file);
        
        try {
            const result = await compressModel(inputPath, outputPath);
            results.push({ file, ...result });
            totalOriginalSize += result.originalSize;
            totalCompressedSize += result.compressedSize;
        } catch (error) {
            console.error(`Failed to compress ${file}`);
        }
    }
    
    // Summary
    const totalCompressionRatio = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
    
    console.log('==========================================');
    console.log('📊 COMPRESSION SUMMARY');
    console.log('==========================================');
    console.log(`Total Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total Compressed Size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total Space Saved: ${totalCompressionRatio}% (${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)} MB)`);
    console.log('');
    
    // Best compression results
    const bestResult = results.sort((a, b) => b.compressionRatio - a.compressionRatio)[0];
    if (bestResult) {
        console.log(`🏆 Best Compression: ${bestResult.file} (${bestResult.compressionRatio}% reduction)`);
    }
}

// Run the script
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 2) {
        // Compress single file
        compressModel(args[0], args[1])
            .then(() => console.log('✅ Compression complete'))
            .catch(error => {
                console.error('❌ Compression failed:', error.message);
                process.exit(1);
            });
    } else {
        // Compress all files
        compressAllModels()
            .then(() => console.log('✅ All compressions complete'))
            .catch(error => {
                console.error('❌ Compression failed:', error.message);
                process.exit(1);
            });
    }
}

module.exports = { compressModel, compressAllModels }; 