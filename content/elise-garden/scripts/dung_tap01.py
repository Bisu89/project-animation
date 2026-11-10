"""Join reviewed Muse clips and add gardening time labels; no image/video generation."""
import argparse
import csv
import json
from pathlib import Path
import subprocess
import sys


def probe(path):
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(path)],
        capture_output=True, text=True, check=True)
    return json.loads(result.stdout)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--skip-join', action='store_true', help='Reuse an unchanged reviewed joined source')
    parser.add_argument('--csv', default='gen-video.csv')
    parser.add_argument('--out', default='final.mp4')
    args = parser.parse_args()
    series = Path(__file__).resolve().parents[1]
    ep = series / 'ep01-tomato-slices'
    tool = series.parents[1].parent / 'muse-auto'
    csv_path = ep / args.csv
    with csv_path.open(encoding='utf-8-sig', newline='') as f:
        rows = list(csv.DictReader(f))
    ids = [int(row['stt']) for row in rows]
    if not set(range(1, 12)).issubset(ids) or len(ids) != len(set(ids)):
        raise RuntimeError('Missing base scene or duplicate scene IDs')
    timeline, elapsed = [], 0.0
    for row in rows:
        path = ep / row['luu_tai'].replace('\\', '/')
        duration = float(probe(path)['format']['duration'])
        qa_path = path.with_suffix('.qa.json')
        qa = json.loads(qa_path.read_text(encoding='utf-8')) if qa_path.exists() else {}
        start = float(row['cat_tu'] or 0)
        cut = row['cat_den'] or qa.get('cat_den')
        end = min(duration, float(cut)) if cut else duration
        available = end - start
        if available <= 0:
            raise RuntimeError(f'Invalid cut for clip {row["stt"]}')
        length = min(float(row['dung_giay'] or available), available)
        if row['che_do'] != 'cat':
            raise RuntimeError('Review speed changes explicitly; this draft preserves source speed')
        timeline.append({'clip': int(row['stt']), 'start': elapsed,
                         'end': elapsed + length, 'source_start': start,
                         'source_end': start + length, 'name': row['doan']})
        elapsed += length
    final = ep / 'video' / args.out
    raw = ep / 'video' / ('final-nguyen-ban.mp4' if args.out == 'final.mp4' else final.stem + '-ghep.mp4')
    if not args.skip_join:
        subprocess.run([sys.executable, '-X', 'utf8', str(tool / 'ghep.py'),
                        '--csv', str(csv_path), '--out', str(raw), '--xfade', '0'], check=True)
    elif abs(float(probe(raw)['format']['duration']) - elapsed) > 0.25:
        raise RuntimeError('Cached join no longer matches the reviewed cut duration')
    by_id = {t['clip']: t for t in timeline}
    nursery_start = round(by_id[4]['start'] * 30)
    nursery_end = round(by_id[5]['end'] * 30) - 1
    close_start = round((by_id[11]['start'] + 3) * 30)
    nursery = f'between(on,{nursery_start},{nursery_end})'
    zoom = f'if({nursery},2,if(gte(on,{close_start}),1.08,1))'
    vertical = f'min(ih-ih/zoom,max(0,if({nursery},ih*0.64-ih/zoom/2,ih/2-ih/zoom/2)))'
    filters = [f"zoompan=z='{zoom}':x='iw/2-iw/zoom/2':y='{vertical}':d=1:s=1080x1920:fps=30"]
    font = 'C\\:/Windows/Fonts/arial.ttf'
    style = f"fontfile='{font}':fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=12"
    filters.append(f"drawtext={style}:text='AI garden visualization':fontsize=27:x=36:y=44")
    captions = [(4, 'Days later'), (5, 'Weeks later'), (9, 'Weeks later'),
                (10, 'Fruit setting'), (11, 'Ripening')]
    for clip, caption in captions:
        t = by_id[clip]
        stop = min(t['end'], t['start'] + 2.2)
        filters.append(f"drawtext={style}:text='{caption}':fontsize=38:x=(w-tw)/2:y=h-180:"
                       f"enable='between(t,{t['start']:.3f},{stop:.3f})'")
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(raw),
                    '-vf', ','.join(filters), '-map', '0:v:0', '-map', '0:a:0?',
                    '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                    '-af', 'volume=8dB,alimiter=limit=0.95', '-c:a', 'aac', '-b:a', '192k',
                    '-movflags', '+faststart', str(final)], check=True)
    info = probe(final)
    video = next(s for s in info['streams'] if s['codec_type'] == 'video')
    if (video['width'], video['height']) != (1080, 1920):
        raise RuntimeError('Unexpected final dimensions')
    if abs(float(info['format']['duration']) - elapsed) > 0.25:
        raise RuntimeError('Final duration differs from the reviewed timeline')
    timeline_name = 'timeline.json' if args.out == 'final.mp4' else final.stem + '-timeline.json'
    (ep / 'video' / timeline_name).write_text(
        json.dumps({'duration': elapsed, 'clips': timeline}, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8')
    print(f'Final: {final} ({elapsed:.2f}s, 1080x1920)', flush=True)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
