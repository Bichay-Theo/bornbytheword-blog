import os
import json

GLOSSARIES_DIR = r"C:\Users\Boaz\Documents\Africa Translations"
OUTPUT_DIR = r"C:\Users\Boaz\Documents\Africa Translations\MindMaps"

# The 5 Theological Sections for categorization based on keywords
SECTIONS = {
    "Theology Proper & Revelation": ["God", "Trinity", "Attributes", "Revelation", "Scripture", "Bible", "Inerrancy", "Sovereignty", "Providence"],
    "Anthropology & Hamartiology": ["Man", "Human", "Sin", "Depravity", "Fall", "Image of God", "Original Sin", "Will"],
    "Christology & Soteriology": ["Christ", "Jesus", "Atonement", "Cross", "Justification", "Grace", "Faith", "Salvation", "Election", "Predestination", "Covenant", "Righteousness", "Adoption", "Redemption", "Propitiation"],
    "Pneumatology & Ecclesiology": ["Spirit", "Holy Spirit", "Church", "Baptism", "Supper", "Sacrament", "Regeneration", "Sanctification", "Perseverance"],
    "Eschatology & Other": ["End Times", "Judgment", "Hell", "Heaven", "Resurrection", "Return", "Glorification"]
}

def categorize_concept(concept_en):
    concept_lower = concept_en.lower()
    for section, keywords in SECTIONS.items():
        if any(kw.lower() in concept_lower for kw in keywords):
            return section
    return "General Concepts"

