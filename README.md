# pivot-fixed-table 

## install
```$xslt
npm i pivot-fixed-table 
or
yarn add pivot-fixed-table 
```
## github
```$xslt
https://github.com/PathFun/pivot-fixed-table.git
```

## import
```$xslt
  import PivotFixedTable from 'pivot-fixed-table/lib/pivot-fixed-table.umd.js';
  import 'pivot-fixed-table/lib/pivot-fixed-table.css';
```

### Usage
```$xslt
 <PivotFixedTable
            :data="asyncData"
            :show-chart="false"
            :fields="fields"//
            :font-size="12"
            :auto-width=false|true //自动计算宽度, 若为false,则获取fields中的width,默认100
            :padding="[8, 14]"// 内边距
            :available-field-keys="availableFieldKeys"
            :target-source-field-keys="targetSourceFieldKeys"
            :target-field-keys="targetFieldKeys"
            :row-field-keys="rowFieldKeys"
            :col-field-keys="colFieldKeys"
            :is-data-loading="isDataLoading"/>


```

### fields
```javascript
      const fields = [
        {
          key: 'country',
          getter: (d) => d.country,
          label: '国家',
          type: 'String',
          width: 120,
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
          width: 100,
          valueFilter: true,
          aggregatorName: 'Sum',
        },
        {
          key: 'city',
          getter: (d) => d.city,
          label: '城市',
          showChild: false,
          type: 'String',
          width: 120,
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
```

### data
```$xslt
  [
     {
        country: 'China',
        gender: 'male',
        year: 2019,
        city: '上海',
        gender: '男',
        smoke_age: 22,
        smoke_num: 185421,
        price: 22,
        age: 40
     },
    ... 
] 
```

