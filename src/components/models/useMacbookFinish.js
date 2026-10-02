import { useEffect } from 'react'

const FINISH_MATERIALS = [
  'PaletteMaterial001',
  'PaletteMaterial002',
  'PaletteMaterial003',
  'lmWQsEjxpsebDlK',
  'iyDJFXmHelnMTbD',
  'CRQixVLpahJzhJc',
  'YYwBgwvcyZVOOAA',
  'LpqXZqhaGCeSzdu',
  'gMtYExgrEUqPfln',
]

export default function useMacbookFinish(materials, color) {
  useEffect(() => {
    if (!materials || !color) return

    for (const name of FINISH_MATERIALS) {
      materials[name]?.color?.set(color)
    }
  }, [materials, color])
}
