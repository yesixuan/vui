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
    // 存储副本
    this._formData = Object.freeze(JSON.parse(JSON.stringify(this.formData)))
    this.init()
    this._validateMsg = Object.freeze(JSON.parse(JSON.stringify(this.validateMsg)))
  },
  watch: {
    ruleConfig: {
      handler(val) {
        this.init()
      },
      deep: true,
    },
    schema: {
      handler(val) {
        this.init()
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.validator = createValidator(this.ruleConfig)
      const { getResult } = this.validator
      this.validateMsg = getResult()
      this.getValidator(this.validator, this.validateMsg, () => {
        if (typeof this.validateMsg !== 'object') {
          return console.warn(`this.validateMsg: ${this.validateMsg} 不是对象`)
        }
        Object.assign(this.validateMsg, this.validator.verifyAll(this.formData) || {})
      })
    },
    verifyAll() {
      if (typeof this.validateMsg !== 'object') {
        return console.warn(`this.validateMsg: ${this.validateMsg} 不是对象`)
      }
      return Object.assign(this.validateMsg, this.validator.verifyAll(this.formData) || {})
    },
    verify() {
      return this.validator.verify(this.formData)
    },
    resetFields(formData) {
      const target = formData || this.formData
      if (typeof target !== 'object') {
        return console.warn(`this.formData: ${this.formData} 不是对象`)
      }
      Object.assign(this.formData, this._formData || {})
    },
    clearValidate() {
      if (typeof this.validateMsg !== 'object') {
        return console.warn(`this.validateMsg: ${this.validateMsg} 不是对象`)
      }
      Object.assign(this.validateMsg, this._validateMsg || {})
    },
    reset(formData) {
      this.resetFields(formData)
      this.clearValidate()
    },
  },
  render(h) {
    const renderItems = () => {
      return this.schema.map((formItem) => {
        const { type, prop: key } = formItem
        // 构造校验函数
        const validator = () => {
          if (typeof this.validateMsg[key] !== 'object') {
            return console.warn(`this.validateMsg[key]: ${this.validateMsg[key]} 不是对象`)
          }
          Object.assign(this.validateMsg[key], this.validator.verifySingle(key, this.formData[key], this.formData) || {})
        }
        const handleSubmit = () => {
          if (typeof this.validateMsg !== 'object') {
            return console.warn(`this.validateMsg: ${this.validateMsg} 不是对象`)
          }
          Object.assign(this.validateMsg, this.validator.verifyAll(this.formData) || {})
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