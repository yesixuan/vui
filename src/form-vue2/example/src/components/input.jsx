export const viInput = ({
  formData, formItem: {prop, label}, validator, result
}) => {
  return {
    // eslint-disable-next-line
    render(h) {
      return <ViInput
        fromData={formData}
        prop={prop}
        label={label}
        validator={() => validator(prop)}
        result={result}
      />
    }
  }
}

export const submit = ({ submit }) => {
  return {
    // eslint-disable-next-line
    render(h) {
      return <h2 onClick={submit}>submit</h2>
    }
  }
}