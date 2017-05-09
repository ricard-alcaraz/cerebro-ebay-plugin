//'use strict';
const React = require('react');
const styles = require('./styles.css');

module.exports = ({name,imagen }) => {
  return (
    <div key={name}>
    <img src={imagen} className={styles.preview}/>
    <div>{item.title}</div>
    </div>
  );
};