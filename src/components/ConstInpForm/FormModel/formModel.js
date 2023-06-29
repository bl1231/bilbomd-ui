const formModel = {
  formId: 'formId',
  formField: {
    crd_file: {
      name: 'crd_file',
      label: 'Please upload a CRD File obtained from CHARMM-GUI:',
      reviewLabel: 'Your CRD file is still here: ',
      requiredErrorMsg: 'CRD file is required',
      type: 'file',
      rigid_bodies: ''
    },
    domains: {
      name: 'domains',
      label: 'Select some domains',
      type: 'text'
    }
  }
}
export default formModel
