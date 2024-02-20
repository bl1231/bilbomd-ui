const formModel = {
  formId: 'formId',
  formField: {
    pdb_file: {
      name: 'pdb_file',
      label: 'Please upload a PDB File',
      reviewLabel: 'Your PDB file is still here: ',
      requiredErrorMsg: 'PDB file is required',
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
