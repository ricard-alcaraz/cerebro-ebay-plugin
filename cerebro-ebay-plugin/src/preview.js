//'use strict';
const React = require('react');
const styles = require('./styles.css');

module.exports = ({name,imagen,precio,link,lugar,precioventa,payment}) => {
//    console.log(payment);
//paypal=<img src="https://www.acens.com/wp-content/images/2013/02/paypal-acens.png" width="60px"/>
//visamc=<img src="http://ca.kamazu.net/Content/Images/uploaded/visaMaster.png" width="60px"/>
//amex=<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/2000px-American_Express_logo.svg.png" width="60px"/>
//discover=<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Discover_Card_logo.svg/2000px-Discover_Card_logo.svg.png" width="60px"/>
//    if(payment.includes("PayPal")){
//        buy=<div className={styles.payment}>{paypal}</div>
//    }if(payment.includes("VisaMC")){
//        buy=<div className={styles.payment}>{visamc}</div>
//    }if(payment.includes("AmEx")){
//        buy=<div className={styles.payment}>{amex}</div>
//    }if(payment.includes("Discover")){
//        buy=<div className={styles.payment}>{discover}</div>
//    }
//    if(payment.includes("PayPal")&&payment.includes("VisaMC")&&payment.includes("AmEx")&&payment.includes("Discover")){
//        buy=<div className={styles.payment}>{paypal}{visamc}{amex}{discover}</div>
//    }
//        else{
//        buy=<div className={styles.payment}></div>
//        
//    }
  if(precioventa==0.0){
        pv=<div className={styles.venta}>Shipping Cost: Free</div>
    }else{
        pv=<div className={styles.venta}>Shipping Cost: {precioventa}$</div>
    }
    return (
    <div key={name} className={styles.producto}>
    <a href={link}><div className={styles.nombre}>{name}</div></a>
    <img src={imagen} className={styles.imagen}/>
    <div className={styles.pr}>
    <div className={styles.precio}>{precio} USD</div>
    {pv}
    
    <a href={link} className={styles.boton}>Visit</a>
    </div>
    <div>Location: {lugar}</div>
    </div>
  );
};