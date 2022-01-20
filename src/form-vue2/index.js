import { createValidator } from '@ignorance/validator'

const deepClone = (target) => {
  if (Object.prototype.toString.call(target) === '[object Object]') {
    return Object.entries(target).reduce((memo, [key, value]) => {
      memo[key] = deepClone(value)
      return memo
    }, Object.create(null))
  }
  if (Array.isArray(target)) return target.map(deepClone)
  return target
}


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
    // 格式化 formData
    this.schema.forEach(({ prop }) => {
      if (typeof prop === 'string' && prop) {
        this.formData[prop] = null
      }
    })
    // 存储副本
    this._formData = Object.freeze(JSON.parse(JSON.stringify(this.formData)))
    this.init()
    this._validateMsg = Object.freeze(JSON.parse(JSON.stringify(this.validateMsg)))
  },
  watch: {
    ruleConfig: {
      handler() {
        this.init()
      },
      deep: true,
    },
    schema: {
      handler() {
        this.init()
      },
      deep: true,
    },
  },
  methods: {
    init() {
      // schema 中删除了字段、ruleConfig 中删除了字段，同步校验信息
      for (const key in this.validateMsg) {
        const item = this.schema.find(({ prop }) => prop === key)
        if (!item || !this.ruleConfig[key]) delete this.validateMsg[key]
      }
      
      const pass = [
        {validator: () => true, msg: ''},
      ]
      const ruleConfig = deepClone(this.ruleConfig)
      // 扫描 schema 将 ruleConfig 补全（schema 有，而 config 没有的话，让它全部通过）
      this.schema.forEach(({prop}) => {
        if (typeof prop !== 'string' || !prop || ruleConfig[prop]) return
        ruleConfig[prop] = pass
      })

      this.validator = createValidator(ruleConfig)
      // 处理校验信息
      Object.keys(ruleConfig).forEach(key => {
        // 以前没有的字段，现在将它变为通过
        if (!this.validateMsg[key]) {
          return this.$set(this.validateMsg, key, { name: key, valid: true })
        }
        // 旧的校验不通过，新的校验通过了，要更新校验信息
        const newRes = this.validator.verifySingle(key, this.formData[key], this.formData) // 获取新规则的校验结果
        if ((this.validateMsg[key].valid === false && newRes.valid === true) || (this.validateMsg[key].dirty === true && this.validateMsg[key].valid === true && newRes.valid === false)) {
          return this.$set(this.validateMsg, key, { ...this.validateMsg[key], ...newRes })
        }
      })
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
      const res = this.validator.verifyAll(this.formData)
      // 给 res 加上 dirty
      for (const key in res) res[key].dirty = true
      return Object.assign(this.validateMsg, res || {})
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
          // 加一个弄脏的属性
          Object.assign(this.validateMsg[key], this.validator.verifySingle(key, this.formData[key], this.formData) || {}, { dirty: true })
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