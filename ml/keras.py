from keras.models import Sequential

model = Sequential()

from keras.layers import Dense, Activation

model.add(Dense(output_dim=280, input_dim=187))
model.add(Activation('relu'))
model.add(Dense(output_dim=300))
model.add(Activation('tanh'))
model.add(Activation('softmax'))

model.compile(loss='categorical_crossentropy', optimizer='sgd', metrics=['accuracy'])
model.fit(X_train, Y_train, nb_epoch=5, batch_size=32)
