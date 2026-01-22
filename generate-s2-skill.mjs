#!/usr/bin/env node

/**
 * generate-s2-skill.mjs
 * 
 * Generates a token-optimized React Spectrum S2 skill package for LLM consumption.
 * 
 * DESCRIPTION:
 *   This script automates the creation of a comprehensive documentation skill for
 *   React Spectrum S2 components. It filters out unnecessary content (release notes,
 *   component-specific testing files) and generates a clean, token-efficient SKILL.md
 *   file optimized for AI agents.
 * 
 * USAGE:
 *   Default (uses current directory):
 *     node generate-s2-skill.mjs
 *
 *   Custom React Spectrum path:
 *     node generate-s2-skill.mjs /path/to/react-spectrum
 *
 *   Custom React Spectrum and output paths:
 *     node generate-s2-skill.mjs /path/to/react-spectrum /output/path
 * 
 * ARGUMENTS:
 *   [repoPath]   Path to React Spectrum repository (default: current directory)
 *   [outputPath] Path where s2-skill folder will be created (default: current directory)
 * 
 * OUTPUT:
 *   Creates s2-skill/ folder with:
 *   - SKILL.md: Token-optimized index of all components and guides
 *   - references/: 77 markdown files (66 components + 11 guides)
 * 
 * FEATURES:
 *   - Filters out release notes and version history
 *   - Consolidates component-specific testing into single guide
 *   - Token-efficient format (no redundant markdown links)
 *   - Only copies referenced documentation files
 *   - Interactive overwrite confirmation
 * 
 * REQUIREMENTS:
 *   - Node.js 18.0 or higher
 *   - React Spectrum repository with yarn installed
 *   - Write permissions for output directory
 * 
 * EXAMPLES:
 *   # Generate in current directory
 *   node generate-s2-skill.mjs
 *
 *   # Specify React Spectrum location
 *   node generate-s2-skill.mjs ~/repos/react-spectrum
 *
 *   # Custom output location
 *   node generate-s2-skill.mjs ~/repos/react-spectrum /tmp/output
 * 
 * VERSION: 1.0.0
 * UPDATED: 2026-01-22
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Parse command-line arguments
const repoPath = process.argv[2] || projectRoot;
const outputPath = process.argv[3] || projectRoot;

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

// Helper function to generate SKILL.md
function generateSkillMd(entries) {
  // Separate components from guides
  const components = entries.filter(e => /^[A-Z]/.test(e.name));
  const guides = entries.filter(e => !/^[A-Z]/.test(e.name));
  
  let md = `# React Spectrum S2 Agent Skill

This skill provides comprehensive documentation for React Spectrum S2 components. It includes complete API references, usage examples, prop documentation, and styling guides.

## How to Use

All component and guide documentation is included in the \`references/\` folder. Each file contains:
- Complete component description
- API/props reference
- Code examples
- Type signatures
- Styling information

Generated from the React Spectrum S2 source documentation.

---

## Components (${components.length})

`;

  for (const entry of components) {
    md += `${entry.filename}\n`;
    md += `${entry.description}\n\n`;
  }

  if (guides.length > 0) {
    md += `---\n\n## Guides & References (${guides.length})\n\n`;
    for (const entry of guides) {
      md += `${entry.filename}\n`;
      md += `${entry.description}\n\n`;
    }
  }

  return md;
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
    const skillPath = path.join(outputPath, 's2-skill');
    const sourceDir = path.join(repoPath, 'packages/dev/s2-docs/dist/s2');
    const referencesDir = path.join(skillPath, 'references');

    // Check if output directory exists
    if (await fileExists(sourceDir)) {
      console.log(`✓ Found generated files at: ${sourceDir}`);
    } else {
      console.error(`❌ Error: Could not find generated files at:`);
      console.error(`   ${sourceDir}`);
      process.exit(1);
    }

    // Check if s2-skill folder exists
    if (await fileExists(skillPath)) {
      console.log(`\n⚠️  s2-skill folder already exists at: ${skillPath}`);
      const answer = await promptUser('Overwrite s2-skill folder? (yes/no): ');
      
      if (!['yes', 'y', 'YES', 'Yes'].includes(answer.trim())) {
        console.log('Cancelled. Existing folder preserved.');
        process.exit(0);
      }
      
      console.log('Removing existing folder...');
      await fs.rm(skillPath, { recursive: true, force: true });
    }

    // Create folder structure
    console.log(`\n📁 Creating s2-skill structure at: ${skillPath}`);
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

    // Generate SKILL.md from parsed entries
    console.log(`\n🎯 Generating SKILL.md from llms.txt...`);

    const skillMd = generateSkillMd(entries);
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    
    try {
      await fs.writeFile(skillMdPath, skillMd, 'utf8');
      console.log(`✓ Generated SKILL.md with ${entries.length} entries`);
    } catch (error) {
      console.error(`❌ Error writing SKILL.md: ${error.message}`);
      process.exit(1);
    }

    // Success summary
    console.log(`\n✅ Success! s2-skill folder created.`);
    console.log(`\n📊 Summary:`);
    console.log(`   Location: ${skillPath}`);
    console.log(`   Files: ${copiedCount} references`);
    console.log(`   Components: ${entries.filter(e => /^[A-Z]/.test(e.name)).length}`);
    console.log(`   Guides: ${entries.filter(e => !/^[A-Z]/.test(e.name)).length}`);
    console.log(`\n📖 Next steps:`);
    console.log(`   1. Review: cat ${skillMdPath}`);
    console.log(`   2. Check references: ls ${referencesDir} | head -10`);
    console.log(`   3. Integrate: Copy s2-skill folder to your Amp skills directory`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Unexpected error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
