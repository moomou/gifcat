#!/usr/bin/env python


import glob
import h5py
import numpy as np
import os
import sidekit

# extract mfcc features
def extract_features_mfcc(hdf5, filename, freq=48e3):
    '''Write to the hd5 file provided'''
    assert filename.endswith('.wav'), 'Invalid filename:: must end in wav'
    x, _ = sidekit.frontend.io.read_audio(filename, freq)

    #print(x.shape)
    if x.shape[1] > 1:
        print(x)
        x = np.delete(x, 1, 1)
        print('??', x.shape)
        print(x)
        x = x.reshape(-1, 1)

    #print(x.shape)
    # add a small random noise to avoid numerical issues
    x[:, 0] += 0.0001 * np.random.randn(x.shape[0])
    #print(x.shape)
    x = sidekit.frontend.

    cep, energy, _, fb = sidekit.frontend.features.mfcc(input_sig=x, fs=freq, get_spec=False, get_mspec=False)
    hdf5.create_dataset(os.path.basename(filename)[:-4], data=c[0], dtype='float')

if __name__ == '__main__':
    files = glob.glob('*.wav')
    h5 = h5py.File('other.hdf5', 'w')

    for idx, wav in enumerate(files):
        extract_features_mfcc(h5, idx, wav)
