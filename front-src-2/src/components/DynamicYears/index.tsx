const DynamicYears = (startYear: number, endYear: number) => {
  let createYears = [];
  for (let index = startYear; index <= endYear; index++) {
    createYears.push({ value: index, label: index.toString() });
  }
  return createYears.reverse();
};

export default DynamicYears;
