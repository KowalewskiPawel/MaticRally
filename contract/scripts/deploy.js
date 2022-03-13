(async () => {
  try {
    const Rally3 = await ethers.getContractFactory("Rally3");

    const deployedToken = await Rally3.deploy(
      "0x4527be8f31e2ebfbef4fcaddb5a17447b27d2aef"
    );

    console.log("Contract deployed to address:", deployedToken.address);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
