<template>
  <div class="flex-row container over-hidden">
    <PinLeftTable
      ref="child"
      :internal-row-fields="internalRowFields"
      :internal-col-fields="internalColFields"
      :th-style="thStyle"
      :defaultFieldWidth="defaultFieldWidth"
      :autoWidth="autoWidth"
      :sorted-rows="sortedRows"
      :sorted-cols="sortedCols"/>
    <RightTable
      :sorted-rows="sortedRows"
      :sorted-cols="sortedCols"
      :tree-data="treeData"
      :defaultFieldWidth="defaultFieldWidth"
      :autoWidth="autoWidth"
      :last-height-style="lastHeightStyle"
      :font-size="fontSize"
      :reverse-tree-data="reverseTreeData"
      :internal-col-fields="internalColFields"
      :padding-width="paddingWidth"
      :th-style="thStyle"
      :ops="ops"
      @scrollTop="scrollTop"
      class="over-hidden flex-column"/>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { firstBy } from 'thenby';
import naturalSort from '../../utils/javascript-natural-sort';
import PinLeftTable from './PinLeftTable.vue';
import RightTable from './RightTable.vue';
import {
  aggregators, calculateHash, collectReg,
} from '../../utils/utils';
import { getTextWidth } from '../../utils/getTextWidth';

const target = {
  key: 'targetFields',
  label: '指标',
  sortState: 0,
  values: [],
};

