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
        <div className="w-full h-full flex-col flex justify-center items-center space-y-8">
            <div className="w-full h-full bg-[#ff8802] text-black rounded-xl flex flex-col justify-center items-center">
                <div className="w-full h-full p-4 flex justify-between items-end">
                    <div>
                        <p className="text-gray-600 text-sm">Rikvin Capital</p>
                        <h1 className="font-bold text-2xl">Real Estate Bridge Loans in Singapore</h1>
                    </div>
                    <a href="https://sepolia.etherscan.io/address/0x1d0b1ae66586d418ee7f7b82fed0ea835f9e1fe7" target="_blank">Etherscan</a>
                </div>

                <div className="w-full px-4 pb-4">
                    <p>
                        Proceeds from this pool would be used by Rikvin Capital to private financing in the form of short-term loans, fully secured against an asset such as property or shares. All the borrowers in this pool are HNIs or real estate developers based in Singapore & UK. Senior capital in this pool is protected by 20% junior capital invested by asset originators & underwriters.
                        <br />
                        <br />
                        <br />
                    </p>
                </div>

                <div className="w-full flex justify-between items-center p-4">
                    <div>
                        <p className="text-gray-600 text-sm">APY</p>
                        <h1 className="font-bold text-2xl">12%</h1>
                    </div>
                </div>

                <div className="w-full p-4 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <p>Loan Tenure</p>
                        <p>12 months</p>
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
