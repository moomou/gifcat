import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

import message, {type as MessageType} from '../../shared/message';

import '../../sass/default.scss';

const DEBOUNCE_MS = 250;

const Gfycat = React.createClass({
  showing: false,
  outstandingTimeout:{},

  propTypes: {
    ipcServer: PropTypes.object,
  },
  getInitialState() {
    return {
      url: '',
    };
  },
  componentDidMount() {
    this.props.ipcServer.register('async', message.URL_RESULT, data => {
      console.log('Received: ', data);

      // chop off the first 10 sec (5 items) to account for analysis
      data.result.result.slice(5).forEach((probs, idx) => {
        if (probs[1] > 0.98) {
          setTimeout(() => {
            this.props.ipcServer.send(MessageType.ASYNC, {
              data: { url: data.url },
              action: message.GET_GIF,
            });
          }, idx * 2 * 1000 + 8000);
        }
      });
    });

    this.props.ipcServer.register('async', message.SHOW_GIF, data => {
      // avoid showing if already showing???
      if (this.showing) return;
      this.showing = true;

      // take the first one, and show it
      const gif = data.gfycats[0].gifUrl;
      this.setState({ url: gif });

      setTimeout(() => {
        this.showing = false;
        this.props.ipcServer.send(MessageType.ASYNC, {
          action: message.HIDE_APP,
        });
      }, 2000); // show for 2 seconds );
    });

    setInterval(() => {
      this.props.ipcServer.send(MessageType.ASYNC, {
        action: message.CHECK_URL,
      });
    }, 1000);
  },

  render() {
    return (
      <div className="container" hidden={!this.state.url}>
        <img src={this.state.url} alt="no data"/>
      </div>
    );
  },
});

let cat;
export function init(id, ipcServer) {
  if (cat) return cat;

  cat = ReactDOM.render(
    <Gfycat
      ipcServer={ipcServer}
    />,
    document.querySelector('#' + id)
  );

  return cat;
}