export default {
  name: 'PivotTable',
  model: {
    prop: 'fieldValues',
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    field: {
      type: Object,
      default: () => {
      },
    },
    fieldValues: {
      type: Object,
      default: () => {
      },
    },
    changeFields: {
      type: Object,
      default: () => ({}),
    },
    padding: {
      type: Array,
      default: () => [5, 10, 5, 10],
    },
    fontSize: {
      type: Number,
      default: 14,
    },
    noDataWarningText: {
      type: String,
      default: 'No data to display.',
    },
    isDataLoading: {
      type: Boolean,
      default: false,
    },
    autoWidth: {
      type: Boolean,
      default: true,
    },
    defaultFieldWidth: {
      type: Number,
      default: 100,
    },
    selectAllText: {
      type: String,
      default: 'Select all',
    },
    unselectAllText: {
      type: String,
      default: 'Unselect all',
    },
    aggregatorName: {
      type: String,
      default: 'Sum',
    },
    ops: {
      type: Object,
      default: () => ({}),
    },
    paddingWidth: {
      type: Number,
      default: 16,
    },
  },
  data() {
    return {
      isDataComputing: false,
      rows: [],
      cols: [],
      internalRowFields: [],
      internalColFields: [],
      computingInterval: null,
      allTotal: null,
      colTotals: null,
      rowTotals: null,
      treeData: null,
      reverseTreeData: null,
      treeHeader: {},
      calculateHash,
      collectReg,
      thStyle: {},
      lastHeightStyle: 0,
    };
  },
  components: {
    PinLeftTable,
    RightTable,
  },
  computed: {
    sortedRows() {
      let composedSortFunction;
      this.internalRowFields.forEach((row, rowIndex) => {
        if (rowIndex === 0) {
          composedSortFunction = firstBy(0, { cmp: row.sort || naturalSort });
        } else {
          composedSortFunction = composedSortFunction
            .thenBy(rowIndex, { cmp: row.sort || naturalSort });
        }
      });
      return [...this.rows].sort(composedSortFunction);
    },
    sortedCols() {
      let composedSortFunction;
      this.internalColFields.forEach((col, colIndex) => {
        if (colIndex === 0) {
          composedSortFunction = firstBy(0, { cmp: col.sort || naturalSort });
        } else {
          composedSortFunction = composedSortFunction
            .thenBy(colIndex, { cmp: col.sort || naturalSort });
        }
      });
      return [...this.cols].sort(composedSortFunction);
    },
  },
  created() {
    this.$nextTick(() => {
      this.updateValues();
    });
    this.thStyle = {
      padding: this.padding.reduce((style, item) => `${style} ${item}px`, ''),
      fontSize: `${this.fontSize}px`,
    };
    this.lastHeightStyle = {
      ...this.thStyle,
      height: `${(this.fontSize + this.padding[0]) * 2 + 1}px`,
    };
  },
  watch: {
    changeFields() {
      this.updateValues();
    },
  },
  methods: {
    updateValues() {
      this.isDataComputing = true;
      clearInterval(this.computingInterval);
      const { rowFields, colFields, targetFields } = this.changeFields;
      this.computingInterval = setTimeout(() => {
        const rows = [];
        const cols = [];
        const aggregator = aggregators[this.aggregatorName];
        const allTotal = aggregator(this, [], []);
        const rowTotals = {};
        const colTotals = {};
        const treeData = {};
        const reverseTreeData = {};
        const fields = [...rowFields, ...colFields];
        this.data.forEach((item) => {
          const rowKey = [];
          const colKey = [];
          let filtered = false;
          // 检查项是否通过字段值筛选器
          for (const field of fields) {
            if (field.valuesFiltered && !field.valuesFiltered.has(field.getter(item))) {
              filtered = true;
              break;
            }
          }
          if (filtered) {
            return true;
          }
          // 必要时生成项rowKey/colKey
          rowFields.forEach((field) => {
            rowKey.push(field.getter(item));
          });
          colFields.forEach((field) => {
            colKey.push(field.getter(item));
          });
          targetFields.forEach((field) => {
            const newColKey = [field].concat(colKey);
            allTotal.push(item[field]);
            // 更新 rows/cols
            if (!filtered) {
              if (!rows.some((row) => rowFields.every((r, i) => row[i] === rowKey[i]))) {
                rows.push(rowKey);
              }
              if (!cols.some((col) => targetFields.concat(colFields)
                .every((c, i) => col[i] === newColKey[i]))) {
                cols.push(newColKey);
              }
            }
            const totalRowKey = [];
            let totalColKey = [];
            for (const x of Array.from(rowFields)) {
              totalRowKey.push(x.key in item ? item[x.key] : 'null');
            }
            for (const x of Array.from(colFields)) {
              totalColKey.push(x.key in item ? item[x.key] : 'null');
            }
            totalColKey = [field].concat(totalColKey);
            const flatRowKey = calculateHash(totalRowKey);
            const flatColKey = calculateHash(totalColKey);
            if (rowKey.length !== 0) {
              if (!rowTotals[flatRowKey]) {
                rowTotals[flatRowKey] = aggregator(this, rowKey, []);
              }
              rowTotals[flatRowKey].push(item[field]);
            }
            if (colKey.length || totalColKey.length) {
              if (!colTotals[flatColKey]) {
                colTotals[flatColKey] = aggregator(this, [], newColKey);
              }
              colTotals[flatColKey].push(item[field]);
            }
            // 更新 treeData
            if ((colKey.length || totalColKey.length) && rowKey.length !== 0) {
              if (!treeData[flatRowKey]) {
                treeData[flatRowKey] = {};
              }
              if (!reverseTreeData[flatColKey]) {
                reverseTreeData[flatColKey] = {};
              }
              if (!treeData[flatRowKey][flatColKey]) {
                treeData[flatRowKey][flatColKey] = aggregator(this, [], []);
              }
              if (!reverseTreeData[flatColKey][flatRowKey]) {
                reverseTreeData[flatColKey][flatRowKey] = aggregator(this, [], []);
              }
              treeData[flatRowKey][flatColKey].push(item[field]);
              reverseTreeData[flatColKey][flatRowKey].push(item[field]);
            }
          });
          return true;
        });
        this.rows = rows;
        this.cols = cols;
        this.colTotals = colTotals;
        this.rowTotals = rowTotals;
        this.allTotal = allTotal;
        this.treeData = treeData;
        this.reverseTreeData = reverseTreeData;
        this.isDataComputing = false;
        this.updateInternalFields();
      }, 0);
    },
    updateInternalFields() {
      const {
        rowFields, colFields, targetFields,
      } = this.changeFields;
      const { paddingWidth } = this;
      const newTarget = [];
      const widthList = {};
      let totalWidth = 0;
      let maxWidth = 0;
      targetFields.forEach((d) => {
        const w = getTextWidth(d, this.fontSize)[0] + paddingWidth;
        widthList[d] = w;
        totalWidth += w;
        if (w > maxWidth) maxWidth = w;
      });
      if (targetFields && targetFields.length) {
        newTarget.push({
          ...target,
          values: targetFields,
          valuesFiltered: new Set(targetFields),
          valueFilter: true,
          valuesSet: new Set(targetFields),
          widthList,
          maxWidth,
          totalWidth,
          labelWidth: getTextWidth(target.label, this.fontSize)[0] + paddingWidth,
        });
      }
      this.internalRowFields = cloneDeep(rowFields);
      this.internalColFields = newTarget.concat(cloneDeep(colFields));
    },
    scrollTop(top, left) {
      this.$refs.child.scrollTop(top, left);
    },
  },
};
</script>

<style scoped>

</style>
