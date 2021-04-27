import React from 'react';
import {
  StyleSheet, SafeAreaView, StatusBar, View, TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import {
  Header, Right, Title, Left,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import { arrayOf, func, shape } from 'prop-types';

import Timeline from '../components/Timeline';
import ResourceTypePicker from '../components/ResourceTypePicker';
import SubTypeAccordionsContainer from '../components/SubTypeAccordionsContainer'
import Colors from '../constants/Colors';
import FilterDrawer from '../components/FilterDrawer/FilterDrawer';
import DetailsPanel from '../components/DetailsPanel';
import { activeCollectionSelector, selectedRecordsGroupedByTypeSelector } from '../redux/selectors';
import CatalogModal from '../components/Modals/CatalogModal';

const CatalogScreenHeader = ({ collection, handleOpenDrawer }) => (
  <Header style={styles.header}>
    <Left>
      <TouchableOpacity onPress={handleOpenDrawer} style={styles.drawerIcon}>
        <MaterialCommunityIcons name="filter-outline" size={24} color={Colors.headerIcon} />
      </TouchableOpacity>
    </Left>
    <View>
      <Title style={styles.collectionLabel}>{collection?.label}</Title>
    </View>
    <Right>
      <CatalogModal collectionId={collection.id} />
    </Right>
  </Header>
);

CatalogScreenHeader.propTypes = {
  collection: shape({}).isRequired,
  handleOpenDrawer: func,
};

CatalogScreenHeader.defaultProps = {
  handleOpenDrawer: null,
};

const CatalogScreen = ({
  navigation,
  collection,
  selectedRecordsGroupedByType,
}) => (
  <SafeAreaView style={styles.safeAreaView}>
    <StatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
    <Swiper
      loop={false}
      showsPagination={false}
      index={0}
    >
      <FilterDrawer>
        <CatalogScreenHeader collection={collection} />
        <Timeline />
        <ResourceTypePicker />
        <ScrollView style={styles.scrollView}>
          <SubTypeAccordionsContainer data={selectedRecordsGroupedByType} />
        </ScrollView>
      </FilterDrawer>
      <DetailsPanel navigation={navigation} collection={collection} />
    </Swiper>
  </SafeAreaView>
);

CatalogScreen.propTypes = {
  navigation: shape({}).isRequired,
  collection: shape({}).isRequired,
  selectedRecordsGroupedByType: arrayOf(shape({}).isRequired).isRequired,
};

CatalogScreen.defaultProps = {
};

const mapStateToProps = (state) => ({
  collection: activeCollectionSelector(state),
  selectedRecordsGroupedByType: selectedRecordsGroupedByTypeSelector(state),
});

export default connect(mapStateToProps, null)(CatalogScreen);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 0,
  },
  drawerIcon: {
    paddingLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  collectionLabel: {
    color: 'black',
  },
});
