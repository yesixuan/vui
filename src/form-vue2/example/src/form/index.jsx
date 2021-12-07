import { createValidator } from '@ignorance/validator'


export default {
  name: 'ViForm',
  props: {
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
  },
  render() {
    const { verifySingle, verifyAll } = this.validator
    this.getValidator(this.validator, this.validateMsg)

    const renderItems = () => {
      return this.schema.map((formItem) => {
        const { type, prop: key } = formItem
        // 构造校验函数
        const validator = () => {
          this.validateMsg[key] = verifySingle(key, this.formData[key], this.formData)
        }
        const handleSubmit = () => {
          Object.assign(this.validateMsg, verifyAll(this.formData))
        }
        const Cmp = (this.components[type])({
          formData: this.formData,
          formItem,
          validator,
          result: this.validateMsg[key],
          submit: handleSubmit,
        })
        return <Cmp />
      })
    }
    return <form>
      {
        renderItems()
      }
    </form>
  }
}