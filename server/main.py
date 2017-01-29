import subprocess
import os

from flask import Flask, jsonify
import keras
import librosa

from feature import parse_eval_file

app = Flask(__name__)
model = keras.models.load_model('./model.h5')

def analyze_video(url):
    tmp_f = tempfile.NamedTemporaryFile(delete=False)

    subprocess.check_output(
        'youtube-dl --extract-audio --audio-format wav -o %s %s' % (
            tmp_f.name, url
        )
    )

    features = parse_eval_file(tmp_f.name)
    output = model.predict_classes(np.array([features]))

    print(output)

@app.route('/classify', methods=['GET'])
def model():
    url = request.args.get('url')

    try:
        result = analyze_video(url)
        return jsonify({ 'class_result': result, })
    except Exception as e:
        print(e)
        return jsonify({'error': e})

