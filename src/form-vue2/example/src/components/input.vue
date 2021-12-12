<template>
  <div>
    <input
      type="text"
      v-model="fromData[prop]"
      :placeholder="label"
      @input="validator"
    />
    <p>{{result.valid || result.msg}}</p >
  </div>
</template>

<script>
export default {
  name: 'ViInput',
  props: {
    fromData: Object,
    prop: String,
    label: String,
    validator: Function,
    result: Object,
  },
}
</script>
