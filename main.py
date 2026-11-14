# main.py
import pyperclip
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from styles import decorate_arabic

console = Console()

def main():
    console.print(Panel.fit("[bold cyan]✨ مولّد الأسماء الفخمة للتيك توك - Basem TikTok Decorator ✨[/bold cyan]"))
    
    name = input("\nادخل الاسم المطلوب زخرفته: ").strip()
    if not name:
        console.print("[red]لم يتم إدخال أي اسم![/red]")
        return

    results = decorate_arabic(name)

    table = Table(title=f"\nالنتائج المتاحة للاسم: {name}", show_header=True, header_style="bold magenta")
    table.add_column("الرقم", justify="center", style="cyan", width=6)
    table.add_column("الاسم المزخرف", justify="right", style="green")

    for idx, item in enumerate(results, 1):
        table.add_row(str(idx), item)

    console.print(table)

    choice = input("\nاختر رقم الزخرفة لنسخها فوراً للـ Clipboard (أو اضغط Enter للخروج): ").strip()
    if choice.isdigit():
        idx = int(choice) - 1
        if 0 <= idx < len(results):
            pyperclip.copy(results[idx])
            console.print(f"\n[bold yellow]✔ تم نسخ '{results[idx]}' إلى الحافظة بنجاح![/bold yellow]\n")
        else:
            console.print("[red]رقم غير صحيح.[/red]")

if __name__ == "__main__":
    main()