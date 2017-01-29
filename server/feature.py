import glob
import os
import librosa
import numpy as np

def extract_feature(file_name):
    X, sample_rate = librosa.load(file_name)
    stft = np.abs(librosa.stft(X))
    mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T,axis=0)
    chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T,axis=0)
    mel = np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T,axis=0)
    contrast = np.mean(librosa.feature.spectral_contrast(S=stft, sr=sample_rate).T,axis=0)

    return mfccs,chroma,mel,contrast

def one_hot_encode(labels):
    n_labels = len(labels)
    n_unique_labels = len(np.unique(labels))
    one_hot_encode = np.zeros((n_labels,n_unique_labels))
    one_hot_encode[np.arange(n_labels), labels] = 1

    return one_hot_encode

def parse_eval_file(path):
    features, labels = np.empty((0,187)), np.empty(0)

    mfccs, chroma, mel, contrast = extract_feature(path)
    ext_features = np.hstack([mfccs,chroma,mel,contrast])
    features = np.vstack([features, ext_features])

    return np.array(features)

def parse_audio_files(parent_dir, file_ext="*.wav"):
    features = np.empty((0,187))

    for fn in glob.glob(os.path.join(parent_dir, file_ext)):
        mfccs, chroma, mel, contrast = extract_feature(fn)
        ext_features = np.hstack([mfccs,chroma,mel,contrast])
        features = np.vstack([features,ext_features])

    return np.array(features)
