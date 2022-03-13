const transformDriverData = (driverData) => {
  return {
    power: driverData.power.toNumber(),
    points: driverData.points.toNumber(),
  };
};

export default transformDriverData;
