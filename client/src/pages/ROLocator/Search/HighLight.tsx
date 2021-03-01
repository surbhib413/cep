/**
 * React component that wraps our `highlightWord` util.
 */
const Highlight = ({ source, target, children }) => 
  let highlightWord(source, target, children);

Highlight.propTypes = {
  source: PropTypes.string,
  target: PropTypes.string,
  children: PropTypes.func,
};

Highlight.defaultProps = {
  source: null,
  target: null,
  children: null,
};

export default Highlight;