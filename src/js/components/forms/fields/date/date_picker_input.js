import React from 'react';
import DatePicker from './date_picker';
import DateUtils from './date_utils';
import Moment from 'moment';

const Type = React.PropTypes;

export default React.createClass({

  displayName: "ReactDateField",

  propTypes: {
    dateFormat: Type.oneOf(DateUtils.validFormats),
    disabled: Type.bool,
    fieldColor: Type.oneOf(['light', 'dark']),
    label: Type.string,
    onChange: Type.func,
    // value: Type.oneOfType([Type.string, Type.date])
  },

  getDefaultProps() {
    return {
      disabled: false,
      fieldColor: 'light',
      label: 'Date',
      onChange : function() {},
      value : new Date(),
    }
  },

  momentDate() {
    if (Object.prototype.toString.call(this.props.value) === '[object Date]') {
      return Moment(this.props.value);
    } else {
      return Moment(this.props.value, this.props.dateFormat);
    }
  },

  baseZIndex() {
    return this.state.show ? 300 : 1;
  },

  getInitialState() {
    return {show: false};
  },

  label() {
    if (this.props.label) {
      return <label onClick={this.showDatePicker} className="px2 mb1">{this.props.label}</label>;
    }
  },

  containerClasses() {
    var classes = ['date-field', 'date-field-react-container', 'relative'];
    if (this.props.disabled) classes.push('disabled');
    classes.push(this.props.extraClasses);
    return classes.join(' ');
  },

  fieldClasses() {
    var classes = ['relative', 'fit'];
    classes.push('field-'+this.props.fieldColor);
    return classes.join(' ');
  },

  iconClasses() {
    var classes = ['icon', 'icon-calendar', 'ml1', 'absolute'];
    this.props.disabled ? classes.push('grey-25') : classes.push('blue-70');
    return classes.join(' ');
  },

  maskClasses() {
    var classes = ['icon-bg', 'rounded-2', 'absolute', 'icon-bg-'+this.props.fieldColor];
    if (this.props.disabled) classes.push('disabled');
    return classes.join(' ');
  },

  showDatePicker() {
    if (!this.props.disabled) this.setState({show:true});
  },

  hideDatePicker() {
    this.setState({show:false});
  },

  onChangeDate(date) {
    this.props.value = date;
    this.hideDatePicker();
    this.props.onChange(date);
  },

  datePicker() {
    if (this.state.show) {
      return (
        <div>
          <div
            className='modal-clear-bg'
            onClick={this.hideDatePicker}
            style={{zIndex: this.baseZIndex()-2}}></div>
          <DatePicker
            zIndex={this.baseZIndex()-1}
            date={this.momentDate().toDate()}
            show={this.state.show}
            onChangeDate={this.onChangeDate} />
        </div>
      );
    }
  },

  value() {
    if (DateUtils.validFormats.indexOf(this.props.dateFormat) != -1) {
      return this.momentDate().format(this.props.dateFormat);
    } else {
      return "Invalid date format";
    }
  },

  render() {
    return (
      <div className={this.containerClasses()}>
        {this.label()}
        <br />
        {this.datePicker()}
        <div className='relative rounded-2 overflow-hidden no-select' style={{zIndex: this.baseZIndex()}}>
          <input
            className={this.fieldClasses()}
            disabled={this.props.disabled}
            onFocus={this.showDatePicker}
            onfocusout={this.hideDatePicker}
            readOnly
            type="text"
            value={this.value()} />
          <span
            className={this.iconClasses()}
            onClick={this.showDatePicker}
            style={{zIndex: this.baseZIndex()+2}}></span>
          <div
            className={this.maskClasses()}
            onClick={this.showDatePicker}
            style={{zIndex: this.baseZIndex()+1}}></div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
});
