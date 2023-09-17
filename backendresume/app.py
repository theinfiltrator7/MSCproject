from flask import Flask,request
from resume_parser import resumeparse
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/', methods=['POST'])
def resume_parser():
    get_resume = request.files['resume']
    resume_path = "./resume/" + get_resume.filename
    get_resume.save(resume_path)
    data = resumeparse.read_file(resume_path)
    resume_data_object = {
    'skills': data['skills'],
    'total_exp': data['total_exp']
}

    return resume_data_object
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', 'http://localhost:8080')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

if __name__ == '__main__':
    app.run(port=4000, debug=True)