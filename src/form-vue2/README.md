# Form for vue2 表单

### 介绍

ViForm 提供灵活而强大的表单校验能力

### 引入

```js
import Vue from 'vue'
import ViForm from '@ignorance/vui/es/form-vue2/index.jsx'

Vue.use(Form);
```

## 代码演示

### 基础用法

```html
<template>
  <ViForm
    :schema="[
      { type: 'viInput', prop: 'name', label: '名字', trigger: 'blur' },
      { type: 'viInput', prop: 'pwd', label: '密码', trigger: 'input' },
      { type: 'custom', prop: 'custom', label: '自定义组件', trigger: 'input' },
      { type: 'submit', prop: '', label: '提交' },
    ]"
    :formData="formData"
    :ruleConfig="{
      name: [
        {validator: /^345$/, msg: '错误提示： 345'},
      ],
      pwd: [
        {validator: /^111$/, msg: '错误提示： 111'},
      ],
      custom: [
        {validator: /^custom$/, msg: '错误提示： custom'},
      ]
    }"
    :components="components"
    :getValidator="(validator) => {}"
  >
    <template #custom="{ formData, formItem: {prop, label}, validator, result }">
      <input type="text" v-model="formData[prop]" @input="validator" :placeholder="label">
      <h1 v-if="!result.valid">{{ result.msg }}</h1>
    </template>
  </ViForm>
  <!-- {{ formData }} -->
</template>

<script>
import ViForm from '..'
import { viInput, submit } from './input'
export default {
  data() {
    return {
      formData: {
        haha: 33
      },
      components: {
        viInput, submit
      }
    }
  },
  components: {
    ViForm,
  },
}
</script>
```

## API

### Props

| 参数          | 说明     | 类型     | 默认值    |
| ------------- | -------- | -------- | --------- |
| schema          | 表单配置 | _Array_ | - |
| formData | 表单绑定的数据 | _Object_ | -         |
| ruleConfig | 表单校验规则 | _Array_ | -         |
| components | 可以通过配置渲染的组件 | _Object_ | -         |
| getValidator | 获取校验器以获得更自由的校验 | _Function_ | `() => {}`         |

### Slots

支持各种自定义插槽
