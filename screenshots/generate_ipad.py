#!/usr/bin/env python3
"""Generate iPad 13" App Store screenshots (2048 x 2732px)"""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 2048, 2732
OUT = os.path.dirname(os.path.abspath(__file__)) + "/ipad"
os.makedirs(OUT, exist_ok=True)

# AiWave dark theme colors
BG = (13, 15, 28)
CARD = (22, 24, 40)
SURFACE = (30, 32, 50)
PRIMARY = (108, 92, 231)   # purple
SECONDARY = (247, 84, 30)  # orange
ACCENT = (175, 21, 195)    # magenta
GOLD = (253, 151, 7)
SUCCESS = (34, 197, 94)
WHITE = (255, 255, 255)
TEXT_SEC = (156, 163, 175)
TEXT_TERT = (107, 114, 128)
BORDER = (45, 48, 65)

def try_font(size):
    paths = [
        "/var/www/mobile-app/AiMarketingtool-pro/src/assets/fonts/Poppins-SemiBold.ttf",
        "/var/www/mobile-app/AiMarketingtool-pro/src/assets/fonts/Poppins-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def try_font_regular(size):
    paths = [
        "/var/www/mobile-app/AiMarketingtool-pro/src/assets/fonts/Poppins-Regular.ttf",
        "/var/www/mobile-app/AiMarketingtool-pro/src/assets/fonts/Poppins-Medium.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def rounded_rect(draw, xy, fill, radius=20):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)

def gradient_rect(img, xy, color1, color2, vertical=True):
    x1, y1, x2, y2 = xy
    draw = ImageDraw.Draw(img)
    if vertical:
        for y in range(y1, y2):
            ratio = (y - y1) / max(1, y2 - y1)
            r = int(color1[0] + (color2[0] - color1[0]) * ratio)
            g = int(color1[1] + (color2[1] - color1[1]) * ratio)
            b = int(color1[2] + (color2[2] - color1[2]) * ratio)
            draw.line([(x1, y), (x2, y)], fill=(r, g, b))
    else:
        for x in range(x1, x2):
            ratio = (x - x1) / max(1, x2 - x1)
            r = int(color1[0] + (color2[0] - color1[0]) * ratio)
            g = int(color1[1] + (color2[1] - color1[1]) * ratio)
            b = int(color1[2] + (color2[2] - color1[2]) * ratio)
            draw.line([(x, y1), (x, y2)], fill=(r, g, b))

def draw_status_bar(draw, y=60):
    font_sm = try_font(28)
    draw.text((80, y), "9:41", fill=WHITE, font=font_sm)
    # Battery icon
    draw.rounded_rectangle((W-180, y+2, W-100, y+24), radius=4, fill=None, outline=WHITE, width=2)
    draw.rectangle((W-140, y+6, W-110, y+20), fill=SUCCESS)

def draw_tab_bar(draw, active=0):
    y = H - 140
    draw.rectangle((0, y, W, H), fill=(18, 20, 35))
    draw.line([(0, y), (W, y)], fill=BORDER, width=2)
    tabs = ["Home", "Tools", "AI Chat", "History", "Profile"]
    icons = ["H", "T", "C", "Hi", "P"]
    tab_w = W // 5
    for i, (tab, icon) in enumerate(zip(tabs, icons)):
        cx = tab_w * i + tab_w // 2
        color = SECONDARY if i == active else TEXT_TERT
        font_icon = try_font(36)
        font_label = try_font_regular(24)
        draw.text((cx - 10, y + 25), icon, fill=color, font=font_icon)
        bbox = draw.textbbox((0, 0), tab, font=font_label)
        tw = bbox[2] - bbox[0]
        draw.text((cx - tw//2, y + 75), tab, fill=color, font=font_label)

# ============================================================
# SCREENSHOT 1: Dashboard / Home
# ============================================================
def screen_dashboard():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Status bar
    draw_status_bar(draw)

    # Header
    font_h1 = try_font(52)
    font_h2 = try_font(36)
    font_body = try_font_regular(32)
    font_sm = try_font_regular(26)
    font_badge = try_font(22)

    # Avatar + greeting
    draw.ellipse((80, 130, 180, 230), fill=PRIMARY)
    draw.text((110, 150), "L", fill=WHITE, font=try_font(48))
    draw.text((210, 140), "Hi, Lokendra", fill=WHITE, font=font_h1)
    draw.text((210, 200), "Welcome back", fill=TEXT_SEC, font=font_body)

    # Notification bell
    draw.ellipse((W-160, 140, W-80, 220), fill=SURFACE)
    draw.ellipse((W-108, 148, W-100, 156), fill=SECONDARY)

    # Hero banner
    gradient_rect(img, (80, 280, W-80, 560), (40, 30, 80), (20, 15, 45))
    # LIVE badge
    rounded_rect(draw, (W-260, 300, W-140, 340), (34, 197, 94, 50), radius=12)
    draw.text((W-248, 305), "LIVE", fill=SUCCESS, font=font_badge)
    draw.text((120, 420), "AI Marketing Assistant", fill=WHITE, font=try_font(48))
    draw.text((120, 480), "Create ads, blogs, emails & more with 206+ AI tools", fill=TEXT_SEC, font=font_sm)
    # Button
    rounded_rect(draw, (120, 520, 380, 555), SECONDARY, radius=12)
    draw.text((140, 524), "Start Creating  ->", fill=WHITE, font=font_badge)

    # Upgrade banner
    gradient_rect(img, (80, 600, W-80, 700), (61, 41, 20), (22, 19, 43))
    draw.text((160, 630), "Upgrade to Pro", fill=GOLD, font=font_h2)
    draw.text((160, 670), "Unlock all AI tools & features", fill=TEXT_SEC, font=font_sm)

    # Stats grid (4 cards)
    stats = [
        ("206+", "AI Tools", SECONDARY, "+12 new"),
        ("48", "Generated", SUCCESS, "Active"),
        ("12", "Campaigns", ACCENT, "12 tools"),
        ("48", "Saved", GOLD, "Saved"),
    ]
    card_w = (W - 80*2 - 30*3) // 4
    for i, (val, label, color, badge) in enumerate(stats):
        x = 80 + i * (card_w + 30)
        rounded_rect(draw, (x, 740, x+card_w, 940), CARD, radius=16)
        # Icon circle
        draw.ellipse((x+card_w//2-30, 760, x+card_w//2+30, 820), fill=(*color, 40))
        draw.text((x+card_w//2-30, 830), val, fill=WHITE, font=try_font(40))
        draw.text((x+20, 880), label, fill=TEXT_SEC, font=font_sm)
        # Badge
        rounded_rect(draw, (x+20, 910, x+card_w-20, 932), (*color, 30), radius=8)
        draw.text((x+30, 912), badge, fill=color, font=try_font(18))

    # Quick Actions header
    draw.text((80, 980), "Quick Actions", fill=WHITE, font=font_h2)

    actions = [("AI Chat", ACCENT), ("Meme Gen", SECONDARY), ("All Tools", SUCCESS), ("Reports", GOLD)]
    action_w = (W - 160 - 90) // 4
    for i, (name, color) in enumerate(actions):
        x = 80 + i * (action_w + 30)
        rounded_rect(draw, (x, 1040, x+action_w, 1130), (*color, 25), radius=16)
        draw.text((x+20, 1070), name, fill=TEXT_SEC, font=font_sm)

    # Categories header
    draw.text((80, 1180), "Categories", fill=WHITE, font=font_h2)
    draw.text((W-200, 1185), "See all", fill=SECONDARY, font=font_sm)

    # Category cards (horizontal)
    cats = [
        ("Google Ads", (66, 133, 244), "56 tools"),
        ("Facebook", (24, 119, 242), "61 tools"),
        ("Instagram", (228, 64, 95), "10 tools"),
        ("Content", (124, 58, 237), "22 tools"),
    ]
    cat_w = 320
    for i, (name, color, count) in enumerate(cats):
        x = 80 + i * (cat_w + 20)
        gradient_rect(img, (x, 1240, x+cat_w, 1520), (*color, ), tuple(max(0, c-60) for c in color))
        # Glass effect
        draw.rounded_rectangle((x, 1240, x+cat_w, 1520), radius=24, outline=(*color, 80), width=2)
        draw.text((x+24, 1430), name, fill=WHITE, font=font_h2)
        rounded_rect(draw, (x+24, 1475, x+160, 1505), (255, 255, 255, 40), radius=12)
        draw.text((x+34, 1478), count, fill=WHITE, font=font_sm)

    # Popular Tools header
    draw.text((80, 1560), "Popular Tools", fill=WHITE, font=font_h2)
    draw.text((W-200, 1565), "See all", fill=SECONDARY, font=font_sm)

    # Popular tools list
    tools = [
        ("Instagram Caption", "22k uses", True),
        ("Facebook Ad Copy", "18.5k uses", True),
        ("Product Description", "16.8k uses", True),
        ("Instagram Reels Script", "15.6k uses", True),
        ("Google Ads Headline", "15.2k uses", True),
        ("Meme Generator", "28.5k uses", True),
    ]
    rounded_rect(draw, (80, 1620, W-80, 2420), CARD, radius=20)
    for i, (name, uses, trending) in enumerate(tools):
        y = 1640 + i * 130
        # Icon
        rounded_rect(draw, (120, y+10, 180, y+70), (*SECONDARY, 25), radius=10)
        draw.text((210, y+12), name, fill=WHITE, font=font_body)
        if trending:
            draw.text((210, y+50), uses, fill=TEXT_SEC, font=font_sm)
            # Trending badge
            rounded_rect(draw, (210 + len(uses)*14, y+50, 210 + len(uses)*14 + 30, y+74), (*SUCCESS, 30), radius=4)
        draw.text((W-160, y+30), ">", fill=TEXT_TERT, font=font_h2)
        if i < len(tools) - 1:
            draw.line([(120, y+110), (W-120, y+110)], fill=BORDER, width=1)

    # Tab bar
    draw_tab_bar(draw, active=0)

    img.save(f"{OUT}/01_dashboard.png", "PNG")
    print("  01_dashboard.png")

# ============================================================
# SCREENSHOT 2: Tools Screen
# ============================================================
def screen_tools():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)

    font_h1 = try_font(52)
    font_h2 = try_font(36)
    font_body = try_font_regular(32)
    font_sm = try_font_regular(26)
    font_badge = try_font(22)

    # Header
    draw.text((80, 130), "AI Marketing Tools", fill=WHITE, font=font_h1)
    draw.text((80, 195), "206+ tools to grow your business", fill=TEXT_SEC, font=font_body)

    # Search bar
    rounded_rect(draw, (80, 260, W-80, 340), SURFACE, radius=16)
    draw.rounded_rectangle((80, 260, W-80, 340), radius=16, outline=BORDER, width=2)
    draw.text((130, 280), "Search tools...", fill=TEXT_TERT, font=font_body)

    # Platform filters
    platforms = [("All", True), ("Google", False), ("Meta", False), ("Shopify", False), ("Content", False)]
    x = 80
    for name, active in platforms:
        pw = len(name) * 24 + 50
        if active:
            rounded_rect(draw, (x, 370, x+pw, 420), PRIMARY, radius=20)
            draw.text((x+25, 378), name, fill=WHITE, font=font_sm)
        else:
            draw.rounded_rectangle((x, 370, x+pw, 420), radius=20, outline=BORDER, width=2)
            draw.text((x+25, 378), name, fill=TEXT_SEC, font=font_sm)
        x += pw + 16

    # Tools grid (2 columns)
    tools_data = [
        ("Google Ads Bid\nOptimization", "google-ads", SECONDARY, True, False, "15.2k", "4.8"),
        ("Facebook Ad\nCopy Generator", "facebook-ads", (24, 119, 242), False, True, "18.5k", "4.9"),
        ("Instagram Caption\nGenerator", "instagram", (228, 64, 95), True, True, "22k", "4.9"),
        ("SEO Keyword\nResearch", "google-seo", (52, 168, 83), False, False, "12.1k", "4.7"),
        ("Product Description\nWriter", "shopify", SUCCESS, True, False, "16.8k", "4.8"),
        ("Email Subject\nLine Generator", "email", (255, 107, 107), False, True, "13.5k", "4.6"),
        ("Blog Post\nWriter", "content", ACCENT, True, False, "14.2k", "4.7"),
        ("LinkedIn Ad\nCopy Generator", "linkedin", (0, 119, 181), False, False, "8.9k", "4.5"),
    ]

    col_w = (W - 80*2 - 30) // 2
    for i, (name, cat, color, is_new, is_pro, uses, rating) in enumerate(tools_data):
        col = i % 2
        row = i // 2
        x = 80 + col * (col_w + 30)
        y = 460 + row * 480

        # Card
        rounded_rect(draw, (x, y, x+col_w, y+450), CARD, radius=20)
        draw.rounded_rectangle((x, y, x+col_w, y+450), radius=20, outline=BORDER, width=1)

        # Icon area
        rounded_rect(draw, (x+30, y+30, x+100, y+100), (*color, 40), radius=14)

        # Badges
        badge_x = x + 120
        if is_new:
            rounded_rect(draw, (badge_x, y+35, badge_x+70, y+62), SUCCESS, radius=6)
            draw.text((badge_x+8, y+38), "NEW", fill=WHITE, font=font_badge)
            badge_x += 80
        if is_pro:
            rounded_rect(draw, (badge_x, y+35, badge_x+65, y+62), ACCENT, radius=6)
            draw.text((badge_x+8, y+38), "PRO", fill=WHITE, font=font_badge)

        # Name
        lines = name.split("\n")
        for j, line in enumerate(lines):
            draw.text((x+30, y+120 + j*42), line, fill=WHITE, font=font_h2)

        # Category
        draw.text((x+30, y+240), cat.replace("-", " ").title(), fill=TEXT_SEC, font=font_sm)

        # Stats row
        draw.text((x+30, y+300), f"{uses} uses", fill=TEXT_SEC, font=font_sm)
        draw.text((x+30, y+340), f"* {rating}", fill=GOLD, font=font_sm)

        # Status dot
        draw.ellipse((x+col_w-60, y+350, x+col_w-40, y+370), fill=SUCCESS)

        # Bottom gradient line
        gradient_rect(img, (x+2, y+430, x+col_w-2, y+448), color, (*[min(255, c+40) for c in color],))

    draw_tab_bar(draw, active=1)
    img.save(f"{OUT}/02_tools.png", "PNG")
    print("  02_tools.png")

# ============================================================
# SCREENSHOT 3: AI Chat
# ============================================================
def screen_chat():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)

    font_h1 = try_font(52)
    font_h2 = try_font(36)
    font_body = try_font_regular(32)
    font_sm = try_font_regular(26)

    # Header
    draw.text((80, 130), "AI Marketing Assistant", fill=WHITE, font=font_h1)

    # Chat messages
    messages = [
        ("bot", "Hi! I'm your AI Marketing Assistant. I can help you create ads, optimize campaigns, write content, and more. What would you like to work on today?", 280),
        ("user", "I need help creating a Facebook ad campaign for my new running shoes. Target audience: fitness enthusiasts aged 25-45.", 620),
        ("bot", "Great choice! Here's a strategy for your running shoes Facebook campaign:\n\n1. Campaign Objective: Conversions\n2. Audience: Fitness enthusiasts, 25-45\n3. Placements: FB Feed + Instagram\n4. Budget: Start with $50/day\n\nWant me to generate the ad copy?", 900),
        ("user", "Yes, please generate 3 variations of ad copy.", 1380),
        ("bot", "Here are 3 ad copy variations:\n\nVariation 1:\n\"Run further. Run faster. Our new [Brand] runners are engineered for peak performance. 30-day comfort guarantee.\"\n\nVariation 2:\n\"Your next PR starts here. Lightweight, responsive, unstoppable. Try risk-free for 30 days.\"\n\nVariation 3:\n\"Built for runners who demand more. Advanced cushioning meets race-day speed. Shop now - free shipping!\"", 1560),
    ]

    for role, text, y in messages:
        if role == "bot":
            # Bot avatar
            draw.ellipse((80, y, 140, y+60), fill=PRIMARY)
            draw.text((98, y+10), "AI", fill=WHITE, font=try_font(24))
            # Message bubble
            max_w = W - 260
            rounded_rect(draw, (160, y, 160+max_w, y + max(80, len(text)//3 * 10 + 60)), CARD, radius=20)
            # Word wrap text
            words = text.split()
            line = ""
            ty = y + 20
            for word in words:
                test_line = line + " " + word if line else word
                bbox = draw.textbbox((0, 0), test_line, font=font_sm)
                if bbox[2] - bbox[0] > max_w - 50:
                    draw.text((185, ty), line, fill=WHITE, font=font_sm)
                    ty += 36
                    line = word
                else:
                    line = test_line
            if line:
                draw.text((185, ty), line, fill=WHITE, font=font_sm)
        else:
            # User message (right aligned)
            max_w = W - 260
            msg_w = min(max_w, len(text) * 14 + 40)
            x = W - 80 - msg_w
            rounded_rect(draw, (x, y, W-80, y + max(80, len(text)//3 * 10 + 60)), PRIMARY, radius=20)
            words = text.split()
            line = ""
            ty = y + 20
            for word in words:
                test_line = line + " " + word if line else word
                bbox = draw.textbbox((0, 0), test_line, font=font_sm)
                if bbox[2] - bbox[0] > msg_w - 50:
                    draw.text((x+25, ty), line, fill=WHITE, font=font_sm)
                    ty += 36
                    line = word
                else:
                    line = test_line
            if line:
                draw.text((x+25, ty), line, fill=WHITE, font=font_sm)

    # Input bar
    y_input = H - 240
    rounded_rect(draw, (80, y_input, W-80, y_input+90), SURFACE, radius=24)
    draw.rounded_rectangle((80, y_input, W-80, y_input+90), radius=24, outline=PRIMARY, width=2)
    draw.text((130, y_input+25), "Ask me anything about marketing...", fill=TEXT_TERT, font=font_body)
    # Send button
    draw.ellipse((W-160, y_input+10, W-100, y_input+70), fill=PRIMARY)

    draw_tab_bar(draw, active=2)
    img.save(f"{OUT}/03_chat.png", "PNG")
    print("  03_chat.png")

# ============================================================
# SCREENSHOT 4: Tool Detail (Generation)
# ============================================================
def screen_tool_detail():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)

    font_h1 = try_font(48)
    font_h2 = try_font(36)
    font_body = try_font_regular(32)
    font_sm = try_font_regular(26)
    font_badge = try_font(22)

    # Header with gradient
    gradient_rect(img, (0, 100, W, 500), (30, 25, 60), BG)

    # Back button
    draw.ellipse((80, 130, 150, 200), fill=SURFACE)
    draw.text((104, 148), "<", fill=WHITE, font=font_h2)

    # Tool info
    rounded_rect(draw, (80, 230, 170, 320), (*SECONDARY, 40), radius=18)
    draw.text((100, 250), "Fb", fill=SECONDARY, font=font_h1)

    # Badges
    rounded_rect(draw, (200, 235, 270, 262), SUCCESS, radius=6)
    draw.text((208, 238), "NEW", fill=WHITE, font=font_badge)
    rounded_rect(draw, (280, 235, 345, 262), ACCENT, radius=6)
    draw.text((288, 238), "PRO", fill=WHITE, font=font_badge)

    draw.text((200, 270), "Facebook Ad Copy", fill=WHITE, font=font_h1)
    draw.text((200, 325), "Generate high-converting Facebook\nad copy with AI", fill=TEXT_SEC, font=font_sm)

    # Stats
    stats = [("18.5k uses", "users"), ("4.9 rating", "star"), ("~10 sec", "clock")]
    x = 80
    for text, icon in stats:
        draw.text((x+30, 420), text, fill=TEXT_SEC, font=font_sm)
        x += 320

    # Input fields
    y = 520

    # Product/Service Name
    draw.text((80, y), "Product / Service Name *", fill=WHITE, font=font_h2)
    y += 50
    rounded_rect(draw, (80, y, W-80, y+80), SURFACE, radius=14)
    draw.rounded_rectangle((80, y, W-80, y+80), radius=14, outline=BORDER, width=2)
    draw.text((110, y+20), "Nike Air Max Running Shoes", fill=WHITE, font=font_body)

    y += 120

    # Target Audience
    draw.text((80, y), "Target Audience *", fill=WHITE, font=font_h2)
    y += 50
    rounded_rect(draw, (80, y, W-80, y+80), SURFACE, radius=14)
    draw.rounded_rectangle((80, y, W-80, y+80), radius=14, outline=BORDER, width=2)
    draw.text((110, y+20), "Fitness enthusiasts, runners, 25-45", fill=WHITE, font=font_body)

    y += 120

    # Key Benefits
    draw.text((80, y), "Key Benefits / Features", fill=WHITE, font=font_h2)
    y += 50
    rounded_rect(draw, (80, y, W-80, y+160), SURFACE, radius=14)
    draw.rounded_rectangle((80, y, W-80, y+160), radius=14, outline=BORDER, width=2)
    draw.text((110, y+20), "Lightweight, responsive cushioning,", fill=WHITE, font=font_body)
    draw.text((110, y+58), "breathable mesh, 30-day guarantee,", fill=WHITE, font=font_body)
    draw.text((110, y+96), "free shipping on orders over $100", fill=WHITE, font=font_body)

    y += 200

    # Tone selection
    draw.text((80, y), "Tone", fill=WHITE, font=font_h2)
    y += 50
    tones = [("Professional", True), ("Casual", False), ("Friendly", False), ("Persuasive", False), ("Creative", False)]
    tx = 80
    for tone, active in tones:
        tw = len(tone) * 22 + 40
        if active:
            rounded_rect(draw, (tx, y, tx+tw, y+56), PRIMARY, radius=28)
            draw.text((tx+20, y+12), tone, fill=WHITE, font=font_sm)
        else:
            draw.rounded_rectangle((tx, y, tx+tw, y+56), radius=28, outline=BORDER, width=2)
            draw.text((tx+20, y+12), tone, fill=TEXT_SEC, font=font_sm)
        tx += tw + 16

    y += 90

    # Language selection
    draw.text((80, y), "Language", fill=WHITE, font=font_h2)
    y += 50
    langs = [("English", True), ("Spanish", False), ("French", False), ("Hindi", False)]
    tx = 80
    for lang, active in langs:
        tw = len(lang) * 22 + 40
        if active:
            rounded_rect(draw, (tx, y, tx+tw, y+56), PRIMARY, radius=28)
            draw.text((tx+20, y+12), lang, fill=WHITE, font=font_sm)
        else:
            draw.rounded_rectangle((tx, y, tx+tw, y+56), radius=28, outline=BORDER, width=2)
            draw.text((tx+20, y+12), lang, fill=TEXT_SEC, font=font_sm)
        tx += tw + 16

    y += 90

    # Output count
    draw.text((80, y), "Number of Outputs", fill=WHITE, font=font_h2)
    y += 50
    for i, count in enumerate([1, 3, 5]):
        x = 80 + i * 120
        if count == 3:
            rounded_rect(draw, (x, y, x+90, y+60), PRIMARY, radius=14)
            draw.text((x+35, y+14), str(count), fill=WHITE, font=font_h2)
        else:
            draw.rounded_rectangle((x, y, x+90, y+60), radius=14, outline=BORDER, width=2)
            draw.text((x+35, y+14), str(count), fill=TEXT_SEC, font=font_h2)

    # Generate button (sticky bottom)
    y_btn = H - 180
    draw.rectangle((0, y_btn-20, W, H), fill=BG)
    draw.line([(0, y_btn-20), (W, y_btn-20)], fill=BORDER, width=2)
    gradient_rect(img, (80, y_btn, W-80, y_btn+80), PRIMARY, ACCENT)
    draw.rounded_rectangle((80, y_btn, W-80, y_btn+80), radius=14, outline=None)
    draw.text((W//2-200, y_btn+18), "Generate Content", fill=WHITE, font=font_h1)

    img.save(f"{OUT}/04_tool_detail.png", "PNG")
    print("  04_tool_detail.png")

# ============================================================
# SCREENSHOT 5: Tool Results
# ============================================================
def screen_results():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)

    font_h1 = try_font(48)
    font_h2 = try_font(36)
    font_body = try_font_regular(32)
    font_sm = try_font_regular(26)

    # Header
    gradient_rect(img, (0, 100, W, 380), (30, 25, 60), BG)
    draw.ellipse((80, 130, 150, 200), fill=SURFACE)
    draw.text((104, 148), "<", fill=WHITE, font=font_h2)
    draw.text((W//2-80, 148), "Results", fill=WHITE, font=try_font(40))

    # Tool info
    rounded_rect(draw, (80, 240, 160, 310), (*SECONDARY, 40), radius=14)
    draw.text((180, 245), "Facebook Ad Copy", fill=WHITE, font=font_h2)
    draw.text((180, 290), "3 outputs generated", fill=TEXT_SEC, font=font_sm)

    # Output tabs
    tabs = [("Option 1", True), ("Option 2", False), ("Option 3", False)]
    tx = 80
    for tab, active in tabs:
        tw = 200
        if active:
            rounded_rect(draw, (tx, 350, tx+tw, 400), PRIMARY, radius=20)
            draw.text((tx+40, 360), tab, fill=WHITE, font=font_sm)
        else:
            rounded_rect(draw, (tx, 350, tx+tw, 400), SURFACE, radius=20)
            draw.text((tx+40, 360), tab, fill=TEXT_SEC, font=font_sm)
        tx += tw + 16

    # Output card
    rounded_rect(draw, (80, 430, W-80, 1350), CARD, radius=20)
    draw.rounded_rectangle((80, 430, W-80, 1350), radius=20, outline=PRIMARY, width=3)

    # Generated text content
    ad_copy = [
        "Run Further. Run Faster.",
        "",
        "Introducing the all-new Nike Air Max Running",
        "Shoes - engineered for peak performance.",
        "",
        "Whether you're training for your next marathon",
        "or crushing your daily miles, these shoes deliver:",
        "",
        "   Lightweight design that moves with you",
        "   Responsive cushioning for every stride",
        "   Breathable mesh keeps you cool",
        "   Built to last, mile after mile",
        "",
        "Join 50,000+ runners who've already made",
        "the switch.",
        "",
        "Shop now and get FREE shipping on orders",
        "over $100. Plus our 30-day comfort guarantee",
        "means you can try them risk-free.",
        "",
        "Your next personal best starts here.",
        "",
        "Shop Now  ->  nike.com/airmax",
    ]

    y = 460
    for line in ad_copy:
        if line.startswith("Run Further") or line.startswith("Your next") or line.startswith("Shop Now"):
            draw.text((120, y), line, fill=WHITE, font=try_font(30))
        elif line.startswith("   "):
            draw.text((120, y), line, fill=SUCCESS, font=font_sm)
        elif line == "":
            pass
        else:
            draw.text((120, y), line, fill=WHITE, font=font_sm)
        y += 34

    # Action buttons
    y_actions = 1260
    draw.line([(120, y_actions), (W-120, y_actions)], fill=BORDER, width=1)
    actions = [("Copy", TEXT_SEC), ("Share", TEXT_SEC), ("Like", TEXT_SEC), ("Saved", SUCCESS)]
    action_w = (W - 160) // 4
    for i, (name, color) in enumerate(actions):
        x = 80 + i * action_w
        draw.text((x+30, y_actions+20), name, fill=color, font=font_sm)

    # Stats card
    rounded_rect(draw, (80, 1390, W-80, 1600), CARD, radius=20)
    stats = [("Words", "156"), ("Characters", "892"), ("Reading Time", "1 min")]
    for i, (label, val) in enumerate(stats):
        y = 1410 + i * 65
        draw.text((120, y), label, fill=TEXT_SEC, font=font_sm)
        draw.text((W-200, y), val, fill=WHITE, font=font_h2)
        if i < 2:
            draw.line([(120, y+55), (W-120, y+55)], fill=BORDER, width=1)

    # Tips
    rounded_rect(draw, (80, 1640, W-80, 1850), (*PRIMARY, 25), radius=20)
    draw.text((120, 1670), "Tips for Better Results", fill=WHITE, font=font_h2)
    tips = ["Be specific with your input details", "Try different tones for variety", "Use keywords relevant to your audience"]
    for i, tip in enumerate(tips):
        draw.text((120, 1720 + i * 40), f"  {tip}", fill=TEXT_SEC, font=font_sm)

    # Bottom actions
    y_btn = H - 180
    draw.rectangle((0, y_btn-20, W, H), fill=BG)
    draw.line([(0, y_btn-20), (W, y_btn-20)], fill=BORDER, width=2)

    # Regenerate button
    draw.rounded_rectangle((80, y_btn, W//2-20, y_btn+80), radius=14, outline=PRIMARY, width=3)
    draw.text((W//4-120, y_btn+18), "Regenerate", fill=PRIMARY, font=font_h2)

    # New Generation button
    gradient_rect(img, (W//2+20, y_btn, W-80, y_btn+80), PRIMARY, ACCENT)
    draw.text((W*3//4-150, y_btn+18), "New Generation", fill=WHITE, font=font_h2)

    img.save(f"{OUT}/05_results.png", "PNG")
    print("  05_results.png")

# ============================================================
# SCREENSHOT 6: Profile Screen
# ============================================================
def screen_profile():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)

    font_h1 = try_font(48)
    font_h2 = try_font(36)
    font_body = try_font_regular(32)
    font_sm = try_font_regular(26)

    # Hero background
    gradient_rect(img, (0, 100, W, 380), (40, 30, 70), BG)

    draw.text((80, 130), "Profile", fill=WHITE, font=font_h1)
    draw.ellipse((W-150, 120, W-80, 190), fill=SURFACE)

    # Avatar
    cx = W // 2
    draw.ellipse((cx-80, 300, cx+80, 460), fill=PRIMARY)
    draw.text((cx-40, 340), "LS", fill=WHITE, font=try_font(56))
    # Camera badge
    draw.ellipse((cx+40, 420, cx+80, 460), fill=SECONDARY)

    # Name + email
    draw.text((cx-200, 480), "Lokendra Singh", fill=WHITE, font=font_h1)
    bbox = draw.textbbox((0, 0), "help@marketingtool.pro", font=font_sm)
    tw = bbox[2] - bbox[0]
    draw.text((cx-tw//2, 540), "help@marketingtool.pro", fill=TEXT_SEC, font=font_sm)

    # Subscription badge
    rounded_rect(draw, (cx-100, 580, cx+100, 620), (61, 41, 20), radius=20)
    draw.text((cx-70, 588), "Pro Member", fill=GOLD, font=font_sm)

    # Stats
    rounded_rect(draw, (80, 660, W-80, 800), CARD, radius=20)
    stats_data = [("48", "Generations"), ("48", "Saved"), ("12", "Tools Used")]
    stat_w = (W - 160) // 3
    for i, (val, label) in enumerate(stats_data):
        x = 80 + i * stat_w + stat_w // 2
        rounded_rect(draw, (x-30, 690, x+30, 730), (*SECONDARY, 25), radius=10)
        draw.text((x-20, 740), val, fill=WHITE, font=font_h2)
        draw.text((x-50, 775), label, fill=TEXT_SEC, font=font_sm)

    # Menu sections
    sections = [
        ("Account", [("Edit Profile", None), ("Email Preferences", None), ("Change Password", None), ("Privacy & Security", None)]),
        ("Subscription", [("Manage Plan", None), ("Payment Methods", None), ("Billing History", None)]),
        ("App", [("Settings", None), ("Notifications", None), ("Appearance", None)]),
    ]

    y = 840
    for title, items in sections:
        draw.text((80, y), title.upper(), fill=TEXT_TERT, font=try_font(22))
        y += 40
        rounded_rect(draw, (80, y, W-80, y + len(items) * 80), CARD, radius=16)
        for i, (item, badge) in enumerate(items):
            iy = y + i * 80
            rounded_rect(draw, (110, iy+15, 160, iy+65), (*SECONDARY, 25), radius=10)
            draw.text((180, iy+25), item, fill=WHITE, font=font_body)
            draw.text((W-130, iy+30), ">", fill=TEXT_TERT, font=font_h2)
            if i < len(items) - 1:
                draw.line([(110, iy+80), (W-110, iy+80)], fill=BORDER, width=1)
        y += len(items) * 80 + 30

    # Logout button
    rounded_rect(draw, (80, y, W-80, y+70), (220, 38, 38, 25), radius=14)
    draw.text((W//2-60, y+18), "Logout", fill=(220, 38, 38), font=font_h2)

    # Version
    draw.text((W//2-120, y+100), "MarketingTool v1.1.0", fill=TEXT_TERT, font=font_sm)

    draw_tab_bar(draw, active=4)
    img.save(f"{OUT}/06_profile.png", "PNG")
    print("  06_profile.png")

# ============================================================
# Generate all screenshots
# ============================================================
if __name__ == "__main__":
    print("Generating iPad 13\" screenshots (2048x2732px)...")
    screen_dashboard()
    screen_tools()
    screen_chat()
    screen_tool_detail()
    screen_results()
    screen_profile()
    print(f"\nDone! Screenshots saved to {OUT}/")
    print("Resolution: 2048 x 2732px (iPad 12.9\"/13\" Display)")
