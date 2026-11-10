"""Run the existing Muse tool for Garden; optionally send its verified pending clip 3."""
import argparse
import json
from pathlib import Path
import sys


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--resume-pending-3', action='store_true')
    parser.add_argument('--csv', default='gen-video.csv')
    parser.add_argument('--only', nargs='*')
    args = parser.parse_args()
    series = Path(__file__).resolve().parents[1]
    workspace = series.parents[1]
    tool = workspace.parent / 'muse-auto'
    sys.path.insert(0, str(tool))
    import muse_auto as muse
    from playwright.sync_api import sync_playwright

    chat = json.loads((series / 'muse-chat.json').read_text(encoding='utf-8'))
    if chat['profile'] != 'chrome-profile-4' or int(chat['port']) != 9337:
        raise RuntimeError('Unexpected Garden profile; stopping before browser access')
    muse.BROWSER = 'chrome'
    muse.use_series_profile(chat)
    cfg = muse.load_config()
    cfg['upload_wait_ms'] = max(int(cfg.get('upload_wait_ms', 8000)), 20000)
    csv_path = str(series / 'ep01-tomato-slices' / args.csv)
    if args.resume_pending_3:
        with sync_playwright() as p:
            browser = p.chromium.connect_over_cdp('http://127.0.0.1:9337')
            page = next(pg for ctx in browser.contexts for pg in ctx.pages
                        if pg.url.startswith(chat['url']))
            box = page.locator(cfg['selectors']['message'])
            pending = box.input_value()
            expected = ('eg1-B2-phu-dat.png', 'eg1-B3-tuoi-khay.png', '#job-')
            if not all(part in pending for part in expected):
                raise RuntimeError('Composer is not the verified pending clip 3; no message sent')
            page.get_by_role('button', name='Send', exact=True).click()
            for _ in range(15):
                page.wait_for_timeout(1000)
                if not box.input_value().strip():
                    print('Sent the existing pending clip 3 once via Send button', flush=True)
                    break
            else:
                raise RuntimeError('Pending clip 3 still in composer; stopping without retry')
        muse.cmd_run(cfg, csv_path, ['3'], False, False, None, chi_tai=True)
    muse.cmd_run(cfg, csv_path, args.only, False, False, None)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
