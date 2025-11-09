# analyze_data.py
import os
import sys
import json
import warnings
import pandas as pd
import sweetviz as sv
from ydata_profiling import ProfileReport
import matplotlib

# 🧹 Suppress all noisy warnings and logs
warnings.filterwarnings("ignore")
matplotlib.use("Agg")

def generate_report(input_file: str, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)

    ext = os.path.splitext(input_file)[1].lower()
    if ext == ".csv":
        df = pd.read_csv(input_file)
    elif ext in [".xlsx", ".xls"]:
        df = pd.read_excel(input_file)
    elif ext == ".json":
        df = pd.read_json(input_file)
    else:
        raise ValueError(f"Unsupported file format: {ext}")

    base_name = os.path.splitext(os.path.basename(input_file))[0]

    # ✅ Sweetviz report
    sweetviz_path = os.path.join(output_dir, f"{base_name}_sweetviz.html")
    sv.analyze(df).show_html(sweetviz_path, open_browser=False)

    # ✅ YData Profiling report
    ydata_path = os.path.join(output_dir, f"{base_name}_ydata.html")
    ProfileReport(df, title=f"{base_name} Data Profile", explorative=True).to_file(ydata_path)

    return {"sweetviz": sweetviz_path, "ydata": ydata_path}


if __name__ == "__main__":
    try:
        # ✅ Remove any accidental stdout noise from libraries
        sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf8', buffering=1)
        sys.stderr = open(os.devnull, 'w')  # silence warnings to stderr

        if len(sys.argv) < 3:
            sys.stdout.write(json.dumps({"error": "Usage: python analyze_data.py <input_file> <output_dir>"}))
            sys.exit(1)

        input_file = sys.argv[1]
        output_dir = sys.argv[2]

        result = generate_report(input_file, output_dir)

        # ✅ Optionally include Sweetviz HTML content
        sweetviz_html = ""
        if os.path.exists(result["sweetviz"]):
            with open(result["sweetviz"], "r", encoding="utf-8") as f:
                sweetviz_html = f.read()

        output = {
            "sweetviz": result["sweetviz"],
            "ydata": result["ydata"],
            "sweetviz_html": sweetviz_html,
        }

        # ✅ Output JSON only (no extra newline, no print)
        sys.stdout.write(json.dumps(output))
        sys.stdout.flush()

    except Exception as e:
        sys.stdout.write(json.dumps({"error": str(e)}))
        sys.stdout.flush()
        sys.exit(1)
