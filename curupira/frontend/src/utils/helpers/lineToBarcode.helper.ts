export const lineToBarcode = (digitableLine: string): string => {
  const group1 = digitableLine.substring(0, 4)
  const group2 = digitableLine.substring(4, 9)
  const group3 = digitableLine.substring(10, 20)
  const group4 = digitableLine.substring(21, 31)
  const group5 = digitableLine.substring(32, digitableLine.length)
  const barCode = group1 + group5 + group2 + group3 + group4

  return barCode
}
