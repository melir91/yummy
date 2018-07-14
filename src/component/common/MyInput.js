// MyInput.js
import { withFormsy } from 'formsy-react';
import React from 'react';

class MyInput extends React.Component {
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(event) {
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    // Important: Don't skip this step. This pattern is required
    // for Formsy to work.
    this.props.setValue(event.currentTarget.value);
  }

  render() {
    // An error message is returned only if the component is invalid
    let errorMessage = this.props.getErrorMessage() ? <span className="alert-danger">{this.props.getErrorMessage()}</span> : null;
    let inputClass = this.props.getErrorMessage() ? 'form-control alert-danger' : 'form-control';
    let element;

    if (this.props.type === 'textarea') {
      element = <textarea onChange={this.changeValue} className={inputClass} value={this.props.getValue() || ''} rows="4"></textarea>
    } else {
      element = <input onChange={this.changeValue} className={inputClass} type={this.props.type || 'text'} value={this.props.getValue() || ''} disabled={this.props.disabled || false} />
    }
    return (
      <div className="form-group">
        {element}
        {errorMessage}
      </div>
    );
  }
}

export default withFormsy(MyInput);