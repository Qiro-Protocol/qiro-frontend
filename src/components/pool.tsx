import { QIRO_ADDRESS, QIRO_POOL_ABI } from "@/lib/config";
import { useState } from "react";
import { formatUnits } from "viem";
import { useContractRead } from "wagmi";

export const Pool = () => {
    const [principal, setPrincipal] = useState("0")
    const [interest, setInterest] = useState("0")
    
    const _ = useContractRead({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "totalDeposit",
        args: [],
        onSuccess: (data: any) => {
          setPrincipal(formatUnits(data, 18));
        },
        onError: (e) => {
            console.log(e, "error")
        }
      });
      
      const __ = useContractRead({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "totalInterestCollected",
        args: [],
        onSuccess: (data: any) => {
          setInterest(formatUnits(data, 18));
        },
      });

    const riskMitigation = [
        {
            title: "Deal Structure",
            subtitle: "Unitranche",
            desc: "On-chain capital for this pool is being raised into a single tranche"
        },
        {
            title: "On-chain capital priority",
            subtitle: "Senior",
            desc: "The capital invested in this pool will be repaid pari passu with other senior debt, if any, raised by the company"
        },
        {
            title: "Off-chain capital priority",
            subtitle: "Senior",
            desc: "The capital invested in this pool will be repaid pari passu with other senior debt, if any, raised by the company"
        },
        {
            title: "Recourse to borrower",
            subtitle: "",
            desc: "Yes"
        },
        {
            title: "Post-close reporting",
            subtitle: "",
            desc: "Investors can access borrower-related updated via the investment-gated Discord Channel"
        },
        {
            title: "Legal recourse",
            subtitle: "Loan agreement",
            desc: "Specifies the loan terms agreed to by the borrower and all investors; legally enforceable off-chain"
        },
    ]

    return (
        <div className="w-full h-full flex-col flex justify-center items-center space-y-8 mb-10">
            <div className="w-full h-full bg-[#ff8802] text-black rounded-xl flex flex-col justify-center items-center">
                <div className="w-full p-4 flex justify-between items-end">
                    <div>
                        <p className="text-gray-600 text-sm">Qiro</p>
                        <h1 className="font-bold text-2xl">Qiro Senior Pool</h1>
                    </div>
                    <p>Etherscan</p>
                </div>

                <div className="w-full px-4 pb-4">
                    <p>
                        The Senior Pool is a pool of capital that is diversified
                        across all Borrower Pools on the Qiro protocol.
                        Liquidity Providers (LPs) who provide capital into the
                        Senior Pool are capital providers in search of passive,
                        diversified exposure across all Borrower Pools. This
                        capital is protected by junior (first-loss) capital in
                        each Borrower Pool.
                    </p>
                </div>

                <div className="w-full flex justify-between items-center p-4">
                    <div>
                        <p className="text-gray-600 text-sm">USDC APY</p>
                        <h1 className="font-bold text-2xl">12%</h1>
                    </div>
                    <div className="flex justify-end items-end flex-col">
                        <p className="text-gray-600 text-sm">
                            Variable QRO APY
                        </p>
                        <h1 className="font-bold text-2xl">0.1%</h1>
                    </div>
                </div>

                <div className="w-full p-4 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <p>Loan Term</p>
                        <p>Open Ended</p>
                    </div>
                    <div className="w-full border border-black my-2"></div>
                    <div className="w-full flex justify-between items-center">
                        <p>Liquidity</p>
                        <p>Withdrawal Request</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
