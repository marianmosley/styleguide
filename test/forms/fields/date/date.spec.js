import { expect } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';
import React from 'react';
import Moment from 'moment';
import DateField from 'forms/fields/date/date';

describe('DateField', () => {

  const renderComponent = (givenProps) => TestUtils.renderIntoDocument(
    <DateField {...givenProps} />
  );

  let props;
  beforeEach(() => {
    props = { dateFormat: 'MMM D, YYYY' };
  });

  it('renders successfully', () => {
    let component = renderComponent(props);
    TestUtils.findRenderedDOMComponentWithClass(component, 'date-field');
  });

  describe('refs.*.value()', () => {
    class Example extends React.Component {
      constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {};
      }
      render() {
        return (
          <DateField
            name="startDate"
            ref="startDate"
            label="Start Date"
            dateFormat="MM/DD/YYYY"
            key={this.state.startDate}
            defaultValue={this.state.startDate}
          />
        );
      }
    }

    it("is the defaultValue as parsed by its dateFormat", () => {
      let component = TestUtils.renderIntoDocument(<Example />);
      expect(
        React.findDOMNode(component).getElementsByTagName('input')[0].value
      ).to.eql('');
      expect(component.refs.startDate.value()).to.be.null;
      component.setState({ startDate: 1431648000000 });
      expect(
        React.findDOMNode(component).getElementsByTagName('input')[0].value
      ).to.eql('05/15/2015');
      expect(component.refs.startDate.value().format('MM/DD/YYYY')).to.eql('05/15/2015');
    });

    it('is set the a date string in the given dateFormat when clicked through the UI', (done) => {
      let component = TestUtils.renderIntoDocument(<Example />);

      let overlay = component.refs.startDate.refs.overlay;
      TestUtils.Simulate.click(
        React.findDOMNode(overlay)
      );

      let firstDay = TestUtils.scryRenderedDOMComponentsWithClass(
        component, 'day'
      )[0];
      setTimeout(() => {
        try {
          // click the first day of this month
          const dayNode = TestUtils.scryRenderedDOMComponentsWithTag(firstDay, 'div')[1];
          TestUtils.Simulate.click(
            dayNode
          );
          // desired value is set
          expect(component.refs.startDate.value().format('MM/DD/YYYY')).to.eql(
            Moment().startOf('month').format('MM/DD/YYYY')
          );
          // overlay closes
          expect(
            TestUtils.scryRenderedDOMComponentsWithClass(
              component, 'day'
            ).length
          ).to.eql(0);
          done();
        } catch (e) {
          done(e);
        }
      }, 0);
    });

    it('is set the a date string in the given dateFormat when clicked through the UI', (done) => {
      let component = TestUtils.renderIntoDocument(<Example />);

      let overlay = React.findDOMNode(component.refs.startDate.refs.overlay);
      TestUtils.Simulate.click(overlay);

      let firstDay = TestUtils.scryRenderedDOMComponentsWithClass(
        component, 'day'
      )[0];
      setTimeout(() => {
        try {
          // click the first day of this month
          const dayNode = TestUtils.scryRenderedDOMComponentsWithTag(firstDay, 'div')[1];
          TestUtils.Simulate.click(
            dayNode
          );
          // desired value is set
          expect(component.refs.startDate.value().format('MM/DD/YYYY')).to.eql(
            Moment().startOf('month').format('MM/DD/YYYY')
          );
          // overlay closes
          expect(
            TestUtils.scryRenderedDOMComponentsWithClass(
              component, 'day'
            ).length
          ).to.eql(0);
          done();
        } catch (e) {
          done(e);
        }
      }, 0);
    });
  });
});
