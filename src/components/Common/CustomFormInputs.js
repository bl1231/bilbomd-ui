import { useField } from 'formik'

const CustomFormInputs = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props)
  //console.log('meta', meta);
  //console.log('field', field);
  return (
    <>
      <label htmlFor={props.id || props.name} className="visually-hidden">
        {label}
      </label>
      <input
        {...field}
        {...props}
        className={meta.touched && meta.error ? 'input-error' : ''}
      />
      {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
    </>
  )
}
export default CustomFormInputs
