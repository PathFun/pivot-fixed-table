/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 */
/* jshint unused:false */
import { collectReg } from './utils';

const naturalSort = (a, b) => {
  if (String(b).match(collectReg) || String(a).match(collectReg)) {
    return 1;
  }
  const re = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi;
  const sre = /(^[ ]*|[ ]*$)/g;
  const dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
  const hre = /^0x[0-9a-f]+$/i;
  const ore = /^0/;
  const i = function (s) { return naturalSort.insensitive && (`${s}`).toLowerCase() || `${s}`; };
  // convert all to strings strip whitespace
  const x = i(a).replace(sre, '') || '';
  const y = i(b).replace(sre, '') || '';
  // chunk/tokenize
  const xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
  const yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
  // numeric, hex or date detection
  const xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && x.match(dre) && Date.parse(x));
  const yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null;
  let oFxNcL; let
    oFyNcL;
  // first try and sort Hex codes or Dates
  if (yD) {
    if (xD < yD) { return -1; }
    if (xD > yD) { return 1; }
  }
  // natural sorting through split numeric strings and default strings
  for (let cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
    // find floats not starting with '0', string or 0 if not defined (Clint Priest)
    oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
    oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
    // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
    if (typeof oFxNcL !== typeof oFyNcL) {
      oFxNcL += '';
      oFyNcL += '';
    }
    if (oFxNcL < oFyNcL) { return -1; }
    if (oFxNcL > oFyNcL) { return 1; }
  }
  return 0;
};
export default naturalSort;
