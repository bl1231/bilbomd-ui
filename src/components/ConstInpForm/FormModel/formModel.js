const formModel = {
  formId: 'formId',
  formField: {
    crdFile: {
      name: 'crdFile',
      label: 'Please upload a CRD File obtained from CHARMM-GUI:',
      reviewLabel: 'Your CRD file is still here: ',
      requiredErrorMsg: 'CRD file is required',
      type: 'file'
    },
    domains: {
      name: 'domains',
      label: 'Select some domains',
      type: 'text'
    }
  }
}
export default formModel
