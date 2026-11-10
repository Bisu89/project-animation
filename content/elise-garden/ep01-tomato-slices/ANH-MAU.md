# Ảnh thành phẩm mẫu — Elise Garden tập 01

2026-11-04: chủ dự án yêu cầu “gen ảnh mẫu đi”. Phạm vi: tạo một ảnh thành phẩm để xem và chốt tạo hình; chưa chạy bộ ảnh thao tác hoặc Muse.

- Công cụ: built-in `image_gen`, có ảnh tham chiếu cục bộ, không dùng CLI/API key.
- Tham chiếu: `../../../output/elise-garden-analysis/reference-final.jpg`, khung 23,2 giây từ video chủ dự án gửi.
- Ảnh đã lưu: [anh/eg1-G-thanh-pham.png](anh/eg1-G-thanh-pham.png).
- Nội dung: chậu cà chua đất nung, giàn tre ba trụ, quả xanh–cam–đỏ, ngoài sân ban ngày, không người; ảnh dọc để làm chuẩn thành phẩm.
- Trạng thái: đã tạo và xem ảnh mẫu; chờ chủ dự án chốt tạo hình, chưa coi toàn bộ kịch bản đã được duyệt.
- QA bằng mắt: một chậu đất nung, cây cà chua với quả xanh–cam–đỏ, giàn tre, toàn bộ chậu và đỉnh giàn trong khung; ban ngày, không người, không chữ hoặc viền đen. Ảnh phù hợp để duyệt thành phẩm.

## Prompt gửi công cụ

```text
Use case: photorealistic-natural.
Asset type: finished-result reference photograph for Elise Garden episode 01, a vertical gardening reel.
Input image 1 is a subject, material and composition reference extracted from the user's source video, not an edit target. Generate a new high-quality photograph of the same kind of finished project.

Primary request: A beautiful but believable mature tomato plant bearing green, orange and ripe red tomatoes, growing in one large round unglazed terracotta pot, supported by a simple handmade bamboo frame on a sunny beige stone garden patio. No person.

Scene/backdrop: an intimate residential garden in daylight, beige weathered stone paving with visible joints, softly out-of-focus green garden foliage and a light natural-wood fence behind the plant. Keep the setting simple and suitable for recreating a continuous gardening tutorial.
Subject: one healthy compact tomato plant with natural serrated tomato leaves, branching stems, and several modest clusters of small-to-medium oval or gently rounded tomatoes at mixed ripeness. Use a restrained, plausible fruit load; fruits attach to visible stems and calyxes. Preserve the reference's terracotta pot, green foliage, mixed green-orange-red fruits and light tan bamboo materials.
Pot and support: a substantial approximately 20-litre terracotta planter with a thick rolled rim, dark moist potting mix visible below the foliage, and three straight bamboo uprights firmly embedded around its inner perimeter. Two simple triangular levels of horizontal bamboo crossbars connect those uprights, joined with natural brown twine. The support is structurally coherent, does not merge with plant stems, and stays a fixed shape. Single plant rooted in the center.
Style/medium: convincing natural garden photography, fine leaf veins, realistic tomato skin, slight terracotta weathering and mineral texture, subtle soil texture. Soft natural daylight, accurate colors, gentle background separation; not a glossy CGI render or an illustration.
Composition/framing: portrait 9:16, aim for 1080 x 1920 composition. A slightly elevated three-quarter front viewpoint, showing the entire pot including its base and the entire plant and bamboo frame including their top ends, with a little breathing room above and below. Plant and pot are the main subject and fill most of the frame. This is a locked-camera finished-project shot, readable on a phone.
Constraints: no people, no hands, no tools, no eggs, no egg carton, no extra pots in the foreground, no text or labels, no logos, no watermark, no black bars, no collage, no extra fruit floating or growing directly from bamboo, no excessive giant harvest, no overgrown jungle obscuring the pot. Opaque natural background.
```

