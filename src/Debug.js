import React, {Component} from 'react';

class Debug extends Component {
  render() {
    return Object.entries(this.props.status).map(([k, v]) => {
      return (
        <div key={k}>
          {k} = {v}
        </div>
      );
    });
  }
}

export default Debug;
