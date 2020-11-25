# pivot-fixed-table 

## install
```$xslt
npm i pivot-fixed-table 
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

### run
```$xslt
 <PivotFixedTable
            :data="asyncData"
            :show-chart="false"
            :fields="fields"
            :font-size="12"
            :padding="[8, 14]"
            :available-field-keys="availableFieldKeys"
            :target-source-field-keys="targetSourceFieldKeys"
            :target-field-keys="targetFieldKeys"
            :row-field-keys="rowFieldKeys"
            :col-field-keys="colFieldKeys"
            :is-data-loading="isDataLoading"/>

```

### data
```
  [
    {
        country: 'China',
        gender: 'male',
        ...
    },
    ...
] 
```
