<template>
  <ViForm
    :schema="[
      { type: 'viInput', prop: 'name', label: '名字', trigger: 'blur' },
      { type: 'viInput', prop: 'pwd', label: '密码', trigger: 'input' },
      { type: 'custom', prop: 'custom', label: '自定义组件', trigger: 'input' },
      { type: 'submit', prop: '', label: '提交' },
    ]"
    :form-data="formData"
    :rule-config="{
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
    :get-validator="(validator) => {}"
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
  name: 'App',
  components: {
    ViForm,
  },
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
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>