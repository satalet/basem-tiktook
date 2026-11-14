# styles.py

# زخارف للأسماء العربية
ARABIC_STYLES = [
    "꧁༺ {} ༻꧂",
    "♛ {} ♛",
    "★彡 {} 彡★",
    "★彡 [ {} ] 彡★",
    "『{}』",
    "【{}】",
    "༻{}༺",
    "░{}░",
    "✧○ꊞ○{}○ꊞ○✧",
    "Iล{}Iล",
]

# قاموس تحويل الحروف الإنجليزية إلى خطوط Unicode فخمة
UNICODE_FONTS = {
    "bold_script": {
        'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱',
        'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹',
        'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁',
        'y': '𝔂', 'z': '𝔃'
    },
    "double_struck": {
        'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙',
        'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡',
        'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩',
        'y': '𝕪', 'z': '𝕫'
    }
}

def decorate_arabic(name):
    """تطبيق زخارف الرموز على الاسم العربي"""
    return [style.format(name) for style in ARABIC_STYLES]

def convert_english(text, font_type="bold_script"):
    """تحويل النص الإنجليزي لخطوط مميزة"""
    mapping = UNICODE_FONTS.get(font_type, {})
    return "".join(mapping.get(char.lower(), char) for char in text)