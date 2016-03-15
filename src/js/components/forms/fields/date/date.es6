import React from 'react';
import DatePicker from './date-picker';
import { fieldProps, FieldBase } from '../base.es6';
import Moment from 'moment';
import Tooltip from '../../../overlays/tooltip';
import Overlay from '../../../overlays/overlay-click';
import omit from '../../../utils/omit';

const Type = React.PropTypes;

// Note: The value of date.month() for 1/1/2015 is 0, not 1

let validDateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'MMM D, YYYY'];

class DateField extends FieldBase {

  constructor() {
    super();
    this.handleDate = this.handleDate.bind(this);
  }

  baseContainerClasses() {
    return ['date-field', 'col-3'];
  }

  boundedMaxDate() {
    if (!!this.props.maxDate) {
      if (this.props.includeMaxMinBounds) {
        return this.momentDate(this.props.maxDate).add(1, 'day');
      } else {
        return this.momentDate(this.props.maxDate);
      }
    }
  }

  boundedMinDate() {
    if (!!this.props.minDate) {
      if (this.props.includeMaxMinBounds) {
        return this.momentDate(this.props.minDate).subtract(1, 'day');
      } else {
        return this.momentDate(this.props.minDate);
      }
    }
  }

  handleDate(moment) {
    const value = moment.format(this.props.dateFormat);
    this.handleChange(value);
  }

  convertInternationalDate(value) {
    var parts = value.split('/');
    return new Date(parts[1]-1, parts[0], parts[2]);
  }

  datePicker() {
    //Date.parse cannot handle "DD/MM/YYYY"
    var DateUS = this.props.dateFormat==='DD/MM/YYYY' ? this.convertInternationalDate(this.state.value) : this.state.value;
    return (
      <DatePicker date={this.state.value ? Moment(Date.parse(this.dateUS)) : Moment()}
                  maxDate={this.boundedMaxDate()}
                  minDate={this.boundedMinDate()}
                  onChangeDate={this.handleDate} />
    );
  }

  disabled() {
    return this.props.disabled || !this.isFormatValid();
  }

  iconStyle() {
    return {
      right: '8px',
      top: '6px',
      fontSize: '15px'
    };
  }

  validate(value=null) {
    if ((!!value && !this.momentDate(value).isValid()) || (!!this.state.value && !this.momentDate(this.state.value).isValid())) {
      return ['Invalid date'];
    } else {
      return [];
    }
  }

  isFormatValid() {
    return validDateFormats.indexOf(this.props.dateFormat) != -1;
  }

  triggerContent() {
    const spreadProps = omit(this.props, 'onChange', 'defaultValue');

    return (
      <div className='relative rounded-2 no-select' >
        <input className={this.inputClasses()}
               id={this.props.name}
               type="text"
               value={this.inputValue()} 
               {...spreadProps} />
        <span className='icon-calendar ml1 absolute'
              style={this.iconStyle()}></span>
      </div>
    );
  }

  momentDate(date) {
    if (!date) {
      return null;
    }

    switch (date.constructor.name) {
      case "Date":
      case "Number":
        return Moment(date);
      case "Moment":
        return date;
      case "String":
        return Moment(date, this.props.dateFormat);
      default:
        return null;
    }
  }

  tooltip() {
    return (
      <Tooltip content={this.datePicker()}
               position='top-right'
               right='-24px'
               top='37px' />
    );
  }

  inputValue() {
    const {
      value
    } = this.state;

    if (value) {
      if (typeof value === 'object') {
        return value.format(this.props.dateFormat);
      } else {
        return value;
      }
    }
  }

  contents() {
    if (!this.disabled()) {
      return (
        <Overlay content={this.tooltip()} ref="overlay">
          {this.triggerContent()}
        </Overlay>
      );
    } else {
      return this.triggerContent();
    }
  }
};

DateField.displayName = "DateField";

DateField.propTypes = Object.assign({
  dateFormat: Type.oneOf(validDateFormats).isRequired,
  includeMaxMinBounds: Type.bool,
  maxDate: Type.oneOfType([Type.object, Type.string, Type.number]),
  minDate: Type.oneOfType([Type.object, Type.string, Type.number])
}, fieldProps);

export default DateField;
