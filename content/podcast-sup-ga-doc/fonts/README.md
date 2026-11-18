# Font dùng khi render

Cả hai font từ Google Fonts, giấy phép SIL Open Font License 1.1 (dùng tự do, kể cả thương mại).
Tách từ bản variable bằng fontTools (`python -m fontTools.varLib.instancer <var.ttf> wght=<n> -o <out.ttf>`).

| File | Nguồn | Trọng lượng | Tên gọi trong ASS | Dùng cho |
|---|---|---|---|---|
| `Quicksand-Bold.ttf` | github.com/google/fonts `ofl/quicksand/Quicksand[wght].ttf` | 700 | `Quicksand Light` | phụ đề hiện dần từng chữ |
| `Baloo2-ExtraBold.ttf` | github.com/google/fonts `ofl/baloo2/Baloo2[wght].ttf` | 800 | `Baloo 2` | tiêu đề cute (tùy chọn, EP01 đã bỏ) |
