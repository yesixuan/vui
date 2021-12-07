<template>
  <ViForm
    :schema="[
      { type: 'viInput', prop: 'name', label: '名字', trigger: 'blur' },
      { type: 'viInput', prop: 'pwd', label: '密码', trigger: 'input' },
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
    <template #input="{ formData, formItem: {prop, label}, validator, result }">
      <input type="text" v-model="formData[prop]" @input="validator" :placeholder="label">
      <h1 v-if="!result.valid">{{ result.msg }}</h1>
    </template>
    <template #custom="{ formData, formItem: {prop, label}, validator, result }">
      <input type="text" v-model="formData[prop]" @input="validator" :placeholder="label">
      <h1 v-if="!result.valid">{{ result.msg }}</h1>
    </template>
  </ViForm>
  <!-- <div>
    {{  formData }}
  </div> -->
  <!-- {{ formData }} -->
</template>

<script>
import ViForm from '../form/index.jsx'
import { viInput, submit } from './input.jsx'

export default {
  data() {
    return {
      formData: {
        haha: 33,
        name: '',
        pwd: '',
      },
      components: {
        viInput, submit
      }
    }
  },
  beforeCreate() {
    console.log('beforeCreate')
  },
  watch: {
    formData: {
      handler(val) {
        console.log('formData', JSON.stringify(val, null, '    '))
      },
      deep: true
    }
  },
  created() {
    // console.log(this.formData)
  },
  components: {
    ViForm,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
