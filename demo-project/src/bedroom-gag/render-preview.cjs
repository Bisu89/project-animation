// Run from any directory: node demo-project/src/bedroom-gag/render-preview.cjs
const path = require('node:path');
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {bundle} = require('@remotion/bundler');
const {selectComposition, renderStill, renderMedia} = require('@remotion/renderer');

async function main() {
  const project = path.resolve(__dirname, '../..');
  const root = path.dirname(project);
  const output = path.join(root, 'renders/bedroom-gag');
  const publicDir = path.join(output, 'public');
  fs.mkdirSync(output, {recursive: true});
  execFileSync('python', [path.join(root, 'scripts/bedroom_export.py'), '--public-root', publicDir], {stdio: 'inherit'});
  fs.cpSync(path.join(project, 'public/bedroom-gag/ep01'), path.join(publicDir, 'bedroom-gag/ep01'), {recursive: true});
  const serveUrl = await bundle({entryPoint: path.join(__dirname, 'preview-entry.tsx'), rootDir: project, publicDir});
  const comparison = await selectComposition({serveUrl, id: 'BedroomModelComparison'});
  await renderStill({serveUrl, composition: comparison, output: path.join(output, 'model-comparison.png'), imageFormat: 'png'});
  console.log('Rendered model-comparison.png');
  const composition = await selectComposition({serveUrl, id: 'BedroomGagEp01'});
  // One sample from every shot, including all three lighting states.
  for (const frame of [30, 110, 148, 185, 225, 260, 330]) {
    await renderStill({serveUrl, composition, frame, scale: .5, imageFormat: 'png', output: path.join(output, `frame-${frame}.png`)});
    console.log(`Rendered frame-${frame}.png`);
  }
  if (!process.argv.includes('--stills')) {
    await renderMedia({serveUrl, composition, codec: 'h264', crf: 20, scale: .5, concurrency: 2, outputLocation: path.join(output, 'preview.mp4')});
    console.log('Rendered preview.mp4');
  }
  console.log(`Review files: ${output}`);
}
main().catch((error) => {console.error(error); process.exitCode = 1;});
