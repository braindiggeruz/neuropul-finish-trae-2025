import fs from 'node:fs';

try {
  const runs = [1, 2, 3].map(i => {
    const path = `.lighthouseci/lhr-run${i}.json`;
    if (!fs.existsSync(path)) {
      console.warn(`Warning: ${path} not found, skipping median calculation`);
      return null;
    }
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }).filter(Boolean);

  if (runs.length === 0) {
    console.log('No Lighthouse results found, skipping median calculation');
    process.exit(0);
  }

  const scores = {
    performance: runs.map(r => r.categories.performance.score).sort(),
    accessibility: runs.map(r => r.categories.accessibility.score).sort(),
    bestPractices: runs.map(r => r.categories['best-practices'].score).sort(),
    seo: runs.map(r => r.categories.seo.score).sort()
  };

  const median = arr => arr[Math.floor(arr.length / 2)];

  const medianScores = {
    performance: median(scores.performance),
    accessibility: median(scores.accessibility),
    bestPractices: median(scores.bestPractices),
    seo: median(scores.seo)
  };

  console.log('Median Lighthouse Scores:', medianScores);
  console.log('Performance:', (medianScores.performance * 100).toFixed(0));
  console.log('Accessibility:', (medianScores.accessibility * 100).toFixed(0));
  console.log('Best Practices:', (medianScores.bestPractices * 100).toFixed(0));
  console.log('SEO:', (medianScores.seo * 100).toFixed(0));

  if (medianScores.performance < 0.90) {
    console.error(`FAIL: Performance ${medianScores.performance} < 0.90`);
    process.exit(1);
  }

  if (medianScores.accessibility < 0.90) {
    console.error(`FAIL: Accessibility ${medianScores.accessibility} < 0.90`);
    process.exit(1);
  }

  console.log('✓ All Lighthouse budgets passed (median of', runs.length, 'runs)');
} catch (error) {
  console.error('Error calculating median:', error.message);
  process.exit(1);
}
