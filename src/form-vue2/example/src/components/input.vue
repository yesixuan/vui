<template>
  <div>
    <input
      type="text"
      v-model="fromData[prop]"
      :placeholder="label"
      @Input="validator"
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
