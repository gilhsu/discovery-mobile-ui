import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity, ActionSheetIOS, View, Alert, StyleSheet,
} from 'react-native';
import { Entypo } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from 'react-redux';
import {
  arrayOf,
  bool,
  func, number, shape, string,
} from 'prop-types';
import Dialog from 'react-native-dialog';

import { deleteCollection, renameCollection, duplicateCollection } from '../../redux/action-creators';
import { collectionsCountSelector, collectionsLabelsSelector } from '../../redux/selectors';
import Colors from '../../constants/Colors';

const CollectionDialogText = {
  rename: {
    action: 'rename',
    title: 'Rename Collection',
    description: 'Enter name for this new collection.',
    errorDescription: 'Collection name must be unique.',
    submitButton: 'Rename',
    showTextInput: true,
    useDupLabel: true,
  },
  duplicate: {
    action: 'duplicate',
    title: 'Duplicate Collection',
    description: 'Enter name for this new collection.',
    errorDescription: 'Collection name must be unique.',
    submitButton: 'Duplicate',
    showTextInput: true,
    useDupLabel: true,
  },
  delete: {
    action: 'delete',
    title: 'Delete Collection',
    description: 'Are you sure you want to delete this collection?',
    errorDescription: null,
    submitButton: 'Delete',
    showTextInput: false,
    useDupLabel: false,
  },
};

const CollectionDialog = ({
  collectionDialogText,
  setCollectionDialogText,
  showUniqueError,
  handleSubmit,
  defaultValue,
}) => {
  const [inputText, setInputText] = useState('');
  const {
    title, description, errorDescription, submitButton, showTextInput,
  } = collectionDialogText;

  useEffect(() => {
    setInputText(defaultValue);
  }, []);

  return (
    <View>
      <Dialog.Container visible>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>
          {description}
        </Dialog.Description>
        {showUniqueError && (
          <Dialog.Description style={styles.errorDescription}>
            {errorDescription}
          </Dialog.Description>
        )}
        {showTextInput && <Dialog.Input defaultValue={defaultValue} onChangeText={setInputText} />}
        <Dialog.Button label="Cancel" onPress={() => setCollectionDialogText(null)} />
        <Dialog.Button label={submitButton} onPress={() => handleSubmit(inputText)} />
      </Dialog.Container>
    </View>
  );
};

CollectionDialog.propTypes = {
  collectionDialogText: shape({}).isRequired,
  setCollectionDialogText: func.isRequired,
  showUniqueError: bool.isRequired,
  handleSubmit: func.isRequired,
  defaultValue: string.isRequired,
};

const CollectionRowActionIcon = ({
  collectionId,
  collectionLabel,
  collectionsCount,
  deleteCollectionAction,
  renameCollectionAction,
  duplicateCollectionAction,
  collectionsLabels,
}) => {
  const [collectionDialogText, setCollectionDialogText] = useState(null);
  const [showUniqueError, setShowUniqueError] = useState(false);

  const checkUniqueName = (inputText) => (!collectionsLabels.includes(inputText));

  const deleteErrorAlert = () => Alert.alert('Delete Error', 'Cannot delete last collection.');

  const handlePress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Rename Collection', 'Duplicate Collection', 'Delete Collection'],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setCollectionDialogText(CollectionDialogText.rename);
        } else if (buttonIndex === 2) {
          setCollectionDialogText(CollectionDialogText.duplicate);
        } else if (buttonIndex === 3) {
          if (collectionsCount <= 1) {
            deleteErrorAlert();
          } else {
            setCollectionDialogText(CollectionDialogText.delete);
          }
        }
      },
    );
  };

  const handleSubmit = (inputText) => {
    if (checkUniqueName(inputText)) {
      if (collectionDialogText.action === 'rename') {
        renameCollectionAction(collectionId, inputText);
      } if (collectionDialogText.action === 'duplicate') {
        duplicateCollectionAction(collectionId, inputText);
      } if (collectionDialogText.action === 'delete') {
        deleteCollectionAction(collectionId);
      }
      setCollectionDialogText(null);
      setShowUniqueError(false);
    } else {
      setShowUniqueError(true);
    }
  };

  const getDefaultValue = () => {
    if (collectionDialogText.useDupLabel) {
      if (collectionDialogText.action === 'rename') {
        return collectionLabel;
      }
      return `${collectionLabel} copy`;
    }
    return '';
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Entypo name="dots-three-vertical" size={20} color={Colors.headerIcon} />
      </TouchableOpacity>
      {collectionDialogText && (
      <CollectionDialog
        collectionDialogText={collectionDialogText}
        setCollectionDialogText={setCollectionDialogText}
        showUniqueError={showUniqueError}
        handleSubmit={handleSubmit}
        defaultValue={getDefaultValue()}
      />
      )}
    </View>
  );
};

CollectionRowActionIcon.propTypes = {
  collectionId: string.isRequired,
  collectionLabel: string.isRequired,
  collectionsCount: number.isRequired,
  deleteCollectionAction: func.isRequired,
  renameCollectionAction: func.isRequired,
  duplicateCollectionAction: func.isRequired,
  collectionsLabels: arrayOf(string.isRequired).isRequired,
};

const mapStateToProps = (state) => ({
  collectionsCount: collectionsCountSelector(state),
  collectionsLabels: collectionsLabelsSelector(state),
});

const mapDispatchToProps = {
  deleteCollectionAction: deleteCollection,
  renameCollectionAction: renameCollection,
  duplicateCollectionAction: duplicateCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionRowActionIcon);

const styles = StyleSheet.create({
  errorDescription: {
    color: 'red',
  },
});
