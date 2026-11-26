import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression } from '@gltf-transform/extensions';
import { meshopt, quantize, simplify, weld } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TMP_GLB = path.join(ROOT, '.tmp-glb');
const PUBLIC_MODELS = path.join(ROOT, 'public', 'models');
const STATS_PATH = path.join(ROOT, 'src', 'data', 'generatedModelStats.json');

const TARGET_TRIS = 85_000;

function countTriangles(doc) {
  let tris = 0;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      if (idx) {
        tris += idx.getCount() / 3;
      } else {
        const pos = prim.getAttribute('POSITION');
        if (pos) tris += pos.getCount() / 3;
      }
    }
  }
  return Math.round(tris);
}

async function main() {
  await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready, MeshoptSimplifier.ready]);
  await fs.mkdir(PUBLIC_MODELS, { recursive: true });

  const stats = JSON.parse(await fs.readFile(STATS_PATH, 'utf8'));
  const io = new NodeIO().registerExtensions([EXTMeshoptCompression]).registerDependencies({
    'meshopt.decoder': MeshoptDecoder,
    'meshopt.encoder': MeshoptEncoder,
  });

  const files = (await fs.readdir(TMP_GLB)).filter((f) => f.endsWith('.raw.glb')).sort();
  console.log(`=== Optimizing ${files.length} GLB models with meshoptimizer ===`);

  for (const file of files) {
    const slug = file.replace(/\.raw\.glb$/, '');
    const inPath = path.join(TMP_GLB, file);
    const outPath = path.join(PUBLIC_MODELS, `${slug}.glb`);

    const doc = await io.read(inPath);
    const inTris = countTriangles(doc);
    const ratio = Math.min(0.25, Math.max(0.03, TARGET_TRIS / Math.max(inTris, 1)));

    await doc.transform(
      weld({ tolerance: 0.0001 }),
      simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.003 }),
      quantize(),
      meshopt({ encoder: MeshoptEncoder, level: 'medium' })
    );

    const outTris = countTriangles(doc);
    await io.write(outPath, doc);

    const [inStat, outStat] = await Promise.all([fs.stat(inPath), fs.stat(outPath)]);
    const inMb = (inStat.size / 1e6).toFixed(2);
    const outMb = (outStat.size / 1e6).toFixed(2);

    if (stats[slug]) {
      stats[slug].webTriangles = outTris;
      stats[slug].glbSizeMb = Number(outMb);
    }

    console.log(
      `  [glb] ${slug.padEnd(16)} ${inTris.toLocaleString()} -> ${outTris.toLocaleString()} tris | ${inMb} MB -> ${outMb} MB`
    );
  }

  await fs.writeFile(STATS_PATH, JSON.stringify(stats, null, 2) + '\n', 'utf-8');
  await fs.rm(TMP_GLB, { recursive: true, force: true });
  console.log('Removed temporary .tmp-glb directory.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
