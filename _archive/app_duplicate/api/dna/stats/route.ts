import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface StatsPayload {
  project: string;
  lastSync: string;
  etymologies: {
    bridgeCount: number;
    databaseCount: number;
    total: number;
    rootDistribution: Record<string, number>;
    confidenceBuckets: Record<string, number>;
  };
  ibdalRules: {
    total: number;
    keyFinding: string;
    distanceDistribution: Record<string, number>;
  };
  letters: {
    total: number;
    cnnConfirmed: number;
    cnnAccuracy: string;
  };
  datasetStats: {
    totalFiles: number;
    totalSizeBytes: number;
  };
}

export async function GET() {
  const dataDir = path.join(process.cwd(), 'data');

  async function loadJSON(file: string) {
    try {
      const raw = await fs.readFile(path.join(dataDir, file), 'utf-8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  const [etymologies, ibdalRules, letters, rootPatterns] = await Promise.all([
    loadJSON('etymologies.json'),
    loadJSON('ibdalRules.json'),
    loadJSON('letters.json'),
    loadJSON('rootPatterns.json'),
  ]);

  // Root distribution from the database section
  const rootDistribution: Record<string, number> = {};
  if (etymologies?.database) {
    for (const entry of etymologies.database) {
      const r = entry.root || 'UNKNOWN';
      rootDistribution[r] = (rootDistribution[r] || 0) + 1;
    }
  }

  // Confidence buckets from bridge
  const confidenceBuckets: Record<string, number> = {};
  if (etymologies?.bridge) {
    for (const entry of etymologies.bridge) {
      const c = entry.confidence || 'Unknown';
      confidenceBuckets[c] = (confidenceBuckets[c] || 0) + 1;
    }
  }

  // Ibdal distance distribution
  const distanceDist: Record<string, number> = {};
  if (ibdalRules?.rules) {
    for (const rule of ibdalRules.rules) {
      const d = rule.makhrajDistance || 'unknown';
      distanceDist[d] = (distanceDist[d] || 0) + 1;
    }
  }

  // CNN confirmed letters
  let cnnConfirmedCount = 0;
  let letterTotal = 0;
  if (letters?.letters) {
    letterTotal = letters.letters.length;
    for (const l of letters.letters) {
      if (l.dna?.cnnConfirmed) cnnConfirmedCount++;
    }
  }

  // Total file sizes
  const dataFiles = ['etymologies.json', 'ibdalRules.json', 'letters.json', 'rootPatterns.json', 'supabase-export.json'];
  let totalBytes = 0;
  let filesFound = 0;
  for (const file of dataFiles) {
    try {
      const stat = await fs.stat(path.join(dataDir, file));
      totalBytes += stat.size;
      filesFound++;
    } catch {
      // File may not exist
    }
  }

  const payload: StatsPayload = {
    project: 'ATUM — The Root of All Words',
    lastSync: etymologies?.meta?.lastSync || 'unknown',
    etymologies: {
      bridgeCount: etymologies?.meta?.bridgeCount || 0,
      databaseCount: etymologies?.meta?.databaseCount || 0,
      total: etymologies?.meta?.total || 0,
      rootDistribution,
      confidenceBuckets,
    },
    ibdalRules: {
      total: ibdalRules?.meta?.total || 0,
      keyFinding: ibdalRules?.meta?.keyFinding || '',
      distanceDistribution: distanceDist,
    },
    letters: {
      total: letterTotal,
      cnnConfirmed: cnnConfirmedCount,
      cnnAccuracy: '99.7%',
    },
    datasetStats: {
      totalFiles: filesFound,
      totalSizeBytes: totalBytes,
    },
  };

  return NextResponse.json({
    success: true,
    ...payload,
  });
}
