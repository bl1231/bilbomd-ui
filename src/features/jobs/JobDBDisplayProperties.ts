export const displayPropertiesByJobType: Record<string, string[]> = {
  BilboMdPDB: [
    'PDB file',
    'PSF file',
    'CRD file',
    'CHARMM constraint file',
    'Rg min',
    'Rg max',
    'Rg step size',
    'Rg List',
    'Number of conformations'
  ],
  BilboMdCRD: [
    'PSF file',
    'CRD file',
    'CHARMM constraint file',
    'Rg min',
    'Rg max',
    'Rg step size',
    'Rg List',
    'Number of conformations'
  ],
  BilboMdAuto: [
    'PDB file',
    'PSF file',
    'CRD file',
    'CHARMM constraint file',
    'Rg min',
    'Rg max',
    'Rg step size',
    'Rg List',
    'Number of conformations'
  ],
  BilboMdScoper: ['PSF file', 'CRD file', 'PDB file'],
  BilboMdAlphaFold: [],
  BilboMdSANS: [
    'Rg min',
    'Rg max',
    'Rg step size',
    'Rg List',
    'Number of conformations',
    'PDB file',
    'Solvent D20 Fraction'
  ]
}
