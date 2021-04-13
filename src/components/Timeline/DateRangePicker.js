import React from 'react';
import { func, instanceOf, shape } from 'prop-types';
import {
  SafeAreaView, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import {
  min, max, startOfDay, endOfDay,
} from 'date-fns';

import { updateDateRange } from '../../redux/action-creators';
import DatePicker from './DatePicker';
import { timelinePropsSelector, dateRangeFilterFiltersSelector } from '../../redux/selectors';

const DateRangePicker = ({ timelineProps, dateRangeFilter, updateDateRangeFilter }) => {
  const { minimumDate, maximumDate } = timelineProps;
  if (!minimumDate || !maximumDate) {
    return null;
  }

  const { dateRangeStart = minimumDate, dateRangeEnd = maximumDate } = dateRangeFilter;

  return (
    <SafeAreaView style={styles.container}>
      <DatePicker
        label="Start"
        activeDate={dateRangeStart}
        minimumDate={minimumDate}
        maximumDate={min([maximumDate, dateRangeEnd])}
        onDateSelect={(d) => updateDateRangeFilter('dateRangeStart', startOfDay(d))}
      />
      <DatePicker
        label="End"
        activeDate={dateRangeEnd}
        minimumDate={max([minimumDate, dateRangeStart])}
        maximumDate={maximumDate}
        onDateSelect={(d) => updateDateRangeFilter('dateRangeEnd', endOfDay(d))}
      />
    </SafeAreaView>
  );
};

DateRangePicker.propTypes = {
  timelineProps: shape({
    minimumDate: instanceOf(Date),
    maximumDate: instanceOf(Date),
  }).isRequired,
  dateRangeFilter: shape({
    dateRangeStart: instanceOf(Date),
    dateRangeEnd: instanceOf(Date),
  }).isRequired,
  updateDateRangeFilter: func.isRequired,
};

const mapStateToProps = (state) => ({
  timelineProps: timelinePropsSelector(state),
  dateRangeFilter: dateRangeFilterFiltersSelector(state),
});

const mapDispatchToProps = {
  updateDateRangeFilter: updateDateRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(DateRangePicker);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  picker: {
  },
});
