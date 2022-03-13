const transformDriverData = (driverData) => {
  return {
    power: driverData.power.toNumber(),
    attempts: driverData.points.toNumber(),
  };
};

export default transformDriverData;
