import PyPDF2
with open("assets/menu.pdf", "rb") as file:
    reader = PyPDF2.PdfReader(file)
    for i, page in enumerate(reader.pages):
        print(f"--- PAGE {i+1} ---")
        print(page.extract_text())
