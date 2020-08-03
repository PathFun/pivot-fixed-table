import naturalSort from './javascript-natural-sort';

const addSeparators = function (nStr, thousandsSep, decimalSep) {
  const x = String(nStr).split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? decimalSep + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, `$1${thousandsSep}$2`);
  }
  return x1 + x2;
};

const getSort = function (sorters, attr) {
  if (sorters) {
    if (typeof sorters === 'function') {
      const sort = sorters(attr);
      if (typeof sort === 'function') {
        return sort;
      }
    } else if (attr in sorters) {
      return sorters[attr];
    }
  }
  return naturalSort;
};

const numberFormat = function (optsIn) {
  const defaults = {
    digitsAfterDecimal: 2,
    scaler: 1,
    thousandsSep: ',',
    decimalSep: '.',
    prefix: '',
    suffix: '',
  };
  const opts = { ...defaults, ...optsIn };
  return function (x) {
    if (isNaN(x) || !isFinite(x)) {
      return '';
    }
    const result = addSeparators(
      (opts.scaler * x).toFixed(opts.digitsAfterDecimal),
      opts.thousandsSep,
      opts.decimalSep,
    );
    return `${opts.prefix}${result}${opts.suffix}`;
  };
};
const usFmt = numberFormat({ digitsAfterDecimal: 2 });
const usFmtInt = numberFormat({ digitsAfterDecimal: 0 });
const usFmtPct = numberFormat({
  digitsAfterDecimal: 1,
  scaler: 100,
  suffix: '%',
});

export const getValue = function (row, col, treeData) {
  const rowKey = calculateHash(row); const colKey = calculateHash(col);
  return treeData[rowKey][colKey].value() || 0;
};

export const spanSize = function(values, valueIndex, fieldIndex) {
  if (valueIndex > 0
    && values[valueIndex - 1][fieldIndex] === values[valueIndex][fieldIndex]
    && (fieldIndex === 0 || (spanSize(values, valueIndex, fieldIndex - 1) === 0))) {
    return 0;
  }
  let size = 1;
  let i = valueIndex;
  while (i + 1 < values.length
  && values[i + 1][fieldIndex] === values[i][fieldIndex]
  && (fieldIndex === 0
    || (i + 1 < values.length
      && spanSize(values, i + 1, fieldIndex - 1) === 0))) {
    i++;
    size++;
  }
  return size;
};
//
// export const getReverseValue = function (row, col, reverseTreeData, treeHeader) {
//   const rowKey = calculateHash(row); const colKey = calculateHash(col);
//   if (colKey.match(collectReg)) {
//     const reColKey = calculateHash(col.slice(0, col.length - 1)); const reRowKey = calculateHash(row.slice(0, row.length - 1));
//     const target = treeHeader[reColKey]; const source = treeHeader[reRowKey]; const targetValue = aggregators[source.collect](this, [], []);
//     const sourceValue = aggregators[target.collect](this, [], []);
//     for (const key in target.value) {
//       if (key.match(reRowKey)) {
//         targetValue.push(target.value[key].value().toString().replace(',', ''));
//       }
//     }
//     for (const key in source.value) {
//       if (key.match(reColKey)) {
//         sourceValue.push(source.value[key].value().toString().replace(',', ''));
//       }
//     }
//     if (targetValue.value() == sourceValue.value()) {
//       return targetValue.value() || 0;
//     }
//     return `${targetValue.value() || ''} \\ ${sourceValue.value() || ''}`;
//   }
//   return reverseTreeData[colKey][rowKey].value() || 0;
// };

export const calculateHash = function (key) {
  return key.join('-');
};