def generate_html(language, concepts):
    nodes = []
    edges = []
    
    # Root Node
    root_id = 0
    nodes.append({
        "id": root_id, 
        "label": f"{language}\nReformed Glossary", 
        "shape": "box", 
        "color": "#1a73e8", 
        "font": {"color": "white", "size": 20}
    })
    
    # Section Nodes
    section_map = {}
    node_id_counter = 1
    
    for concept in concepts:
        section = categorize_concept(concept.get("concept_en", ""))
        
        if section not in section_map:
            section_id = node_id_counter
            node_id_counter += 1
            section_map[section] = section_id
            nodes.append({
                "id": section_id, 
                "label": section, 
                "shape": "ellipse", 
                "color": "#34a853", 
                "font": {"color": "white"}
            })
            edges.append({"from": root_id, "to": section_id})
            
        concept_id = node_id_counter
        node_id_counter += 1
        
        # We store the full data in the node to display it in the sidebar
        nodes.append({
            "id": concept_id,
            "label": concept.get("concept_en", "Unknown"),
            "shape": "box",
            "color": "#fbbc04",
            "fullData": {
                "concept_en": concept.get("concept_en", ""),
                "concept_ar": concept.get("concept_ar", ""),
                "accepted_term": concept.get("accepted_term", ""),
                "acceptance_reason": concept.get("acceptance_reason", ""),
                "rejected_term": concept.get("rejected_term", ""),
                "rejection_reason": concept.get("rejection_reason", "")
            }
        })
        edges.append({"from": section_map[section], "to": concept_id})

    html_template = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{language} - Theological Mind Map</title>
        <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
        <style>
            body {{
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                height: 100vh;
                background-color: #f8f9fa;
            }}
            #network-container {{
                flex: 1;
                height: 100%;
                border-right: 2px solid #ccc;
            }}
            #sidebar {{
                width: 400px;
                height: 100%;
                background-color: white;
                box-shadow: -2px 0 5px rgba(0,0,0,0.1);
                padding: 20px;
                box-sizing: border-box;
                overflow-y: auto;
                display: none;
                flex-direction: column;
                direction: rtl; /* Arabic support */
            }}
            .close-btn {{
                align-self: flex-start;
                cursor: pointer;
                color: #d93025;
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 20px;
            }}
            h2 {{ color: #1a73e8; font-size: 1.2rem; margin-top: 0; direction: ltr; text-align: left; }}
            h3 {{ color: #5f6368; font-size: 1rem; direction: ltr; text-align: left; }}
            .box {{
                background: #e8f0fe;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
            }}
            .box.rejected {{
                background: #fce8e6;
            }}
            .term {{ font-weight: bold; font-size: 1.1rem; margin-bottom: 10px; color: #111; direction: ltr; text-align: left; }}
            .reason {{ font-size: 0.95rem; color: #333; line-height: 1.5; }}
            .label {{ font-size: 0.8rem; font-weight: bold; color: #1a73e8; text-transform: uppercase; margin-bottom: 5px; direction: ltr; text-align: left; }}
            .label.rejected {{ color: #d93025; }}
        </style>
    </head>
    <body>

    <div id="network-container"></div>

    <div id="sidebar">
        <div class="close-btn" onclick="closeSidebar()">✖ Close</div>
        <h2 id="concept-en"></h2>
        <h3 id="concept-ar"></h3>
        
        <div class="box">
            <div class="label">Accepted Term</div>
            <div class="term" id="accepted-term"></div>
            <div class="reason" id="acceptance-reason"></div>
        </div>

        <div class="box rejected" id="rejected-box">
            <div class="label rejected">Rejected Term</div>
            <div class="term" id="rejected-term"></div>
            <div class="reason" id="rejection-reason"></div>
        </div>
    </div>

    <script type="text/javascript">
        var nodes = new vis.DataSet({json.dumps(nodes)});
        var edges = new vis.DataSet({json.dumps(edges)});

        var container = document.getElementById('network-container');
        var data = {{ nodes: nodes, edges: edges }};
        var options = {{
            layout: {{
                improvedLayout: true
            }},
            physics: {{
                stabilization: false,
                barnesHut: {{
                    gravitationalConstant: -2000,
                    springConstant: 0.04,
                    springLength: 95
                }}
            }},
            interaction: {{
                hover: true
            }}
        }};
        var network = new vis.Network(container, data, options);

        network.on("click", function (params) {{
            if (params.nodes.length > 0) {{
                var nodeId = params.nodes[0];
                var node = nodes.get(nodeId);
                if (node.fullData) {{
                    document.getElementById('concept-en').innerText = node.fullData.concept_en;
                    document.getElementById('concept-ar').innerText = node.fullData.concept_ar;
                    document.getElementById('accepted-term').innerText = node.fullData.accepted_term;
                    document.getElementById('acceptance-reason').innerText = node.fullData.acceptance_reason;
                    
                    if (node.fullData.rejected_term) {{
                        document.getElementById('rejected-box').style.display = 'block';
                        document.getElementById('rejected-term').innerText = node.fullData.rejected_term;
                        document.getElementById('rejection-reason').innerText = node.fullData.rejection_reason;
                    }} else {{
                        document.getElementById('rejected-box').style.display = 'none';
                    }}
                    
                    document.getElementById('sidebar').style.display = 'flex';
                }} else {{
                    closeSidebar();
                }}
            }} else {{
                closeSidebar();
            }}
        }});

        function closeSidebar() {{
            document.getElementById('sidebar').style.display = 'none';
        }}
    </script>
    </body>
    </html>
    """
    return html_template

def extract_concepts(data):
    # Flatten everything into a single array
    arr = []
    
    def traverse(node):
        if isinstance(node, list):
            for item in node:
                traverse(item)
        elif isinstance(node, dict):
            # If it looks like a concept dict, add it
            keys = [k.lower() for k in node.keys()]
            has_en = any('english' in k or 'concept_en' in k or k == 'concept' or k == 'id' for k in keys)
            has_ar = any('arabic' in k or 'concept_ar' in k or 'amharic' in k or 'swahili' in k or 'kabyle' in k or 'maa' in k or 'tamasheq' in k or 'tashelhit' in k for k in keys)
            
            if has_en and has_ar:
                arr.append(node)
            else:
                for k, v in node.items():
                    traverse(v)
                    
    traverse(data)
        
    concepts = []
    for item in arr:
        keys = item.keys()
        
        c_en = next((item[k] for k in keys if 'en' in k.lower() or 'english' in k.lower() or 'term' in k.lower()), "Unknown")
        c_ar = next((item[k] for k in keys if 'ar' in k.lower() or 'arabic' in k.lower()), "")
        
        acc_term = next((item[k] for k in keys if 'accept' in k.lower() or k.lower() in ['maa', 'kabyle', 'taqbaylit', 'tamasheq', 'tashelhit', 'swahili', 'amharic']), "")
        
        acc_reason = next((item[k] for k in keys if 'accept' in k.lower() and ('reason' in k.lower() or 'expl' in k.lower())), "")
        if not acc_reason:
            acc_reason = next((item[k] for k in keys if 'reason' in k.lower() or 'expl' in k.lower()), "")
            
        rej_term = next((item[k] for k in keys if 'reject' in k.lower()), "")
        rej_reason = next((item[k] for k in keys if 'reject' in k.lower() and ('reason' in k.lower() or 'expl' in k.lower())), "")
        
        concepts.append({
            "concept_en": str(c_en),
            "concept_ar": str(c_ar),
            "accepted_term": str(acc_term),
            "acceptance_reason": str(acc_reason),
            "rejected_term": str(rej_term),
            "rejection_reason": str(rej_reason)
        })
    return concepts

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    for filename in os.listdir(GLOSSARIES_DIR):
        if filename.endswith(".json"):
            filepath = os.path.join(GLOSSARIES_DIR, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                lang_name = filename.replace("_glossary.json", "").capitalize()
                if isinstance(data, dict) and "metadata" in data:
                    lang_name = data["metadata"].get("language", lang_name)
                    
                concepts = extract_concepts(data)
                
                html_content = generate_html(lang_name, concepts)
                
                out_filename = filename.replace(".json", "_mindmap.html")
                out_filepath = os.path.join(OUTPUT_DIR, out_filename)
                
                with open(out_filepath, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                print(f"Generated: {out_filepath} with {len(concepts)} concepts")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    main()
