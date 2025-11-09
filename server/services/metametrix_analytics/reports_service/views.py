import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend (Agg is for server-side image generation)

import os
import pandas as pd
import sweetviz as sv
from ydata_profiling import ProfileReport
from django.conf import settings
from django.http import JsonResponse


def analyze_dataset(request, filename):
    """
    Search for the file in shared_storage/Uploads by filename (without extension).
    Generate both Sweetviz & YData Profiling reports, save them in Processed,
    and return both HTMLs in JSON.
    """
    try:
        uploads_dir = settings.UPLOADS_DIR
        reports_dir = settings.REPORTS_DIR
        os.makedirs(reports_dir, exist_ok=True)

        # ✅ Search file by name (ignoring extension)
        all_files = os.listdir(uploads_dir)
        matched_file = None
        for f in all_files:
            if f.startswith(filename):  # match ID or partial filename
                matched_file = f
                break

        if not matched_file:
            return JsonResponse({
                "success": False,
                "message": f"No matching file found for '{filename}' in uploads directory."
            }, status=404)

        file_path = os.path.join(uploads_dir, matched_file)
        ext = os.path.splitext(matched_file)[1].lower()

        # ✅ Load dataset
        if ext == ".csv":
            df = pd.read_csv(file_path)
        elif ext in [".xlsx", ".xls"]:
            df = pd.read_excel(file_path)
        elif ext == ".json":
            df = pd.read_json(file_path)
        else:
            return JsonResponse({
                "success": False,
                "message": f"Unsupported file type: {ext}"
            }, status=400)

        base_name = os.path.splitext(matched_file)[0]

        # ✅ Sweetviz Report
        sweetviz_path = os.path.join(reports_dir, f"{base_name}_sweetviz.html")
        sv.analyze(df).show_html(sweetviz_path, open_browser=False)

        # ✅ YData Profiling Report
        ydata_path = os.path.join(reports_dir, f"{base_name}_ydata.html")
        ProfileReport(df, title=f"{base_name} Data Profile", explorative=True).to_file(ydata_path)

        # ✅ Read HTML content
        with open(sweetviz_path, "r", encoding="utf-8") as f:
            sweetviz_html = f.read()
        with open(ydata_path, "r", encoding="utf-8") as f:
            ydata_html = f.read()

        return JsonResponse({
            "success": True,
            "message": f"Reports generated successfully for file: {matched_file}",
            "file_name": matched_file,
            "sweetviz_html": sweetviz_html,
            "ydata_html": ydata_html,
            "sweetviz_path": sweetviz_path,
            "ydata_path": ydata_path,
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)
