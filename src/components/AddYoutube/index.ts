import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addSpotifySong, addYoutubeSong } from '../../actions/songActions';
import Component from './component';

const mapState = state => {
  return { accessToken: state.token.token };
};

const mapDispatch = dispatch => {
  return bindActionCreators({ addYoutubeSong, addSpotifySong }, dispatch);
};

export default connect(
  mapState,
  mapDispatch
)(Component);