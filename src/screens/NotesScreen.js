import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView, StyleSheet, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView,
} from 'react-native';
import {
  Header, Right, Title, Left,
} from 'native-base';
import { connect } from 'react-redux';
import { SimpleLineIcons, Entypo } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { useNavigation, useRoute } from '@react-navigation/native';
import { func, shape } from 'prop-types';
import { resourceByRoutePropsSelector } from '../redux/selectors';
import { addRecordNote, editRecordNote } from '../redux/action-creators';

import Colors from '../constants/Colors';
import ResourceCard from '../components/ResourceCard/ResourceCard';
import BaseText from '../components/Generic/BaseText';

const NotesScreen = ({ resource, addRecordNoteAction, editRecordNoteAction }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingNote = route?.params?.editingNote;
  const [text, onChangeText] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);

  const handleSave = () => {
    if (editNoteId) {
      editRecordNoteAction(resource.id, text, editNoteId);
    } else {
      addRecordNoteAction(resource.id, text);
    }
    onChangeText('');
    setEditNoteId(null);
  };

  const handleEditNote = (noteId, noteText) => {
    setEditNoteId(noteId);
    onChangeText(noteText);
    textInputRef.current.focus();
  };

  useEffect(() => {
    if (editingNote) {
      handleEditNote(editingNote.id, editingNote.text);
    }
  }, []);

  const textInputRef = useRef();

  return (
    <SafeAreaView style={styles.root}>
      <Header style={styles.header}>
        <Left>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-thin-left" size={20} color={Colors.headerIcon} />
          </TouchableOpacity>
        </Left>
        <View>
          <Title>{resource.subType}</Title>
        </View>
        <Right>
          <TouchableOpacity>
            <SimpleLineIcons name="note" size={20} color={Colors.headerIcon} />
          </TouchableOpacity>
        </Right>
      </Header>
      <ScrollView>
        <ResourceCard
          resourceId={resource.id}
          resource={resource}
          handleEditNote={handleEditNote}
          editNoteId={editNoteId}
          fromNotesScreen
        />
      </ScrollView>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.noteInputContainer}>
          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            onChangeText={onChangeText}
            multiline
            value={text}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <BaseText variant="title">Save</BaseText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

NotesScreen.propTypes = {
  resource: shape({}).isRequired,
  addRecordNoteAction: func.isRequired,
  editRecordNoteAction: func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  resource: resourceByRoutePropsSelector(state, ownProps),
});

const mapDispatchToProps = {
  addRecordNoteAction: addNoteToRecord,
  editRecordNoteAction: editRecordNote,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotesScreen);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 0,
  },
  noteInputContainer: {
    padding: 10,
    backgroundColor: Colors.lightgrey,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
    padding: 10,
  },
  saveButton: {
    marginLeft: 10,
  },
});