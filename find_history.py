import os
import json

history_dir = "/home/vscode/.vscode-server/data/User/History"
# Or maybe ~/.config/Code/User/History for local VS Code

paths_to_check = [
    "/home/vscode/.vscode-server/data/User/History",
    "/home/vscode/.config/Code/User/History",
    "/root/.vscode-server/data/User/History"
]

for base_dir in paths_to_check:
    if not os.path.exists(base_dir): continue
    for root, dirs, files in os.walk(base_dir):
        if "entries.json" in files:
            try:
                with open(os.path.join(root, "entries.json"), "r") as f:
                    data = json.load(f)
                    res = data.get("resource", "")
                    if "algo-search" in res or "algo-sort" in res:
                        print(f"Found {res} in {root}")
                        for entry in data.get("entries", []):
                            print(f"  - {entry['id']} : {entry.get('timestamp')}")
            except Exception as e:
                pass
