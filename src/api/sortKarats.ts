export type Karat_TP = {
  id: number,
  label: string,
  value: string
}

export type SortKarats_TP = Karat_TP[]

export const sortKarats = (karats: SortKarats_TP) => {
  return karats.sort((a, b) => Number(a.value) - Number(b.value))
}