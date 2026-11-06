"""Keep the last-slice placement and a clean full-tray view; omit repeated adjustments."""
from pathlib import Path
import subprocess


def main():
    ep = Path(__file__).resolve().parents[1] / 'ep01-tomato-slices'
    source = ep / 'video' / 'clip12-r2.mp4'
    target = ep / 'video' / 'clip12-r2-chon.mp4'
    filters = (
        '[0:v]split=2[x0][x1];[0:a]asplit=2[y0][y1];'
        '[x0]trim=0:0.9,setpts=PTS-STARTPTS[v0];'
        '[y0]atrim=0:0.9,asetpts=PTS-STARTPTS[a0];'
        '[x1]trim=5.2:6.2,setpts=PTS-STARTPTS[v1];'
        '[y1]atrim=5.2:6.2,asetpts=PTS-STARTPTS[a1];'
        '[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]'
    )
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
                    '-filter_complex', filters, '-map', '[v]', '-map', '[a]',
                    '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                    '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(target)],
                   check=True)
    print(target)


if __name__ == '__main__':
    main()
