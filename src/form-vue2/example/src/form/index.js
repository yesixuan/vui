import { createValidator } from '@ignorance/validator'


export default {
  name: 'ViForm',
  props: {
    tag: {
      type: String,
      default: 'form'
    },
    schema: {
      type: Array,
      required: true,
    },
    ruleConfig: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    components: {
      type: Object,
      default: () => {},
    },
    getValidator: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      validateMsg: {}
    }
  },
  created() {
    this.validator = createValidator(this.ruleConfig)
    const { getResult } = this.validator
    this.validateMsg = getResult()
    this.getValidator(this.validator, this.validateMsg)
  },
  render(h) {
    const renderItems = () => {
      return this.schema.map((formItem) => {
        const { type, prop: key } = formItem
        // 构造校验函数
        const validator = () => {
          Object.assign(this.validateMsg[key], this.validator.verifySingle(key, this.formData[key], this.formData))
        }
        const handleSubmit = () => {
          Object.assign(this.validateMsg, this.validator.verifyAll(this.formData))
        }
        const Cmp = (this.components[type])({
          formData: this.formData,
          formItem,
          validator: validator,
          result: this.validateMsg[key],
          submit: handleSubmit,
        })
        return h(Cmp, { key: key })
      })
    }
    return h(this.tag, renderItems())
  }
}