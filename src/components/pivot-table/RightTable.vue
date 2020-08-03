<template>
    <div>
      <div class="right-top-header over-hidden"
           :class="top !== 0 ? 'bottom-box-shadow' : ''"
           ref="same-scroll-left">
        <table>
          <colgroup>
            <col v-for="(col, index) in getWidthList"
                 :key="index"
                 :width="col"/>
          </colgroup>
          <thead>
            <tr
              v-for="(cf, cfi) in internalColFields"
                :key="JSON.stringify(cf)">
              <template v-for="(col, colIndex) in sortedCols">
                <th
                  v-if="spanSize(sortedCols, colIndex, cfi) !== 0"
                  :key="JSON.stringify(col)"
                  :colspan="spanSize(sortedCols, colIndex, cfi)"
                  :style="cfi === internalColFields.length - 1 ? lastHeightStyle : thStyle"
                >
                  {{ col[cfi] }}
                </th>
              </template>
            </tr>
          </thead>
        </table>
      </div>
      <vue-scroll class="right-bottom-header flex1"
                  :ops="scrollOps"
                  @handle-scroll="scrollFun">
        <table>
          <colgroup>
            <col v-for="(col, index) in getWidthList"
                 :key="index"
                 :width="col"/>
          </colgroup>
          <tr v-for="(row, rowIndex) in sortedRows" :key="rowIndex">
            <template v-if="row.length">
              <td
                v-for="col in sortedCols"
                :key="JSON.stringify(col)"
                class="text-right"
                :style="thStyle"
              >
                {{value(row, col)}}
              </td>
            </template>
          </tr>
        </table>
      </vue-scroll>
    </div>
</template>

<script>
import vueScroll from 'vuescroll';
import { mapValues, last } from 'lodash';
import {
  spanSize,
  getValue,
  calculateHash,
} from '../../utils/utils';
import { getTextWidth } from '../../utils/getTextWidth';

export default {
  name: 'RightTable',
  props: {
    sortedRows: {
      type: Array,
      default: () => [],
    },
    sortedCols: {
      type: Array,
      default: () => [],
    },
    paddingWidth: {
      type: Number,
      default: 16,
    },
    treeData: {
      type: Object,
      default: () => ({}),
    },
    reverseTreeData: {
      type: Object,
      default: () => ({}),
    },
    internalColFields: {
      type: Array,
      default: () => [],
    },
    ops: {
      type: Object,
    },
    lastHeightStyle: {
      type: Object,
    },
    thStyle: {
      type: Object,
      default: () => ({}),
    },
    fontSize: {
      type: Number,
      default: 14,
    },
  },
  components: {
    vueScroll,
  },
  data() {
    return {
      list: [],
      top: 0,
      scrollOps: {
        rail: {
          opacity: '0',
          border: 'none',
          size: '6px',
          specifyBorderRadius: true,
        },
        bar: {
          background: '#768ba7',
          onlyShowBarOnScroll: false,
          specifyBorderRadius: true,
          keepShow: false,
          size: '6px',
          minSize: 0.2,
        },
        scrollButton: {
          enable: false,
          background: '#cecece',
        },
        scrollPanel: {
          easing: 'easeInQuad',
          speed: 800,
        },
        vuescroll: {
          wheelScrollDuration: 0,
          wheelDirectionReverse: false,
        },
      },
    };
  },
  created() {
    this.scrollOps = {
      ...this.scrollOps,
      ...this.ops,
    };
  },
  computed: {
    getWidthList() {
      const { paddingWidth } = this;
      return this.sortedCols.map((d) => {
        let maxWidth = getTextWidth(last(d), this.fontSize)[0];
        let maxValue = 0;
        let item = null;
        const obj = this.reverseTreeData[calculateHash(d)];
        mapValues(obj, (v) => {
          if (v.noformat() > maxValue) { item = v; maxValue = v.noformat(); }
        });
        const w = getTextWidth(item.value(), this.fontSize)[0];
        if (w > maxWidth) maxWidth = w;
        return `${maxWidth + paddingWidth}px`;
      });
    },
  },
  methods: {
    value(row, col) {
      return getValue(row, col, this.treeData);
    },
    spanSize,
    scrollFun(vertical, horizontal) {
      const top = vertical.scrollTop;
      const left = horizontal.scrollLeft;
      this.$refs['same-scroll-left'].scrollLeft = left;
      this.$emit('scrollTop', top, left);
      this.top = top;
    },
  },
};
</script>

<style scoped>

</style>
