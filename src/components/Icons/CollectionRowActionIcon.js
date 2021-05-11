import React, { useState } from 'react';
import {
  TouchableOpacity, ActionSheetIOS, View, Alert, StyleSheet,
} from 'react-native';
import { Entypo } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from 'react-redux';
import {
  arrayOf,
  bool,
  func, number, string,
} from 'prop-types';
import Dialog from 'react-native-dialog';

import { deleteCollection, renameCollection, duplicateCollection } from '../../redux/action-creators';
import { collectionsCountSelector, collectionsLabelsSelector } from '../../redux/selectors';
import Colors from '../../constants/Colors';

const CollectionDialog = ({
  isVisibleDialog,
  setIsVisibleDialog,
  showUniqueError,
  defaultValue,
  handlePressDuplicate,
}) => {
  const [inputText, setInputText] = useState('');
  return (
    <View>
      <Dialog.Container visible={isVisibleDialog}>
        <Dialog.Title>Duplicate Collection</Dialog.Title>
        <Dialog.Description>
          Enter name for this new collection.
        </Dialog.Description>
        {showUniqueError && (
        <Dialog.Description style={styles.errorDescription}>
          Collection name must be unique.
        </Dialog.Description>
        )}
        <Dialog.Input defaultValue={defaultValue} onChangeText={setInputText} />
        <Dialog.Button label="Cancel" onPress={() => setIsVisibleDialog(false)} />
        <Dialog.Button label="Duplicate" onPress={() => handlePressDuplicate(inputText)} />
      </Dialog.Container>
    </View>
  );
};

CollectionDialog.propTypes = {
  isVisibleDialog: bool.isRequired,
  setIsVisibleDialog: func.isRequired,
  showUniqueError: bool.isRequired,
  defaultValue: string.isRequired,
  handlePressDuplicate: func.isRequired,
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
  const [isVisibleDialog, setIsVisibleDialog] = useState(false);
  const [showUniqueError, setShowUniqueError] = useState(false);

  const checkUniqueName = (inputText) => (!collectionsLabels.includes(inputText));

  const renameAlert = () => Alert.prompt(
    'Rename Collection',
    'Enter new name for this collection.',
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Rename',
        onPress: (text) => renameCollectionAction(collectionId, text),
      },
    ],
  );

  const deleteErrorAlert = () => Alert.alert('Delete Error', 'Cannot delete last collection.');

  const deleteCollectionAlert = () => Alert.alert(
    'Delete Collection',
    'Are you sure you want to delete this collection?',
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => deleteCollectionAction(collectionId),
        style: 'destructive',
      },
    ],
  );

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
          renameAlert();
        } else if (buttonIndex === 2) {
          setIsVisibleDialog(true);
        } else if (buttonIndex === 3) {
          if (collectionsCount <= 1) {
            deleteErrorAlert();
          } else {
            deleteCollectionAlert();
          }
        }
      },
    );
  };

  const handlePressDuplicate = (inputText) => {
    if (checkUniqueName(inputText)) {
      duplicateCollectionAction(collectionId, inputText);
      setIsVisibleDialog(false);
      setShowUniqueError(false);
    } else {
      setShowUniqueError(true);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Entypo name="dots-three-vertical" size={20} color={Colors.headerIcon} />
      </TouchableOpacity>
      <CollectionDialog
        isVisibleDialog={isVisibleDialog}
        setIsVisibleDialog={setIsVisibleDialog}
        showUniqueError={showUniqueError}
        defaultValue={`${collectionLabel} copy`}
        handlePressDuplicate={handlePressDuplicate}
      />
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
