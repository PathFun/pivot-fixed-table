<template>
  <div :style="getMaxTopLeft.totalWidth"
       class="h-100 over-hidden"
       :class="left !== 0 ? 'right-box-shadow' : ''">
    <div class="w-100" :class="top !== 0 ? 'bottom-box-shadow' : ''">
      <table>
        <colgroup>
          <col v-for="(width, index) in getMaxTopLeft.withList" :key="index" :width="`${width}px`"/>
        </colgroup>
        <thead>
          <tr v-for="(colFields, colFieldsIndex) in internalColFields"
              :key="JSON.stringify(colFields)">
            <th v-if="colFieldsIndex ===0"
                :style="thStyle"
                :colspan="internalRowFields.length"
                :rowspan="internalColFields.length"></th>
            <th :style="thStyle">{{colFields.label}}</th>
          </tr>
          <tr>
            <th v-for="(rowFields, rowFieldsIndex) in internalRowFields"
                :style="thStyle"
                :key="rowFieldsIndex">
              {{rowFields.label}}
            </th>
            <th/>
          </tr>
        </thead>
      </table>
    </div>
    <div class="w-100 over-hidden index-cover">
      <table class="left-bottom-header" :style="topLeftHeight" ref="scorllTable">
        <colgroup>
          <col
            v-for="(width, index) in getMaxBottomLeft"
            :key="index" :width="`${width}px`"/>
        </colgroup>
        <thead>
        <tr v-for="(row, rowIndex) in sortedRows" :key="JSON.stringify(row)">
          <template
            v-for="(rowField, rowFieldIndex) in internalRowFields"
          >
            <th :key="JSON.stringify(rowField)"
                :style="thStyle"
                v-if="spanSize(sortedRows, rowIndex, rowFieldIndex) !== 0
                && isShowTh(rowIndex, rowFieldIndex)"
                :rowspan="spanSize(sortedRows, rowIndex, rowFieldIndex)">
              <span class="show-icon" v-if="rowFieldIndex !== internalRowFields.length - 1"
                    @click="toggleShow(row.slice(0, rowFieldIndex + 1))">
                {{isShow(row.slice(0, rowFieldIndex + 1)) ? '✚' : '━'}}
              </span>
              {{row[rowFieldIndex]}}
            </th>
          </template>
        </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>
import {
  spanSize,
  calculateHash,
} from '../../utils/utils';

export default {
  name: 'PinLeftTable',
  props: {
    internalRowFields: {
      type: Array,
      default: () => [],
    },
    internalColFields: {
      type: Array,
      default: () => [],
    },
    sortedRows: {
      type: Array,
      default: () => [],
    },
    sortedCols: {
      type: Array,
      default: () => [],
    },
    thStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      top: 0,
      left: 0,
      showMap: {},
    };
  },
  watch: {
    internalRowFields(newVlue) {
      const showMap = {};
      const len = newVlue.length - 1;
      this.sortedRows.forEach((d) => {
        let a = 0;
        while (a < len) {
          a++;
          showMap[calculateHash(d.slice(0, a))] = true;
        }
      });
      this.showMap = { ...showMap };
    },
  },
  computed: {
    getMaxTopLeft() {
      const withList = [];
      const total = this.internalRowFields.reduce((t, w) => {
        const width = w.maxWidth > w.labelWidth ? w.maxWidth : w.labelWidth;
        withList.push(width);
        return t + width;
      }, 0);
      let max = 0;
      this.internalColFields.forEach((d) => {
        if (d.labelWidth > max) max = d.labelWidth;
      });
      withList.push(max);
      return {
        withList,
        totalWidth: { minWidth: `${total + max}px`, maxWidth: `${total + max}px` },
      };
    },
    getMaxBottomLeft() {
      const list = this.getMaxTopLeft.withList;
      return [...list.slice(0, -2), (list[list.length - 1] + list[list.length - 2])];
    },
    topLeftHeight() {
      return { position: 'relative', top: `${this.top}px` };
    },
  },
  mounted() {
    window.addEventListener('mousewheel', this.mouseScroll, false);
  },
  methods: {
    calculateHash,
    spanSize,
    scrollTop(top, left) {
      this.top = -top;
      this.left = left;
    },
    toggleShow(key) {
      const newKey = calculateHash(key);
      if (this.showMap[newKey]) {
        this.$delete(this.showMap, newKey);
        return;
      }
      this.$set(this.showMap, newKey, true);
    },
    isShow(key) {
      const newKey = calculateHash(key);
      return this.showMap[newKey];
    },
    restSpan() {
      console.log(2);
    },
    isShowTh(valueIndex, fieldIndex) {
      const item = this.sortedRows[valueIndex].slice(0, fieldIndex);
      const len = item.length + 1;
      for (let i = 0; i < len; i += 1) {
        const HashKey = calculateHash(item.slice(0, i));
        if (this.showMap[HashKey]) {
          console.log(item);
        }
      }
      return true;
    },
    mouseScroll(event) {
      // const path = event.path || (event.composedPath && event.composedPath());
      // const el = this.$refs.scorllTable;
      // if (path.indexOf(el) !== -1) {
      //   const direction = event.deltaY > 0 ? 'down' : 'up';
      //   console.log(el, el.getBoundingClientRect(), el.clientHeight);
      // }
    },
  },
  beforeDestroy() {
    window.removeEventListener('mousewheel', this.mouseScroll, true);
  },
};
</script>

<style scoped>

</style>
