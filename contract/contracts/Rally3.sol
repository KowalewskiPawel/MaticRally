// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@imtbl/imx-contracts/contracts/Mintable.sol";

import "./libraries/Base64.sol";

contract Rally3 is ERC721, Mintable {

    struct DriverAttributes {
        uint256 power;
        uint256 points;
    }

    using SafeMath for uint256;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    mapping(uint256 => DriverAttributes) public nftHolderAttributes;
    mapping(address => uint256) public nftHolders;

    event DriverNFTMinted(address sender, uint256 tokenId);

    constructor(address _imx) ERC721("Rally3.0", "RALLY3") Mintable(msg.sender, _imx) {
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        DriverAttributes memory driverAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory power = Strings.toString(driverAttributes.power);
        string memory points = Strings.toString(driverAttributes.points);
        string
            memory logo = "ipfs://QmS9azPrFFmka96iV4hCMZCWBDo5g8cGB6NSu5aMqmTwQm";

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "'
                        "Rally3.0 Driver "
                        '", "description": "Rally 3.0 Rally Driver profile and car data", "image": "',
                        logo,
                        '","attributes": [ { "trait_type": "Power", "value": ',
                        power,
                        '}, { "trait_type": "Points", "value": ',
                        points,
                        "} ]}"
                    )
                )
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function checkIfUserHasNFT() public view returns (DriverAttributes memory) {
        uint256 userNftTokenId = nftHolders[msg.sender];
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        } else {
            DriverAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function mintDriverNFT()
        external
    {
        require(
            nftHolders[msg.sender] == 0,
            "Only one nft per address allowed"
        );
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        nftHolderAttributes[newItemId] = DriverAttributes({
            power: 20,
            points: 0
        });

        nftHolders[msg.sender] = newItemId;

        _tokenIds.increment();

        emit DriverNFTMinted(msg.sender, newItemId);
    }

    function _mintFor(
        address to,
        uint256 id,
        bytes calldata blueprint
    ) internal override {
       
    }

       modifier isRallyDriver() {
        require(nftHolders[msg.sender] > 0, "You are not a rally driver");
        _;
    }

    function driverPointsInc() external isRallyDriver {

        uint256 idOfDriverNft = nftHolders[msg.sender];
        DriverAttributes storage driver = nftHolderAttributes[idOfDriverNft];

        driver.points = driver.points.add(1);
    }

    function increasePower() external isRallyDriver {

        uint256 idOfDriverNft = nftHolders[msg.sender];
        DriverAttributes storage driver = nftHolderAttributes[idOfDriverNft];

        require(driver.points >= 10, "not enought points");

        driver.points = driver.points.sub(10);
        driver.power = driver.power.add(1);
    }

}