const React = require('react');
const Film = require('./Producto');
const { getFilm } = require('../index');

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }
  componentDidMount() {
    const { id } = this.props;
    gteProduct(id).then(data => this.setState({ data }))
  }
  render() {
    const { data } = this.state;
    return data ? <Producto {...data} /> : null;
  }
}
