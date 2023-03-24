import './charList.scss';

import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';

import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Spinner from '../Spinner/Spinner';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    offset: 210,
    additionalCharLoading: false,
    charListDone: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onCharListLoading = () => {
    this.setState({ additionalCharLoading: true });
  };

  onCharListLoaded = (newCharList = []) => {
    const charListDone = newCharList.length < 9 ? true : false;

    this.setState((state) => ({
      charList: [...state.charList, ...newCharList],
      loading: false,
      offset: state.offset + 9,
      additionalCharLoading: false,
      charListDone: charListDone,
    }));
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then((response) => this.onCharListLoaded(response))
      .catch(this.onError);
  };

  charRefs = [];

  setRef = (ref) => {
    this.charRefs.push(ref);
  };

  focusOnItem = (index) => {
    this.charRefs.forEach((item) =>
      item.classList.remove('char__item_selected')
    );

    this.charRefs[index].classList.add('char__item_selected');

    this.charRefs[index].focus();
  };

  renderItems(arr) {
    const items = arr.map((item, index) => {
      const imgStyle = item.thumbnail
        .toLowerCase()
        .includes('image_not_available.jpg')
        ? { objectFit: 'unset' }
        : { objectFit: 'cover' };

      return (
        <li
          className='char__item'
          key={item.id}
          tabIndex={0}
          ref={this.setRef}
          onClick={() => {
            this.props.onCharSelected(item.id);
            this.focusOnItem(index);
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className='char__name'>{item.name}</div>
        </li>
      );
    });

    return <ul className='char__grid'>{items}</ul>;
  }

  render() {
    const {
      charList,
      loading,
      error,
      offset,
      additionalCharLoading,
      charListDone,
    } = this.state;

    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    const btnStyle = charListDone ? { display: 'none' } : { display: 'block' };

    return (
      <div className='char__list'>
        {errorMessage}
        {spinner}
        {content}
        <button
          style={btnStyle}
          className='button button__main button__long'
          disabled={additionalCharLoading}
          onClick={() => this.onRequest(offset)}
        >
          <div className='inner'>load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
