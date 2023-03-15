const formModel = {
  formId: 'formId',
  formField: {
    crdFile: {
      name: 'crdFile',
      label: 'Please upload a CRD File obtained from CHARMM-GUI:',
      reviewLabel: 'Your crdFile is still here: ',
      requiredErrorMsg: 'Image is required',
      type: 'file'
    },
    chains: {
      name: 'chains'
    }
  }
}
export default formModel
