const roundToSingleDecimal = (value) => Math.round(value * 10) / 10;

const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg) {
    return 0;
  }

  const heightInMeters = heightCm / 100;

  if (heightInMeters <= 0) {
    return 0;
  }

  return roundToSingleDecimal(weightKg / (heightInMeters * heightInMeters));
};

module.exports = {
  calculateBMI,
};
