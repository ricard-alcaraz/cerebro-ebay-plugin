//'use strict';
const React = require('react');
const styles = require('./styles.css');

module.exports = ({name,imagen,precio,link,lugar,precioventa,coin}) => {
    
  if(precioventa==0.0){
        pv=<div className={styles.venta}>Shipping Cost: Free</div>
    }else{
        pv=<div className={styles.venta}>Shipping Cost: {precioventa} {coin}</div>
    }
    return (
    <div key={name} className={styles.producto}>
    <a href={link}><div className={styles.nombre}>{name}</div></a>
    <img src={imagen} className={styles.imagen}/>
    <div className={styles.pr}>
    <div className={styles.precio}>{precio} {coin}</div>
    {pv}
    <a href={link} className={styles.boton}>Visit</a>
    </div>
    <div>Location: {lugar}</div>
    </div>
  );
  
};