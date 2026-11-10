"""QA một tập Stick couple bằng GPT (codex exec), thang điểm riêng cho hoạt hình gag vẽ bằng code.

  python scripts/qa_couple.py ep05 [--video demo-project/out/stick-couple-ep05.mp4] [--effort high] [--o 30]

Dùng lại phần kỹ thuật/gọi Codex của muse-auto/qa.py (model và effort lấy từ muse-auto/config.json: gpt_model,
gpt_effort; --effort ghi đè). Kịch bản đưa cho GPT = bảng nhịp "## Tập N" trong content/stick-couple/README.md + thoại
trong content/stick-couple/epNN.json. Kết quả: demo-project/out/qa-epNN/ (sheet, qa.json, qa-report.md) — file trung
gian, xóa khi dọn rác sau tập (giữ lại báo cáo nếu cần thì chép ra content/).
"""
import argparse
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
MUSE = os.path.join(os.path.dirname(REPO), "muse-auto")
sys.path.insert(0, MUSE)
import qa  # noqa: E402

qa.TIEU_CHI = [
    ("kich_ban", "Bám kịch bản: đủ các nhịp đã duyệt, đúng thứ tự, đúng nội dung"),
    ("hai_huoc", "Gag: câu ghim gây tò mò, twist rõ ràng và buồn cười, nhịp dồn tới cú chốt không bị lê thê"),
    ("dien_xuat", "Diễn xuất: biểu cảm mặt và tư thế đọc được ngay (hoảng, ngượng, vô cảm...), hành động rõ ý"),
    ("loi_hinh", "Lỗi hình: tay chân gãy/xoắn, vật xuyên vật sai, đồ vật biến mất/xuất hiện vô lý, nhân vật trôi, giật"),
    ("nhat_quan", "Nhất quán: nhân vật, đồ cầm tay, vị trí và bối cảnh khớp giữa các góc máy"),
    ("bo_cuc", "Bố cục 9:16: góc máy/cận cảnh hợp lý, câu ghim và phụ đề không che mặt/hành động, đồ vật đủ to để nhìn"),
    ("thoai_phu_de", "Thoại và phụ đề: phụ đề khớp lời thoại, đúng người nói (miệng mấp máy), dễ đọc"),
]
qa.SO_O = 30


SERIES = "stick-couple"
INTRO = {
    "stick-couple": "Bạn là người kiểm duyệt chất lượng (QA) phim hoạt hình ngắn cho Reels/TikTok: một cặp đôi người que "
    "(đầu to, vẽ vector bằng code, không phải video AI quay thật) trong một tình huống hài có twist, thoại tiếng Anh, "
    "phụ đề từng cụm chữ, kết bằng thẻ 'HA HA HA'. Chấm khắt khe, công bằng.",
    "why-we-do": "Bạn là người kiểm duyệt chất lượng (QA) phim hoạt hình ngắn cho Reels/TikTok: một nhân vật solo (Benny, "
    "vẽ vector bằng code, đặt trên nền tranh phẳng) diễn một thói quen khó hiểu nhưng ai cũng làm, có twist. Gần như không "
    "thoại, KHÔNG có phụ đề (cố ý), không có thẻ cười; hài nhờ nét mặt, hành động, âm thanh. Tiêu chí 'thoai_phu_de' chỉ "
    "chấm: miệng mấp máy đúng lúc có tiếng nói. Chấm khắt khe, công bằng.",
}


def beats(ep):
    n = int(re.sub(r"\D", "", ep))
    md = open(os.path.join(REPO, "content", SERIES, "README.md"), encoding="utf-8").read()
    m = re.search(rf"^## Tập {n}:.*?(?=^## )", md, re.S | re.M)
    return m.group(0).strip() if m else ""


def dialogue(ep):
    with open(os.path.join(REPO, "demo-project", "src", SERIES, f"{ep}.json"), encoding="utf-8") as f:
        d = json.load(f)
    lines = [f"- {l.get('start', '?')}s {l['who']}: \"{l['text']}\"" for l in d["lines"]]
    return f"Câu ghim: {d.get('hook', '')}\nThoại (giây bắt đầu, người nói):\n" + "\n".join(lines)


def sheet(video, out, dur, n):
    cols = 6
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", video, "-vf",
                    f"fps={n / dur:.4f},scale=216:-1,tile={cols}x{(n + cols - 1) // cols}:padding=4:color=white",
                    "-frames:v", "1", out], check=True)


def prompt(sh, dur, n, ep):
    tc = "\n".join(f"- {k}: {d}" for k, d in qa.TIEU_CHI)
    return "\n\n".join([
        INTRO[SERIES],
        f"Ảnh '{os.path.basename(sh)}' là contact sheet của video: {n} khung hình đều nhau theo thời gian, đọc từ trái "
        f"sang phải, trên xuống dưới; video dài {dur:.1f}s (mỗi ô ~{dur / n:.2f}s).",
        "Kịch bản đã duyệt:\n" + beats(ep),
        dialogue(ep),
        "Chấm từng tiêu chí từ 1 đến 10 (10 = hoàn hảo, 5 = dùng được nhưng lỗi rõ, 1 = hỏng):", tc,
        "Trả lời DUY NHẤT một khối JSON hợp lệ, không thêm chữ nào khác, theo dạng:",
        '{"diem": {' + ", ".join(f'"{k}": 0' for k, _ in qa.TIEU_CHI) + '}, "nhan_xet": {"kich_ban": "...", "...": "..."}, '
        '"loi_cu_the": ["mô tả lỗi kèm ô số mấy / giây thứ mấy"], "sua_gi_truoc": ["việc nên sửa, quan trọng nhất trước"]}',
        "Viết nhận xét bằng tiếng Việt, ngắn gọn.",
    ])


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("ep", help="ep01, ep05...")
    ap.add_argument("--video")
    ap.add_argument("--series", default="stick-couple", choices=sorted(INTRO), help="series (thư mục trong content/)")
    ap.add_argument("--effort", help="ghi đè gpt_effort (low/medium/high)")
    ap.add_argument("--o", type=int, default=30, help="số ô trong contact sheet")
    a = ap.parse_args()
    qa.SO_O = a.o
    global SERIES
    SERIES = a.series
    if a.effort:
        qa.GPT_ARGS[-1] = f'model_reasoning_effort="{a.effort}"'
    video = os.path.abspath(a.video or os.path.join(REPO, "demo-project", "out", f"{SERIES}-{a.ep}.mp4"))
    work = os.path.join(REPO, "demo-project", "out", f"qa-{SERIES}-{a.ep}")
    os.makedirs(work, exist_ok=True)
    dur, checks = qa.ky_thuat(video)
    sh = os.path.join(work, "sheet-video.png")
    sheet(video, sh, dur, a.o)
    print(f"  GPT ({' '.join(qa.GPT_ARGS)}) đang chấm...")
    results = {}
    try:
        results["GPT"] = qa.ask_gpt(prompt(sh, dur, a.o, a.ep), [sh], work)
        print(f"  GPT: {results['GPT']['tong']}/100")
    except Exception as e:  # noqa: BLE001
        print(f"  GPT lỗi: {e}")
    with open(os.path.join(work, "qa.json"), "w", encoding="utf-8") as f:
        json.dump({"ky_thuat": checks, "ket_qua": results}, f, ensure_ascii=False, indent=1)
    avg, ket = qa.report(video, dur, checks, results, os.path.join(work, "qa-report.md"))
    print(f"QA: {avg:.0f}/100, {ket}. Báo cáo: {os.path.join(work, 'qa-report.md')}")


if __name__ == "__main__":
    main()