const aggregatorTemplates = {
  count(formatter = usFmtInt) {
    return function () {
      return {
        count: 0,
        push() {
          this.count++;
        },
        value() {
          return this.format(this.noformat());
        },
        noformat() {
          return this.count;
        },
        format: formatter,
      };
    };
  },

  uniques(fn, formatter = usFmtInt) {
    return function () {
      return {
        uniq: [],
        push(record) {
          if (!Array.from(this.uniq).includes(record)) {
            this.uniq.push(record);
          }
        },
        value() {
          return this.format(this.noformat());
        },
        noformat() {
          return fn(this.uniq);
        },
        format: formatter,
      };
    };
  },

  sum(formatter = usFmt) {
    return function () {
      return {
        sum: 0,
        push(record) {
          if (!isNaN(parseFloat(record))) {
            this.sum += parseFloat(record);
          }
        },
        value() {
          return this.format(this.noformat());
        },
        noformat() {
          return this.sum
        },
        format: formatter,
      };
    };
  },

  extremes(mode, formatter = usFmt) {
    return function (data) {
      return {
        val: null,
        sorter: getSort(
          typeof data !== 'undefined' ? data.sorters : null,
        ),
        push(record) {
          let x = record;
          if (['min', 'max'].includes(mode)) {
            x = parseFloat(x);
            if (!isNaN(x)) {
              this.val = Math[mode](x, this.val !== null ? this.val : x);
            }
          }
          if (
            mode === 'first' && this.sorter(x, this.val !== null ? this.val : x) <= 0
          ) {
            this.val = x;
          }
          if (
            mode === 'last' && this.sorter(x, this.val !== null ? this.val : x) >= 0
          ) {
            this.val = x;
          }
        },
        value() {
          return this.format(this.noformat());
        },
        noformat() {
          return this.val;
        },
        format(x) {
          if (isNaN(x)) {
            return x;
          }
          return formatter(x);
        },
      };
    };
  },

  quantile(q, formatter = usFmt) {
    return function () {
      return {
        vals: [],
        push(record) {
          const x = parseFloat(record);
          if (!isNaN(x)) {
            this.vals.push(x);
          }
        },
        value() {
          this.format(this.noformat())
        },
        noformat() {
          if (this.vals.length === 0) {
            return null;
          }
          this.vals.sort((a, b) => a - b);
          const i = (this.vals.length - 1) * q;
          return (this.vals[Math.floor(i)] + this.vals[Math.ceil(i)]) / 2.0;
        },
        format: formatter,
      };
    };
  },

  runningStat(mode = 'mean', ddof = 1, formatter = usFmt) {
    return function () {
      return {
        n: 0.0,
        m: 0.0,
        s: 0.0,
        push(record) {
          const x = parseFloat(record);
          if (isNaN(x)) {
            return;
          }
          this.n += 1.0;
          if (this.n === 1.0) {
            this.m = x;
          }
          const mNew = this.m + (x - this.m) / this.n;
          this.s += (x - this.m) * (x - mNew);
          this.m = mNew;
        },
        value() {
          this.format(this.noformat())
        },
        noformat() {
          if (mode === 'mean') {
            if (this.n === 0) {
              return 0 / 0;
            }
            return this.format(this.m);
          }
          if (this.n <= ddof) {
            return 0;
          }
          switch (mode) {
            case 'var':
              return this.s / (this.n - ddof);
            case 'stdev':
              return Math.sqrt(this.s / (this.n - ddof));
            default:
              throw new Error('unknown mode for runningStat');
          }
        },
        format: formatter,
      };
    };
  },
};

aggregatorTemplates.countUnique = (f) => aggregatorTemplates.uniques((x) => x.length, f);
aggregatorTemplates.listUnique = (s) => aggregatorTemplates.uniques((x) => x.join(s), (x) => x);
aggregatorTemplates.max = (f) => aggregatorTemplates.extremes('max', f);
aggregatorTemplates.min = (f) => aggregatorTemplates.extremes('min', f);
aggregatorTemplates.first = (f) => aggregatorTemplates.extremes('first', f);
aggregatorTemplates.last = (f) => aggregatorTemplates.extremes('last', f);
aggregatorTemplates.median = (f) => aggregatorTemplates.quantile(0.5, f);
aggregatorTemplates.average = (f) => aggregatorTemplates.runningStat('mean', 1, f);
aggregatorTemplates.var = (ddof, f) => aggregatorTemplates.runningStat('var', ddof, f);
aggregatorTemplates.stdev = (ddof, f) => aggregatorTemplates.runningStat('stdev', ddof, f);

export const aggregators = ((tpl) => ({
  Average: tpl.average(usFmt),
  Sum: tpl.sum(usFmt),
  Count: tpl.count(usFmtInt),
  'Count Unique Values': tpl.countUnique(usFmtInt),
  'List Unique Values': tpl.listUnique(', '),
  'Integer Sum': tpl.sum(usFmtInt),
  Median: tpl.median(usFmt),
  'Sample Variance': tpl.var(1, usFmt),
  'Sample Standard Deviation': tpl.stdev(1, usFmt),
  Minimum: tpl.min(usFmt),
  Maximum: tpl.max(usFmt),
  First: tpl.first(usFmt),
  Last: tpl.last(usFmt),
}))(aggregatorTemplates);

export const collectReg = /\s\(\s(.+?)\s\)/g;
export const collectFun = (d, c) => `${d} ( ${c} )`;
