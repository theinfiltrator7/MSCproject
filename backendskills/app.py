import json


import en_core_web_lg
from spacy.matcher import PhraseMatcher
from skillNer.skill_extractor_class import SkillExtractor
from skillNer.general_params import SKILL_DB
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__) 
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
nlp = en_core_web_lg.load()
skill_extractor = SkillExtractor(nlp, SKILL_DB, PhraseMatcher)


@app.route('/', methods=['POST'])

def extract_skills():
    data = request.json
    title = data.get('title')
    member_data = data.get('memberData')

    annotations = skill_extractor.annotate(title)
    doc_node_values = [
        match["doc_node_value"] for match in annotations["results"]["full_matches"]
    ]

    doc_node_values += [
        match["doc_node_value"] for match in annotations["results"]["ngram_scored"]
    ]


    skills_required = set(skill.lower() for skill in doc_node_values)


    def match_skills_and_experience(member_data, skills_required):
        skills_required = [skill.lower() for skill in skills_required]
        
        matches = []
        
        for member in member_data:
            matching_skills = sum(1 for skill in member['skills'] if any(req in skill.lower() for req in skills_required))

            if matching_skills > 0:
                experience = -member.get('totalExperience', 0) if member.get('totalExperience', 0) > 0 else 0
                matches.append((matching_skills, experience, member['email']))
        
        matches.sort(reverse=True)
        
        return [match[2] for match in matches]
    
    result = match_skills_and_experience(member_data, skills_required)
    final_data = json.dumps(result, default=str)

    return final_data


if __name__ == '__main__':
    app.run(port=8000, debug=True)