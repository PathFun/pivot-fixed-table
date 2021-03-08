<template>
  <div id="app">
    <Pivot
      :data="asyncData"
      :show-chart="false"
      :fields="fields"
      :font-size="12"
      :auto-width="false"
      :padding="[8, 14]"
      :available-field-keys="availableFieldKeys"
      :target-source-field-keys="targetSourceFieldKeys"
      :target-field-keys="targetFieldKeys"
      :row-field-keys="rowFieldKeys"
      :col-field-keys="colFieldKeys"
      :is-data-loading="isDataLoading">
    </Pivot>
  </div>
</template>

<script>
import Pivot from './components/Pivot.vue';

const country = ['United States', 'China', 'India', 'France', 'Australia'];
const year = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
const gender = ['male', 'female'];
const city = ['beijing', 'guangzhou', 'shanghai', 'london', 'tokyo'];

export default {
  name: 'App',
  components: {
    Pivot,
  },
  data() {
    return {
      rowFieldKeys: [],
      colFieldKeys: [],
      targetFieldKeys: [],
      asyncData: [],
      isDataLoading: false,
      fields: [],
      availableFieldKeys: [],
      targetSourceFieldKeys: [],
    };
  },
  created() {
    this.isDataLoading = true;
    setTimeout(() => {
      const dataList = [];
      for (let i = 0; i < 10000; i += 1) {
        dataList.push({
          country: country[Math.floor(Math.random() * 5)],
          year: year[Math.floor(Math.random() * 8)],
          city: city[Math.floor(Math.random() * 5)],
          gender: gender[Math.floor(Math.random() * 2)],
          smoke_age: Math.floor(Math.random() * 15),
          smoke_num: Math.floor(Math.random() * 100),
          price: Math.floor(Math.random() * 10000) / 100,
          age: Math.floor(Math.random() * 40) + 20,
        });
      }
      this.fields = [
        {
          key: 'country',
          getter: (d) => d.country,
          label: '国家',
          type: 'String',
          showChild: false,
          valueFilter: true,
          aggregatorName: 'Sum',
        },
        {
          key: 'gender',
          getter: (d) => d.gender,
          label: '性别',
          showChild: false,
          type: 'String',
          valueFilter: true,
          aggregatorName: 'Sum',
        },
        {
          key: 'city',
          getter: (d) => d.city,
          label: '城市',
          showChild: false,
          type: 'String',
          valueFilter: true,
          aggregatorName: 'Sum',
        },
        {
          key: 'year',
          getter: (d) => d.year,
          label: '年份',
          showChild: false,
          type: 'String',
          valueFilter: true,
          aggregatorName: 'Sum',
        },
        {
          key: 'smoke_num',
          getter: (d) => d.smoke_num,
          label: '吸烟人数',
          type: 'Number',
          showChild: false,
          valueFilter: false,
          aggregatorName: 'Sum',
        },
        {
          key: 'price',
          getter: (d) => d.price,
          label: '平均价格',
          type: 'Number',
          showChild: false,
          valueFilter: false,
          aggregatorName: 'Sum',
        },
        {
          key: 'age',
          getter: (d) => d.age,
          label: '年龄',
          type: 'Number',
          showChild: false,
          valueFilter: false,
          aggregatorName: 'Sum',
        },
        {
          key: 'smoke_age',
          getter: (d) => d.smoke_age,
          label: '烟龄',
          type: 'Number',
          showChild: false,
          valueFilter: false,
          aggregatorName: 'Sum',
        },
      ];
      this.availableFieldKeys = ['country', 'gender', 'year', 'city'];
      this.targetSourceFieldKeys = ['smoke_num', 'price', 'age', 'smoke_age'];
      this.asyncData = dataList;
      this.isDataLoading = false;
    }, 0);
  },
};
</script>

<style lang="scss">
  #app {
    width: 1200px;
    height: 800px;
    margin: 50px auto;
    font-size: 12px;
  }
</style>
