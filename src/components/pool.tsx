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
            <div className="w-full h-full bg-[#F1E9D2] text-black rounded-xl flex flex-col justify-center items-center">
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

            <div className="text-black w-full h-full flex flex-col justify-center items-start space-y-3">
                <h1>Overview</h1>

                <div className="w-full h-full grid grid-cols-2 rounded-xl grid-rows-2 border border-black">
                    <div className="p-2 border-b border-r border-black">
                        <p className="text-sm text-gray-500">Principal</p>
                        <h1 className="font-bold text-xl">${principal}</h1>
                    </div>
                    <div className="p-2 border-b border-black">
                        <p className="text-sm text-gray-500">Interest</p>
                        <h1 className="font-bold text-xl">${interest}</h1>
                    </div>
                    <div className="p-2 border-r border-black">
                        <p className="text-sm text-gray-500">Total</p>
                        <h1 className="font-bold text-xl">${Number(principal) + Number(interest)}</h1>
                    </div>
                    <div className="p-2 border-black">
                        <p className="text-sm text-gray-500">Repayment Status</p>
                        <h1 className="font-bold text-xl">On Time</h1>
                    </div>
                </div>
            </div>

            <div className="text-black w-full h-full flex flex-col justify-center items-start space-y-3">
                <h1>Highlights</h1>

                <div className="w-full h-full flex-col flex justify-center items-center">
                    <div className="w-full flex justify-around text-white items-center space-x-3 bg-sand-800 p-3 rounded-xl">
                        <h1 className="font-bold text-xl">Quarterly Redemption Option</h1>
                        <p className="text-sm">
                            Investors can demand early repayment every quarter. This pool provides investors with the right to redeem (aka "call back") on a quarterly basis. 60 days notice is required for any calls. 
                        </p>
                    </div>
                </div>
                <div className="w-full h-full flex justify-center items-center space-x-2">
                    <div className="w-full flex flex-col justify-center text-white items-center space-x-3 bg-sand-700 p-2 rounded-xl">
                        <h1 className="font-bold text-xl">Asia Fintech Exposure</h1>
                        <p className="text-sm text-center">
                            Exposure to SMEs in one of the fastest-growing regions in the world
                        </p>
                    </div>
                    <div className="w-full flex flex-col justify-center text-white items-center space-x-3 bg-sand-700 p-2 rounded-xl">
                        <h1 className="font-bold text-xl">Real-world recourse</h1>
                        <p className="text-sm text-center">
                            Real-world, legally enforceable loan agreement
                        </p>
                    </div>
                    <div className="w-full flex flex-col justify-center text-white items-center space-x-3 bg-sand-700 p-2 rounded-xl">
                        <h1 className="font-bold text-xl">Ongoing monitoring</h1>
                        <p className="text-sm text-center">
                            Quarterly reporting and direct-to-borrower communications
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-black w-full h-full flex flex-col justify-center items-start space-y-3">
                <h1>Analysis</h1>

                <div className="w-full h-full grid grid-cols-2 rounded-xl grid-rows-2 border border-black">
                    <div className="p-2 border-b border-r border-black">
                        <p className="text-sm text-gray-500">Probability of Default</p>
                        <h1 className="font-bold text-xl">0.5%</h1>
                    </div>
                    <div className="p-2 border-b border-black">
                        <p className="text-sm text-gray-500">Loss Given Default</p>
                        <h1 className="font-bold text-xl">30%</h1>
                    </div>
                    <div className="p-2 border-r border-black">
                        <p className="text-sm text-gray-500">Expected Loss</p>
                        <h1 className="font-bold text-xl">${Number(principal) + Number(interest) * 0.05 * 0.3}</h1>
                    </div>
                    <div className="p-2 border-black">
                        <p className="text-sm text-gray-500">Credit Rating</p>
                        <h1 className="font-bold text-xl">AA - Excellent</h1>
                    </div>
                </div>
                <p className="w-fit text-sm p-2 bg-sand-100 rounded-xl">Detailed Report</p>
            </div>

            <div className="text-black w-full h-full flex flex-col justify-center items-start space-y-3">
                <h1>Repayment Terms</h1>

                <div className="w-full h-full grid grid-cols-3 rounded-xl grid-rows-2 border border-black">
                    <div className="p-2 border-b border-r border-black">
                        <p className="text-sm text-gray-500">Loan term</p>
                        <h1 className="font-bold text-xl">12 Months</h1>
                    </div>
                    <div className="p-2 border-b border-r border-black">
                        <p className="text-sm text-gray-500">Term start date</p>
                        <h1 className="font-bold text-xl">1 July, 2023</h1>
                    </div>
                    <div className="p-2 border-b border-black">
                        <p className="text-sm text-gray-500">Loan maturity date</p>
                        <h1 className="font-bold text-xl">1 July, 2024</h1>
                    </div>
                    <div className="p-2 border-r border-black">
                        <p className="text-sm text-gray-500">Repayment structure</p>
                        <h1 className="font-bold text-xl">Monthly</h1>
                    </div>
                    <div className="p-2 border-r border-black">
                        <p className="text-sm text-gray-500">Payment Frequency</p>
                        <h1 className="font-bold text-xl">1 Month</h1>
                    </div>
                    <div className="p-2 border-black">
                        <p className="text-sm text-gray-500">Total payments</p>
                        <h1 className="font-bold text-xl">12</h1>
                    </div>
                </div>
            </div>

            <div className="text-black w-full h-full flex flex-col justify-center items-start space-y-3">
                <h1>Borrower Details</h1>

                <div className="w-full p-2 rounded-xl h-full bg-mustard-100 flex-col flex justify-center items-center">
                    <div className="w-full h-full flex justify-between items-center">
                        <div className="w-full h-full flex justify-start p-2 items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-gray-400"></div>
                            <div>
                                <h1 className="font-bold text-xl">Fazz</h1>
                                <p className="text-sm text-gray-500">Fintech</p>
                            </div>
                        </div>
                        <div className="w-full h-full flex justify-end items-center p-2">
                            <p className="w-fit text-sm p-1 bg-green-200 rounded-xl">Vetted Borrower</p>
                        </div>
                    </div>

                    <div className="w-full h-full p-2 text-sm space-y-3">
                        <p>
                            Fazz offers seamless payment, savings, and credit solutions, providing businesses of all sizes an equal opportunity to build, run, and grow in Southeast Asia. The company caters to the warung and MSME customer segments in Indonesia under the brand Fazz Agen, and small to medium-sized businesses in Singapore and Indonesia under the brand Fazz Business. The company also owns StraitsX, the leading stablecoin issuer in Singapore and Indonesia
                        </p>

                        <div className="w-full h-full flex justify-start items-center space-x-4">
                            <p className="w-fit text-sm p-2 bg-sand-100 rounded-xl">Website</p>
                            <p className="w-fit text-sm p-2 bg-sand-100 rounded-xl">Linkedin</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-black w-full h-full flex flex-col justify-center items-start space-y-3">
                <h1>Risk Mitigation</h1>

                <p className="text-sm text-gray-500">Information on deal structure, collateral used to secure this loan, and options in the case of a default on repayment by the borrower</p>

                <div className="w-full h-full flex flex-col justify-center items-center space-y-4">
                    {riskMitigation.map(value => (
                        <div className="w-full h-full border-b flex justify-center items-center mb-2">
                            <div className="flex justify-start items-center w-full">
                                <h1 className="font-bold text-xl">{value.title}</h1>
                            </div>
                            <div className="space-y-1 w-full flex-start">
                                {value.subtitle.length > 0 && <h1 className="font-semibold">{value.subtitle}</h1>}
                                <p className="text-sm font-gray-500">{value.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
