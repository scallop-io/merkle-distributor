import { u64 } from "@saberhq/token-utils";
import { writeFileSync } from "fs";

import airdropDataRaw from "../data/airdrop-amounts.json";
// import airdropDataRaw from "../data/ignition-seagrass-airdrop-amounts.json";
// import airdropDataRaw from "../data/riptide-seagrass-airdrop-amounts.json";
// import airdropDataRaw from "../data/riptide-and-fossil-moray-airdrop-amounts.json";
import { parseBalanceMap } from "../src/utils";

const outPath = "data/distributor-info.json";
// const outPath = "data/ignition-seagrass-distributor-info.json";
// const outPath = "data/riptide-seagrass-distributor-info.json";
// const outPath = "data/riptide-moray-distributor-info.json";

const main = () => {
  const balanceMap: { [authority: string]: u64 } = {};
  airdropDataRaw.forEach(({ authority, amount }) => {
    const prevBalance = balanceMap[authority];
    if (prevBalance) {
      balanceMap[authority] = prevBalance.add(new u64(amount));
    } else {
      balanceMap[authority] = new u64(amount);
    }
  });

  const {
    claims: claimsRaw,
    merkleRoot,
    tokenTotal,
  } = parseBalanceMap(
    Object.entries(balanceMap).map(([authority, amount]) => ({
      address: authority,
      earnings: amount.toString(),
    }))
  );

  const claims = Object.entries(claimsRaw).map(([authority, claim]) => ({
    [authority]: {
      index: claim.index,
      amount: claim.amount.toString(),
      proof: claim.proof.map((proof) => proof.toString("hex")),
    },
  }));

  const merkleDistributorInfo = {
    merkleRoot: merkleRoot.toString("hex"),
    tokenTotal: tokenTotal.toString(),
    claims,
  };

  writeFileSync(outPath, JSON.stringify(merkleDistributorInfo, null, 2));
};

main();
