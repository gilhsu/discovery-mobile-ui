import React from 'react'
import { StyleSheet, TouchableOpacity, ActionSheetIOS, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { connect } from 'react-redux'

import {deleteCollection} from '../../redux/action-creators'
import Colors from '../../constants/Colors';

const CollectionRowActionIcon = ({collectionId, deleteCollectionAction}) => {

  const handlePress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Edit Collection", "Delete Collection"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark'
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          // setResult(Math.floor(Math.random() * 100) + 1);
        } else if (buttonIndex === 2) {
          deleteCollectionAction(collectionId)
        }
      }
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Entypo name="dots-three-horizontal" size={24} color={Colors.darkgrey} />
      </TouchableOpacity>
    </View>
  )
}

const mapDispatchToProps = {
  deleteCollectionAction: deleteCollection
}

export default connect(null, mapDispatchToProps)(CollectionRowActionIcon)

const styles = StyleSheet.create({})
