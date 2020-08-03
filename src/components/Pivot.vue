<template>
  <div class="flex-column h-100">
    <div v-if="showChart" class="w-100 h200">
    </div>
    <div class="flex-row flex1 h-100">
      <div class="w150 mr10 h-100 flex-column">
        <div class="w-100 flex1 border1 mb10 drag-area" :class="dragAreaClass">
          <div class="mb3">targetSourceFieldKeys</div>
          <draggable
            v-model="internal.targetSourceFieldKeys"
            class="targetSourceFieldKeys"
            :group="{
              name: 'targetSourceFieldKeys',
              put: ['targetFieldKeys', 'targetSourceFieldKeys']
            }"
            :sort="true"
            handle=".btn-draggable"
            @start="start"
            @remove="(...arg) => remove('targetSourceFieldKeys',...arg)"
            @end="end">
            <div v-for="key in internal.targetSourceFieldKeys" :key="key" class="field">
              <field-label
                :field="fieldsWithValues[key]"
                v-model="fieldValues[key]"
              />
            </div>
          </draggable>
        </div>
        <div class="w-100 flex1 border1 drag-area" :class="dragAreaClass">
          <div class="mb3">availableFieldKeys</div>
          <draggable
            v-model="internal.availableFieldKeys"
            class="availableFieldKeys"
            handle=".btn-draggable"
            :group="{
              name: 'availableFieldKeys',
              put: ['colFieldKeys', 'rowFieldKeys', 'availableFieldKeys']
            }"
            :sort="true"
            @start="start"
            @remove="(...arg) => remove('availableFieldKeys',...arg)"
            @end="end">
            <div v-for="key in internal.availableFieldKeys" :key="key" class="field">
              <field-label
                :field="fieldsWithValues[key]"
                v-model="fieldValues[key]"
              />
            </div>
          </draggable>
        </div>
      </div>
      <div class="flex1 over-hidden">
        <div class="w-100 h60 border1 mb10 drag-area" :class="dragAreaClass">
          <div class="mb3">targetFieldKeys</div>
          <draggable
            v-model="internal.targetFieldKeys"
            class="targetFieldKeys"
            :group="{
              name: 'targetFieldKeys',
              put: ['targetSourceFieldKeys', 'targetFieldKeys']
            }"
            :sort="true"
            handle=".btn-draggable"
            @start="start"
            @update="(...arg) => update('targetFieldKeys',...arg)"
            @remove="(...arg) => remove('targetFieldKeys',...arg)"
            @end="end">
            <div v-for="key in internal.targetFieldKeys" :key="key" class="field">
              <field-label
                :field="fieldsWithValues[key]"
                v-model="fieldValues[key]"
              />
            </div>
          </draggable>
        </div>
        <div class="w-100 h60 border1 mb10 drag-area" :class="dragAreaClass">
          <div class="mb3">rowFieldKeys</div>
          <draggable
            v-model="internal.rowFieldKeys"
            class="rowFieldKeys"
            :group="{
              name: 'rowFieldKeys',
              put: ['availableFieldKeys', 'colFieldKeys', 'rowFieldKeys']
            }"
            :sort="true"
            handle=".btn-draggable"
            @start="start"
            @update="(...arg) => update('rowFieldKeys',...arg)"
            @remove="(...arg) => remove('rowFieldKeys',...arg)"
            @end="end">
            <div v-for="key in internal.rowFieldKeys" :key="key" class="field">
              <field-label
                :field="fieldsWithValues[key]"
                v-model="fieldValues[key]"
              />
            </div>
          </draggable>
        </div>
        <div class="w-100 h60 border1 mb10 drag-area" :class="dragAreaClass">
          <div class="mb3">colFieldKeys</div>
          <draggable
            v-model="internal.colFieldKeys"
            class="colFieldKeys"
            :group="{
              name: 'colFieldKeys',
              put: ['availableFieldKeys', 'rowFieldKeys', 'colFieldKeys']
            }"
            :sort="true"
            handle=".btn-draggable"
            @start="start"
            @update="(...arg) => update('colFieldKeys',...arg)"
            @remove="(...arg) => remove('colFieldKeys',...arg)"
            @end="end">
            <div v-for="key in internal.colFieldKeys" :key="key" class="field">
              <field-label
                :field="fieldsWithValues[key]"
                v-model="fieldValues[key]"
              />
            </div>
          </draggable>
        </div>
        <pivot-table
          :data="data"
          :padding="newPadding"
          :ops="ops"
          :fieldsWithValues="fieldsWithValues"
          :padding-width="paddingWidth"
          :font-size="fontSize"
          v-model="fieldValues"
          :is-data-loading="isDataLoading"
          :changeFields="changeFields"/>
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import PivotTable from './pivot-table/PivotTable.vue';
import FieldLabel from './drag-gable/FieldLabel.vue';
import naturalSort from '../utils/javascript-natural-sort';
import { getTextWidth } from '../utils/getTextWidth';

const keyTokey = {
  rowFieldKeys: 'rowFields',
  colFieldKeys: 'colFields',
  targetFieldKeys: 'targetFields',
};

