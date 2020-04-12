export default function ({show, children}) {
  if (show) {
    return children;
  } else {
    return false;
  }
};
