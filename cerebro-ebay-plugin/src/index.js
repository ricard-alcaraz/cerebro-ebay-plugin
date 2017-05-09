'use strict';
//const React = require('react');
import React from 'react'
//import React from 'react'
//const Preview = require('./Preview');
import Preview from './preview'
const { memoize } = require('cerebro-tools');

const BASE_URL='http://svcs.ebay.com/services/search/FindingService/v1';
const notEmpty = value => value && value !== 'N/A';
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

    
const getProduct = memoize((q) => (
  fetch(`${BASE_URL}?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=RicardAl-Prueba1-PRD-c69e2c47f-8a8d2215&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${q}&paginationInput.entriesPerPage=10`)
    .then(response => response.json())
    .then(json => json.findItemsByKeywordsResponse[0].searchResult[0].item)
    .then(json => (json || []).map(removeEmptyKeys))
))
const getProductPrice = memoize((q, q2) => (
  fetch(`${BASE_URL}?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=RicardAl-Prueba1-PRD-c69e2c47f-8a8d2215&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${q}&paginationInput.entriesPerPage=10&itemFilter(0).name=MaxPrice&itemFilter(0).value=${q2}&itemFilter(0).paramName=Currency&itemFilter(0).paramValue=USD`)
    .then(response => response.json())
    .then(json => json.findItemsByKeywordsResponse[0].searchResult[0].item)
    .then(json => (json || []).map(removeEmptyKeys))
))


const plugin = (scope) => {
    // \s(\d+) para numeros 
    const match = scope.term.match(/ebay\s(.+)/i);
    console.log(match);
     if(match[0].includes("price")){
         const match = scope.term.match(/ebay\s(.+)\sprice\s(\d+)/i);
      const q = match[1];
      const q2 = match[2];
      console.log(match[1]);
      console.log(match[2]);
      getProductPrice(q, q2).then(items => {
      if (!items) {
        return;
      }
      const results = items.map(item => ({
        id: item.itemId,
        title: item.title,
        subtitle:`${item.sellingStatus[0].currentPrice[0].__value__}$`,
        clipboard:`${item.viewItemURL}`,
        icon:`${item.galleryURL}`,
        onSelect: (event) =>  scope.actions.open(`${item.viewItemURL}`),
        getPreview: () => <Preview name={item.title} imagen={item.galleryURL} precio={item.sellingStatus[0].currentPrice[0].__value__} link={item.viewItemURL} lugar={item.location} precioventa={item.shippingInfo[0].shippingServiceCost[0].__value__} payment={item.paymentMethod}/>
      }))
      scope.display(results)
      console.log(results);
    })
     }else{
         const q = match[1];
      getProduct(q).then(items => {
      if (!items) {
        return;
      }
      const results = items.map(item => ({
        id: item.itemId,
        title: item.title,
        subtitle:`${item.sellingStatus[0].currentPrice[0].__value__}$`,
        clipboard:`${item.viewItemURL}`,
        icon:`${item.galleryURL}`,
        onSelect: (event) =>  scope.actions.open(`${item.viewItemURL}`),
        getPreview: () => <Preview name={item.title} imagen={item.galleryURL} precio={item.sellingStatus[0].currentPrice[0].__value__} link={item.viewItemURL} lugar={item.location} precioventa={item.shippingInfo[0].shippingServiceCost[0].__value__} payment={item.paymentMethod}/>

      }))
      scope.display(results)
      console.log(results);
    })
      
     };
   
//  scope.display({
//    title: 'It works!',
//    subtitle: `You entered ${scope.term}`,
//  })
    
  
}

//http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=RicardAl-Prueba1-PRD-c69e2c47f-8a8d2215&GLOBAL-ID=EBAY-US&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords=harry%20potter&paginationInput.entriesPerPage=10

module.exports = {
  name: 'Search on eBay...',
  keyword: 'ebay',
  fn: plugin
}