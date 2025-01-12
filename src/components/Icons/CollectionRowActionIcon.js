import React, { useState } from 'react';
import {
  TouchableOpacity, ActionSheetIOS, View,
} from 'react-native';
import { Entypo } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from 'react-redux';
import {
  shape, number, string, bool, func,
} from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import { collectionsSelector, collectionsCountSelector } from '../../redux/selectors';
import Colors from '../../constants/Colors';
import CollectionsDialog, { COLLECTIONS_DIALOG_ACTIONS, CollectionsDialogText } from '../Dialog/CollectionsDialog';
import { isAddingNewCollection, selectCollection } from '../../redux/action-creators';

const CollectionRowActionIcon = ({
  collections,
  collectionId,
  collectionLabel,
  collectionsCount,
  isAddingNewCollectionAction,
  selectCollectionAction,

}) => {
  const [collectionsDialogText, setCollectionsDialogText] = useState(null);
  const navigation = useNavigation();

  const handlePress = () => {
    if (collections[collectionId].preBuilt) {
      ActionSheetIOS.showActionSheetWithOptions({
        options: [
          'Cancel',
          CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.DUPLICATE].title,
        ],
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setCollectionsDialogText(CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.DUPLICATE]);
        }
      });
    } else {
      ActionSheetIOS.showActionSheetWithOptions({
        options: [
          'Cancel',
          'Edit Collection',

          CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.RENAME].title,
          CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.DUPLICATE].title,
          CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.DELETE].title,
        ],
        destructiveButtonIndex: 4,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          selectCollectionAction(collectionId);
          isAddingNewCollectionAction(false);
          navigation.navigate('CollectionInput');
        } else if (buttonIndex === 2) {
          setCollectionsDialogText(CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.RENAME]);
        } else if (buttonIndex === 3) {
          setCollectionsDialogText(CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.DUPLICATE]);
        } else if (buttonIndex === 4) {
          if (collectionsCount <= 1) {
            setCollectionsDialogText(
              CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.DELETE_ERROR],
            );
          } else {
            setCollectionsDialogText(CollectionsDialogText[COLLECTIONS_DIALOG_ACTIONS.DELETE]);
          }
        }
      });
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Entypo name="dots-three-vertical" size={20} color={Colors.headerIcon} />
      </TouchableOpacity>
      {collectionsDialogText && (
        <CollectionsDialog
          collectionId={collectionId}
          collectionLabel={collectionLabel}
          collectionsDialogText={collectionsDialogText}
          setCollectionsDialogText={setCollectionsDialogText}
        />
      )}
    </View>
  );
};

CollectionRowActionIcon.propTypes = {
  collections: shape({}).isRequired,
  collectionId: string.isRequired,
  collectionLabel: string.isRequired,
  collectionsCount: number.isRequired,
  selectCollectionAction: func.isRequired,
  isAddingNewCollectionAction: bool.isRequired,
};

const mapStateToProps = (state) => ({
  collections: collectionsSelector(state),
  collectionsCount: collectionsCountSelector(state),

});

const mapDispatchToProps = {
  isAddingNewCollectionAction: isAddingNewCollection,
  selectCollectionAction: selectCollection,
};

export default connect(mapStateToProps, mapDispatchToProps, null)(CollectionRowActionIcon);
