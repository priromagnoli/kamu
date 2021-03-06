import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import { getBook } from '../../../services/BookService';
import BookDetail from './BookDetail';
import LoadingIndicator from '../../LoadingIndicator';
import { CLOSE_BOOK_ACTION } from '../../../utils/constants';
import useDocumentTitle from '../../../utils/useDocumentTitle';
import ErrorMessage from '../../error/ErrorMessage';

const BookDetailContainer = (props) => {
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  let pageTitle = null;
  if (book && book.title) pageTitle = book.title;
  useDocumentTitle(pageTitle);

  useEffect(() => {
    getBook(props.librarySlug, props.bookId).then(setBook).catch((e) => {
      if (/not found/i.test(e.message)) {
        setError('Sorry, we could not find the book you were looking for.');
      } else {
        setError('Sorry, we could not load the book. Please try again.');
      }
    });
  }, []);

  function close() {
    props.onAction(CLOSE_BOOK_ACTION, book);
  }

  return (
    <Dialog
      onClose={close}
      maxWidth="md"
      data-testid="book-detail-wrapper"
      open
    >
      <DialogActions>
        <IconButton onClick={close} key="clear" className="modal-book__close" data-testid="modal-close-button">
          <Clear />
        </IconButton>
      </DialogActions>

      <DialogContent className="modal-container">
        {book && (
          <BookDetail
            book={book}
            onAction={(action) => {
              props.onAction(action, book).then((updatedBook) => {
                if (updatedBook) setBook(updatedBook);
              });
            }}
          />
        )}
        {(book == null && error == null) && <LoadingIndicator />}
        {(error) && (
          <ErrorMessage
            title="There was an error loading this book."
            subtitle={error}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

BookDetailContainer.propTypes = {
  librarySlug: PropTypes.string.isRequired,
  bookId: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default BookDetailContainer;
