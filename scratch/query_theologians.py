import os
import google.auth
from google import genai
import traceback

print('Initializing Theological Queries...')
try:
    credentials, project = google.auth.default()
    client = genai.Client(vertexai=True, project="theo-503105", location="us", credentials=credentials)
except Exception as e:
    print("Authentication failed.")
    traceback.print_exc()
    exit(1)

queries = {
    "Carson": {
        "model_id": "projects/300197968639/locations/us/endpoints/2876252049517838336",
        "prompt": "Exegete 2 Corinthians 5:19-21. Focus specifically on the meaning of 'katallasso' (reconciliation) and the 'Great Exchange' in verse 21. Does the text imply that God's own wrath was propitiated in this reconciliation, and how does imputation work here?"
    },
    "Piper": {
        "model_id": "projects/300197968639/locations/us/endpoints/1563452758139338752",
        "prompt": "Explain Romans 5:11 ('we exult in God through our Lord Jesus Christ, through whom we have now received the reconciliation'). What does it mean to 'receive' reconciliation, and how does this relate to Christian Hedonism? Is the ultimate gift of reconciliation actually God Himself?"
    },
    "Beale": {
        "model_id": "projects/300197968639/locations/us/endpoints/9124996532494401536",
        "prompt": "How does the concept of 'reconciliation' and 'new creation' in 2 Corinthians 5:17-19 connect to the Old Testament themes of the Temple, the tabernacle, and the eschatological restoration of Eden?"
    }
}

output_md = "Theology_Answers.md"
with open(output_md, "w", encoding="utf-8") as f:
    f.write("# Theological Consultation Results\n\n")

for theologian, data in queries.items():
    print(f"Querying {theologian}...")
    try:
        response = client.models.generate_content(
            model=data["model_id"],
            contents=data["prompt"]
        )
        with open(output_md, "a", encoding="utf-8") as f:
            f.write(f"## {theologian}'s Response\n")
            f.write(f"**Prompt:** {data['prompt']}\n\n")
            f.write(f"{response.text}\n\n---\n\n")
        print(f"-> {theologian} success.")
    except Exception as e:
        print(f"-> {theologian} failed: {e}")
        traceback.print_exc()

print(f"All done! Results in {output_md}")