export default {
  name: 'Pivot',
  components: {
    PivotTable,
    Draggable,
    FieldLabel,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    rowFieldKeys: {
      type: Array,
      default: () => [],
    },
    colFieldKeys: {
      type: Array,
      default: () => [],
    },
    availableFieldKeys: {
      type: Array,
      default: () => [],
    },
    targetSourceFieldKeys: {
      type: Array,
      default: () => [],
    },
    targetFieldKeys: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    padding: {
      type: Array,
      default: () => [5, 10],
    },
    fontSize: {
      type: Number,
      default: 14,
    },
    showChart: {
      type: Boolean,
      default: false,
    },
    isDataLoading: {
      type: Boolean,
      default: false,
    },
    ops: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const fieldValues = {};
    this.fields.filter((field) => field.valueFilter).forEach((field) => {
      fieldValues[field.key] = {};
    });
    return {
      internal: {
        targetFieldKeys: this.targetFieldKeys,
        targetSourceFieldKeys: this.targetSourceFieldKeys,
        availableFieldKeys: this.availableFieldKeys,
        rowFieldKeys: this.rowFieldKeys,
        colFieldKeys: this.colFieldKeys,
      },
      fieldValues,
      dragging: false,
      changeFields: {
        rowFields: [],
        colFields: [],
        targetFields: [],
      },
      showIconWidth: 16,
      paddingWidth: 0,
      newPadding: [],
    };
  },
  computed: {
    // 从数据中提取值的字段（如果字段具有valueFilter）
    fieldsWithValues() {
      // 创建对象: field.key => field
      const fwv = {};
      const { paddingWidth } = this;
      this.fields.forEach((field) => {
        fwv[field.key] = field;
      });
      // Add valuesSet
      const valueFilterableFields = this.fields.filter((field) => field.valueFilter);
      // 为每个值可筛选字段创建 valuesSet集合
      valueFilterableFields.forEach((field) => {
        fwv[field.key].valuesSet = new Set();
      });
      // 对数据进行一次迭代
      this.data.forEach((item) => {
        valueFilterableFields.forEach((field) => {
          fwv[field.key].valuesSet.add(field.getter(item));
        });
      });
      // 创建从valuesSet排序的值
      valueFilterableFields.forEach((fe) => {
        const c = Array.from(fwv[fe.key].valuesSet).sort(fe.sort || naturalSort);
        let totalWidth = 0; const widthList = {};
        fwv[fe.key].values = c;
        if (fe.type !== 'Number') {
          let max = 0;
          c.forEach((d) => {
            widthList[d] = getTextWidth(d, this.fontSize)[0] + paddingWidth;
            totalWidth += widthList[d];
            if (widthList[d] > max) max = widthList[d];
          });
          fwv[fe.key].maxWidth = max;
          fwv[fe.key].labelWidth = getTextWidth(fwv[fe.key].label, this.fontSize)[0]
            + paddingWidth + this.showIconWidth;
          fwv[fe.key].widthList = widthList;
          fwv[fe.key].totalWidth = totalWidth;
        }
      });
      return fwv;
    },
    dragAreaClass() {
      return this.dragging ? 'drag-area-highlight' : null;
    },
    valuesFiltered() {
      const valuesFiltered = {};
      for (const [key, valuesObject] of Object.entries(this.fieldValues)) {
        valuesFiltered[key] = new Set();
        valuesObject.forEach((valueObject) => {
          if (valueObject.checked) {
            valuesFiltered[key].add(valueObject.value);
          }
        });
      }

      return valuesFiltered;
    },
  },
  watch: {
    data() {
      this.updateFieldValues();
    },
  },
  created() {
    this.updateFieldValues();
    const [top, left] = this.padding;
    this.newPadding = [top, left, top, left + this.showIconWidth];
    this.paddingWidth = this.padding[1] * 2 + this.showIconWidth + 10;
  },
  methods: {
    start() {
      this.dragging = true;
    },
    end() {
      this.dragging = false;
    },
    updateFields(changeKey, exChange) {
      const fields = [];
      const arr = this.internal[changeKey];
      const len = arr.length;
      for (let i = 0; i < len; i += 1) {
        const key = arr[i];
        const field = this.fields.find((d) => d.key === key);
        if (!field.valueFilter) {
          return arr;
        }
        field.valuesFiltered = this.valuesFiltered[field.key];
        fields.push(field);
      }
      if (!exChange) fields.showChild = false;
      return fields;
    },
    remove(attr, arg) {
      const to = arg.to.className;
      // change
      if (attr !== 'availableFieldKeys' && attr !== 'targetSourceFieldKeys') {
        this.changeFields = {
          ...this.changeFields,
          [keyTokey[attr]]: this.updateFields(attr, false),
          [keyTokey[to]]: this.updateFields(to, false),
        };
      } else {
        this.changeFields = {
          ...this.changeFields,
          [keyTokey[to]]: this.updateFields(to, false),
        };
      }
    },
    update(attr) {
      this.changeFields = {
        ...this.changeFields,
        [keyTokey[attr]]: this.updateFields(attr, true),
      };
    },
    updateFieldValues() {
      for (const [key, field] of Object.entries(this.fieldsWithValues)) {
        if (field.valueFilter) {
          this.fieldValues[key] = [];
          field.values.forEach((value) => {
            this.fieldValues[key].push({ value, checked: true });
          });
        }
      }
      this.internal = {
        availableFieldKeys: this.availableFieldKeys,
        targetSourceFieldKeys: this.targetSourceFieldKeys,
        targetFieldKeys: this.targetFieldKeys,
        rowFieldKeys: this.rowFieldKeys,
        colFieldKeys: this.colFieldKeys,
      };
    },
  },
};
</script>

<style scoped>

</style>
