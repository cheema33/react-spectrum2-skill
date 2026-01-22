#!/usr/bin/env node

/**
 * generate-s2-skill.mjs
 *
 * Updates reference documentation for React Spectrum S2 skill from upstream.
 *
 * DESCRIPTION:
 *   This script syncs the references/ folder with the latest React Spectrum S2
 *   documentation. It runs Adobe's markdown generator and copies the filtered
 *   output. SKILL.md is hand-maintained separately and NOT touched by this script.
 *
 * USAGE:
 *   From skill directory:
 *     node scripts/generate-s2-skill.mjs /path/to/react-spectrum
 *
 *   Custom output path:
 *     node scripts/generate-s2-skill.mjs /path/to/react-spectrum /output/skill/path
 *
 * ARGUMENTS:
 *   <repoPath>   Path to React Spectrum repository (REQUIRED)
 *   [outputPath] Path to skill directory (default: parent of scripts/)
 *
 * OUTPUT:
 *   Updates references/ folder with ~77 markdown files (66 components + 11 guides)
 *   Does NOT modify SKILL.md
 *
 * FEATURES:
 *   - Filters out release notes and version history
 *   - Consolidates component-specific testing into single guide
 *   - Only copies referenced documentation files
 *   - Preserves hand-crafted SKILL.md
 *
 * REQUIREMENTS:
 *   - Node.js 18.0 or higher
 *   - React Spectrum repository with yarn installed
 *   - Write permissions for output directory
 *
 * EXAMPLES:
 *   # Update references from local react-spectrum clone
 *   node scripts/generate-s2-skill.mjs ~/repos/react-spectrum
 *
 *   # Update references to a different skill location
 *   node scripts/generate-s2-skill.mjs ~/repos/react-spectrum ~/.claude/skills/react-spectrum-2
 *
 * VERSION: 2.0.0
 * UPDATED: 2026-01-22
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, '..');

// Parse command-line arguments
const repoPath = process.argv[2];
const outputPath = process.argv[3] || skillRoot;

if (!repoPath) {
  console.error('❌ Error: React Spectrum repository path is required');
  console.error('\nUsage: node scripts/generate-s2-skill.mjs <react-spectrum-path> [output-path]');
  console.error('\nExample: node scripts/generate-s2-skill.mjs ~/repos/react-spectrum');
  process.exit(1);
}

// Helper function to check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Helper function to prompt user for input
function promptUser(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// Helper function to parse llms.txt
function parseLlmsTxt(content) {
  const lines = content.split('\n');
  const entries = [];
  const seenFilenames = new Set();
  
  for (const line of lines) {
    // Parse markdown list format: - [Name](File.md): Description
    const match = line.match(/^\s*-\s*\[([^\]]+)\]\(([^)]+)\):\s*(.*)/);
    if (match) {
      const [, displayName, filepath, description] = match;
      // Extract just the filename without path
      const filename = path.basename(filepath);
      
      // Skip release notes
      if (filename.startsWith('v0-') || filename.startsWith('v1-') || 
          filepath.includes('releases/')) {
        continue;
      }
      
      // Skip component-specific testing pages (e.g., Menu/testing.md, CheckboxGroup/testing.md)
      // Keep only the main testing.md
      if (filepath.includes('/') && filename === 'testing.md') {
        continue;
      }
      
      // Skip duplicate filenames (keep first occurrence)
      if (seenFilenames.has(filename)) {
        continue;
      }
      seenFilenames.add(filename);
      
      // Special handling for testing.md - use clean title and description
      let finalDisplayName = displayName;
      let finalDescription = description.trim();
      if (filename === 'testing.md') {
        finalDisplayName = 'Testing';
        finalDescription = 'How to test an application built with React Spectrum using test utilities to simulate common user interactions';
      } else if (filename === 'getting-started.md') {
        finalDisplayName = 'Getting started';
        finalDescription = 'Learn how to install and set up React Spectrum S2 in your project with your preferred package manager and framework';
      }
      
      entries.push({
        name: filename.replace('.md', ''),
        filename,
        displayName: finalDisplayName,
        description: finalDescription
      });
    }
  }
  
  // Ensure testing.md is always included (in case it wasn't parsed correctly)
  if (!seenFilenames.has('testing.md')) {
    entries.push({
      name: 'testing',
      filename: 'testing.md',
      displayName: 'Testing',
      description: 'How to test an application built with React Spectrum using test utilities to simulate common user interactions'
    });
  }
  
  return entries;
}

async function main() {
  try {
    // Validate repo path
    const generateScript = path.join(repoPath, 
      'packages/dev/s2-docs/scripts/generateMarkdownDocs.mjs');
    
    if (!await fileExists(generateScript)) {
      console.error(`❌ Error: Cannot find generateMarkdownDocs.mjs at:`);
      console.error(`   ${generateScript}`);
      console.error(`\n   Make sure repoPath points to React Spectrum root directory.`);
      process.exit(1);
    }

    console.log('📦 Running generateMarkdownDocs.mjs...');
    console.log(`   From: ${repoPath}`);
    
    // Run the upstream script
    try {
      execSync(`yarn workspace @react-spectrum/s2-docs generate:md`, {
        cwd: repoPath,
        stdio: 'inherit'
      });
    } catch (error) {
      console.error(`❌ Error running generateMarkdownDocs.mjs`);
      console.error(error.message);
      process.exit(1);
    }

    // Prepare paths
    const sourceDir = path.join(repoPath, 'packages/dev/s2-docs/dist/s2');
    const referencesDir = path.join(outputPath, 'references');

    // Check if output directory exists
    if (await fileExists(sourceDir)) {
      console.log(`✓ Found generated files at: ${sourceDir}`);
    } else {
      console.error(`❌ Error: Could not find generated files at:`);
      console.error(`   ${sourceDir}`);
      process.exit(1);
    }

    // Check if references folder exists
    if (await fileExists(referencesDir)) {
      console.log(`\n⚠️  references/ folder exists at: ${referencesDir}`);
      const answer = await promptUser('Overwrite references/ folder? (yes/no): ');

      if (!['yes', 'y', 'YES', 'Yes'].includes(answer.trim())) {
        console.log('Cancelled. Existing references preserved.');
        process.exit(0);
      }

      console.log('Removing existing references...');
      await fs.rm(referencesDir, { recursive: true, force: true });
    }

    // Create references folder
    console.log(`\n📁 Creating references/ at: ${referencesDir}`);
    await fs.mkdir(referencesDir, { recursive: true });

    // Read llms.txt from source (don't copy it)
    console.log(`\n📋 Reading llms.txt...`);
    const sourceLlmsTxt = path.join(sourceDir, 'llms.txt');
    
    let llmsContent;
    try {
      llmsContent = await fs.readFile(sourceLlmsTxt, 'utf8');
    } catch (error) {
      console.error(`❌ Error reading llms.txt: ${error.message}`);
      process.exit(1);
    }

    // Parse llms.txt to get the list of files we need
    const entries = parseLlmsTxt(llmsContent);

    if (entries.length === 0) {
      console.warn(`⚠️  Warning: No entries parsed from llms.txt`);
    }

    // Copy only the files referenced in entries
    console.log(`\n📋 Copying ${entries.length} reference files...`);
    
    let copiedCount = 0;
    for (const entry of entries) {
      const srcFile = path.join(sourceDir, entry.filename);
      const dstFile = path.join(referencesDir, entry.filename);
      
      try {
        if (await fileExists(srcFile)) {
          await fs.copyFile(srcFile, dstFile);
          copiedCount++;
          process.stdout.write('.');
        } else {
          console.warn(`\n⚠️  Warning: File not found: ${entry.filename}`);
        }
      } catch (error) {
        console.error(`\n❌ Error copying ${entry.filename}: ${error.message}`);
        process.exit(1);
      }
    }
    console.log(`\n✓ Copied ${copiedCount} files`);

    // Success summary
    console.log(`\n✅ Success! references/ updated.`);
    console.log(`\n📊 Summary:`);
    console.log(`   Location: ${referencesDir}`);
    console.log(`   Files: ${copiedCount} references`);
    console.log(`   Components: ${entries.filter(e => /^[A-Z]/.test(e.name)).length}`);
    console.log(`   Guides: ${entries.filter(e => !/^[A-Z]/.test(e.name)).length}`);
    console.log(`\n📖 Note: SKILL.md is hand-maintained and was not modified.`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Unexpected error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
