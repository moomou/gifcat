#!/usr/bin/env python
import os
import subprocess
import sys
import tempfile
import uuid

from flask import Flask, jsonify
import keras
import librosa

from feature import parse_audio_files

app = Flask(__name__)
m = keras.models.load_model('./model.h5')
# print(dir(model))

def analyze_video(url, incr=2):
    global m

    # create prefix dir
    prefix = str(uuid.uuid4()).replace('-', '')
    os.mkdir(prefix)

    # download the file
    subprocess.check_output(
        'youtube-dl --extract-audio --audio-format wav -o %s/src.%%\(ext\)s %s' % (
            prefix, url
        ),
        shell=True
    )

    # split into 2 sec increments
    subprocess.check_output(
        'cd %s && ffmpeg -i src.wav -f segment -segment_time %s -c copy out%%03d.wav' % (
            prefix, incr
        ),
        shell=True
    )

    os.remove('%s/src.wav' % prefix)

    features = parse_audio_files(prefix)
    output = m.predict_classes(features)

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

if __name__ == '__main__':
    analyze_video(sys.argv[1])
