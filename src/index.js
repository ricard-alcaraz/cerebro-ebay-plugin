'use strict';
import { app, remote, ipcRenderer } from 'electron'
import fs from 'fs'
//const React = require('react');
//importem react
import React from 'react'
const electronApp = remote ? remote.app : app

//importem el fitcher "preview" que amb react ens permet veure el producte al costat dret
import Preview from './preview'
//process.env.GOOGLE_API_KEY = 'AIzaSyDhq_xbeBWa2PeqADdwZNHtu21fq-9OjvE';
const { memoize } = require('cerebro-tools');
const countries = ['ES','US','AT','AU','CH','DE','CA','FR','BE','GB','HK','IE','IN','IT','MY','NL','PH','PL','SG'];
const BASE_URL='http://svcs.ebay.com/services/search/FindingService/v1';
const notEmpty = value => value && value !== 'N/A';
const API = 'UmljYXJkQWwtUHJ1ZWJhMS1QUkQtYzY5ZTJjNDdmLThhOGQyMjE1';
const APId = window.atob(API);
const fn = ({term, display, actions}) => {

};
const removeEmptyKeys = (hash) => (
  Object
    .keys(hash)
    .reduce((acc, key) => {
      if (notEmpty(hash[key])) {
        return Object.assign(acc, {[key]: hash[key]})
      }
      return acc;
    }, {})
)
//agafem l'idioma del sistema
const getLocal = () =>{
    const locale = electronApp.getLocale();
    return locale;
}
//En el cas de que funciones agafem la posicio
const getPosition = () => {
           navigator.geolocation.getCurrentPosition((pos) => {
      console.log('POS: ' + pos);
    }, (err) => {
      console.log('Geolocation error: ', err);
    }, {enableHighAccuracy: false});

//     if (navigator.geolocation) {
//  var timeoutVal = 10 * 1000 * 1000;
//  navigator.geolocation.getCurrentPosition(
//    displayPosition,
//    displayError,
//    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
//  );
//}
//else {
//  alert("Geolocation is not supported by this browser");
//}

};
const displayPosition = (position) => {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
};

const displayError = (error) =>{
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}
//fem una trucada a l'API de eBay
const getProduct = memoize((q,local) => (
  fetch(`${BASE_URL}?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${APId}&GLOBAL-ID=EBAY-${local}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${q}&paginationInput.entriesPerPage=20&sortOrder=BestMatch`)
    .then(response => response.json())
    .then(json => json.findItemsByKeywordsResponse[0].searchResult[0].item)
    .then(json => (json || []).map(removeEmptyKeys))
))
//fem una trucada a l'API de eBay
const getProductPrice = memoize((q, q2,local) => (
  fetch(`${BASE_URL}?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${APId}&GLOBAL-ID=EBAY-${local}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${q}&paginationInput.entriesPerPage=20&itemFilter(0).name=MaxPrice&itemFilter(0).value=${q2}&itemFilter(0).paramName=Currency&itemFilter(0).paramValue=USD&sortOrder=BestMatch`)
    .then(response => response.json())
    .then(json => json.findItemsByKeywordsResponse[0].searchResult[0].item)
    .then(json => (json || []).map(removeEmptyKeys))
))
//el contingut del Plugin
const plugin = (scope) => {
    const match = scope.term.match(/ebay\s(.+)/i);
    if(match){
    const p = 0;
    //getPosition();
    const tloc = getLocal();
    var local = tloc.toUpperCase();
    console.log(local);
    //for( const i=0;i<countries.length;i++){
    //Si l'idioma del sistema equival a un pais on eBay te productes els busca
    if(countries.indexOf(local) > -1){
   // if(countries.includes(local)){
         console.log('Available Country');
    }else{
        //si no per defecte va a la dels Estats Units
         local='US';
    }
    //}
    console.log(local);
   // }
   //ho escrit a l'aplicacio ha de coincidir amb la paraula "ebay"

    scope.display({
    title: 'Type PRICE and a number to search by maximum price'
  })
    //console.log(match);
    //si conte la paraula price buscara per preu maxim al preu escrit
     if(match[0].includes("price")){
         const match = scope.term.match(/ebay\s(.+)\sprice\s(\d+)/i);
      const q = match[1];
      const q2 = match[2];
      getProductPrice(q, q2,local).then(items => {
      if (!items) {
        return;
      }
      const results = items.map(item => ({
        id: item.itemId,
        title: item.title,
        subtitle:`${item.sellingStatus[0].currentPrice[0].__value__}${item.sellingStatus[0].currentPrice[0]["@currencyId"]}`,
        clipboard:`${item.viewItemURL}`,
        icon:`${item.galleryURL}`,
        onSelect: (event) =>  scope.actions.open(`${item.viewItemURL}`),
        getPreview: () => <Preview name={item.title} imagen={item.galleryURL} precio={item.sellingStatus[0].currentPrice[0].__value__} link={item.viewItemURL} lugar={item.location} precioventa={item.shippingInfo[0].shippingServiceCost[0].__value__} payment={item.paymentMethod} coin={item.sellingStatus[0].currentPrice[0]["@currencyId"]}/>
      }))
      scope.display(results)
      console.log(results);
    })
     }
    //si no busca el producte que coincideix millor amb la paraula escrita
    else{
         const q = match[1];
      getProduct(q, local).then(items => {
      if (!items) {
        return;
      }
      const results = items.map(item => ({
        id: item.itemId,
        title: item.title,
        subtitle:`${item.sellingStatus[0].currentPrice[0].__value__}${item.sellingStatus[0].currentPrice[0]["@currencyId"]}`,
        clipboard:`${item.viewItemURL}`,
        icon:`${item.galleryURL}`,
        onSelect: (event) =>  scope.actions.open(`${item.viewItemURL}`),
        getPreview: () => <Preview name={item.title} imagen={item.galleryURL} precio={item.sellingStatus[0].currentPrice[0].__value__} link={item.viewItemURL} lugar={item.location} precioventa={item.shippingInfo[0].shippingServiceCost[0].__value__} payment={item.paymentMethod} coin={item.sellingStatus[0].currentPrice[0]["@currencyId"]}/>

      }))
      scope.display(results)
      console.log(results);
    })
     };

}
}

//http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=RicardAl-Prueba1-PRD-c69e2c47f-8a8d2215&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords=harry%20potter&paginationInput.entriesPerPage=10

module.exports = {
  name: 'Search on eBay...',
  keyword: 'ebay',
  fn: plugin
}
