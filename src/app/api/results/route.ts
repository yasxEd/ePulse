import { NextResponse } from 'next/server';
import type { TypingResult } from '@/types';
import fs from 'fs';
import path from 'path';

// Optional: Save results to a JSON file if you're not using a real database
const DATA_PATH = path.join(process.cwd(), 'data');
const RESULTS_FILE = path.join(DATA_PATH, 'results.json');

// Ensure the data directory exists
try {
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH, { recursive: true });
  }
  
  // Create results file if it doesn't exist
  if (!fs.existsSync(RESULTS_FILE)) {
    fs.writeFileSync(RESULTS_FILE, JSON.stringify([]));
  }
} catch (error) {
  console.error('Error initializing data directory:', error);
}

export async function POST(request: Request) {
  try {
    const result: TypingResult = await request.json();
    
    // Validate the result data
    if (!result.id || typeof result.wpm !== 'number' || typeof result.accuracy !== 'number') {
      return NextResponse.json({ error: 'Invalid result data' }, { status: 400 });
    }
    
    // Ensure timestamp is present
    if (!result.timestamp) {
      result.timestamp = Date.now();
    }
    
    // Read existing results
    let results: TypingResult[] = [];
    try {
      const data = fs.readFileSync(RESULTS_FILE, 'utf8');
      results = JSON.parse(data);
    } catch (error) {
      console.error('Error reading results file:', error);
    }
    
    // Add new result
    results.push(result);
    
    // Save updated results
    try {
      fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    } catch (error) {
      console.error('Error writing results file:', error);
      return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error processing typing result:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    let results: TypingResult[] = [];
    
    // Read results file if it exists
    if (fs.existsSync(RESULTS_FILE)) {
      const data = fs.readFileSync(RESULTS_FILE, 'utf8');
      results = JSON.parse(data);
    }
    
    // Return results sorted by timestamp (most recent first)
    return NextResponse.json(
      results.sort((a, b) => b.timestamp - a.timestamp)
    );
  } catch (error) {
    console.error('Error retrieving typing results:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}