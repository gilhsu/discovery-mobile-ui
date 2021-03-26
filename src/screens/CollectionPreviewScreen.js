import React from 'react';
import {
  StyleSheet, View, SafeAreaView, StatusBar, TouchableOpacity,
} from 'react-native';
import { shape, string } from 'prop-types';
import { connect } from 'react-redux';
import {
  Header, Right, Title, Left,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

import Colors from '../constants/Colors';
import CollectionPreviewActionIcon from '../components/Icons/CollectionPreviewActionIcon';
import SubTypeAccordionsContainer from '../components/SubTypeAccordion/SubTypeAccordionsContainer'
import { collectionFlattenedSubTypesSelector } from '../redux/selectors';

const CollectionPreviewScreen = ({
  route, navigation, collections, selectedCollectionId,
  collectionFlattenedSubTypes
}) => {
  const { params: { collectionId } } = route;
  const collection = collections[collectionId];

  if (!collection) {
    return null;
  }
  const selected = collectionId === selectedCollectionId;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      <Header style={styles.header}>
        <Left>
          <TouchableOpacity onPress={() => navigation.navigate('CollectionsList')}>
            <Ionicons name="chevron-back" size={30} color={Colors.primary} />
          </TouchableOpacity>
        </Left>
        <View style={styles.headerTitle}>
          <Title>{collection?.label}</Title>
        </View>
        <Right>
          <CollectionPreviewActionIcon
            selected={selected}
            collectionId={collectionId}
            navigation={navigation}
          />
        </Right>
      </Header>
      <View style={styles.screen}>
        <SubTypeAccordionsContainer showAllSubTypes subTypeData={collectionFlattenedSubTypes} />
      </View>
    </SafeAreaView>
  );
};

CollectionPreviewScreen.propTypes = {
  navigation: shape({}).isRequired,
  collections: shape({}).isRequired,
  route: shape({}).isRequired,
  selectedCollectionId: string.isRequired,
  collectionFlattenedSubTypes: shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  collections: state.collections,
  selectedCollectionId: state.selectedCollection,
  collectionFlattenedSubTypes: collectionFlattenedSubTypesSelector(state),
});

export default connect(mapStateToProps, null)(CollectionPreviewScreen);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  collectionContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 50,
    width: '80%',
  },
  header: {
    backgroundColor: Colors.screenBackground,
    alignItems: 'center',
  },
  headerTitle: {
    width: '70%',
  },
});