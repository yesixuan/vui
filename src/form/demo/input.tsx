import { defineComponent } from 'vue'
import './index.scss'

const ViInput = defineComponent({
  name: 'ViInput',
  props: {
    fromData: Object,
    prop: String,
    label: String,
    validator: Function,
    result: Object,
  },
  setup() {
    return (prop) => {
      return <div>
        <input
          type="text"
          v-model={ prop.fromData[prop.prop] }
          placeholder={prop.label}
          onInput={prop.validator}
        />
        <p>{prop.result.valid || prop.result.msg}</p >
      </div>
    }
  }
})

export const viInput = ({
  formData, formItem: {prop, label}, validator, result
}) => {
  // @ts-ignore
  return <ViInput
    fromData={formData}
    prop={prop}
    label={label}
    validator={validator}
    result={result}
  />
}


// export const viInput = (fromData, {prop: key, label, trigger = 'blur'}, validator, result) => {
//   console.log('viInput', result)
//   const createTrigger = () => {
//     const eventMap = {
//       input: 'onInput',
//       blur: 'onBlur',
//       change: 'onChange',
//     }
//     return {
//       [eventMap[trigger]]: validator
//     }
//   }
//   return <div style={{ marginBottom: '10px' }}>
//     <input
//       class={result.valid ? '' : 'error-input'}
//       type="text"
//       v-model={ fromData[key] }
//       placeholder={label}
//       // onBlur={validator}
//       {...createTrigger()}
//     />
//     <p>{result.valid || result.msg}</p >
//   </div>
// }

export const submit = ({ submit }) => {
  return <h2 onClick={submit}>submit</h2>
}