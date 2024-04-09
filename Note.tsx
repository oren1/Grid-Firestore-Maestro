import React, {useContext} from 'react';
import {StyleSheet, Text, View, Image, Button, Dimensions} from 'react-native';
import {NotesContext} from './App';
const windowWidth = Dimensions.get('window').width;

export type Note = {
  title: string;
  description: string;
};

export type NoteProps = {
  onDelete: () => void;
} & Note;

function NoteView({title, description, onDelete}: NoteProps) {
  const notesContext = useContext(NotesContext);
  return (
    <View
      style={[styles.noteContainer, {backgroundColor: notesContext.noteColor}]}>
      <HeaderView title={title} />
      <Text style={styles.titleText}>{description}</Text>
      <Button
        testID={`delete button ${title}`}
        onPress={onDelete}
        title={`Delete ${title}`}
        color="blue"
        // accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

function HeaderView({title}: {title: string}) {
  return (
    <View style={styles.headerContainer}>
      <Image
        style={styles.logo}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
    height: 150,
    width: windowWidth / 2 - 10,
    margin: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  logo: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NoteView;
