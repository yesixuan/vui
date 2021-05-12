import { defineComponent, PropType, Ref, ref, watch } from 'vue'
import { AllRes, createValidator, Validator, RuleConfig } from '@ignorance/validator'


export default defineComponent({
  name: 'ViForm',
  props: {
    schema: {
      type: Array as PropType<any[]>,
      required: true,
    },
    ruleConfig: {
      type: Object as PropType<RuleConfig>,
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
      type: Function as PropType<(validator: Validator, msg: Ref<AllRes>) => void>,
      default: () => {}
    }
  },
  setup(prop, { slots }) {
    let validator = createValidator(prop.ruleConfig)
    let { verifySingle, getResult, verifyAll } = validator
    // console.log('重新初始化')
    const validateMsg = ref(getResult())
    prop.getValidator(validator, validateMsg)
    watch(
      () => [prop.ruleConfig, prop.schema],
      () => {
        validator = createValidator(prop.ruleConfig)
        verifySingle = validator.verifySingle
        getResult = validator.getResult
        verifyAll = validator.verifyAll
        validateMsg.value = { ...getResult(), ...validateMsg.value }
        prop.getValidator(validator, validateMsg)
      }
    )

    const components = { ...prop.components }

    const renderItems = () => {
      return prop.schema.map((formItem) => {
        const { type, prop: key } = formItem
        // 构造校验函数
        const validator = () => {
          validateMsg.value[key] = verifySingle(key, prop.formData[key], prop.formData)
        }
        const handleSubmit = () => {
          validateMsg.value = verifyAll(prop.formData)
          // Object.assign(validateMsg.value, verifyAll(prop.formData))
        }
        return (slots[type] ?? components[type])({
          formData: prop.formData,
          formItem,
          validator,
          result: validateMsg.value[key],
          submit: handleSubmit,
        })
      })
    }
    return () => <form>
      {
        renderItems()
      }
    </form>
  }
})

export * from '@ignorance/validator'