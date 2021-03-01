import { includes, filter, orderBy } from "lodash"

const inrFormat = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

export const CurrencyFormat = (amount) => {
  amount = Number(amount);
  return inrFormat.format(amount);
};

export const valueInLacs=(amount)=>{
    // if (amount !== 0 && !amount) return "-";
    if(amount<100000){
       return CurrencyFormat(amount)
    }
    amount = Math.abs(amount/100000).toFixed(2);

    return `₹${amount} lac`;
}

export const getSearchResultsCardMgt = (searchText,dataObj) => {
  let finalData;
  if (searchText != "") {
    finalData = dataObj.filter((value, index) => {
      return (
        includes(value.fleetCardID, searchText) ||
        includes(value.fleetCardId, searchText) ||
        includes(value.cardName, searchText) ||
        includes(value.cardname, searchText)
      );
    });
  } else {
    finalData = dataObj;
  }

  return finalData;
}

export const getOrderedData = (objData, sortColumn, sortOrder) => {
  return orderBy(objData,[sortColumn],[sortOrder])
}