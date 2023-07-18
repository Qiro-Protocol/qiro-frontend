import { Pool } from "@/components/pool"
import { Navbar } from "../components/navbar"
import {
    useAccount,
    useContractRead,
    usePublicClient,
    useWalletClient,
} from "wagmi"
import { toast } from "react-hot-toast"
import {
    ERC20_ABI,
    QIRO_ADDRESS,
    QIRO_POOL_ABI,
    TEST_ERC20,
} from "@/lib/config"
import { useEffect, useState } from "react"
import { formatUnits, parseUnits } from "viem"

const Deposit = () => {
    const [deposit, setDeposit] = useState("")
    const [withdraw, setWithdraw] = useState("")
    const [balance, setBalance] = useState(0)
    const [poolBalance, setPoolBalance] = useState(0)
	const [deposited, setDeposited] = useState(0)

    const { data: client } = useWalletClient()
    const { address } = useAccount()

    const { data, isError, isLoading } = useContractRead({
        address: TEST_ERC20,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
        onSuccess: (data) => {
            setBalance(Number(data))
        },
    })

	const ____ = useContractRead({
        address: TEST_ERC20,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [QIRO_ADDRESS],
        onSuccess: (data) => {
            setPoolBalance(Number(data))
        },
    })

    const _ = useContractRead({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "balanceOf",
        args: [address],
        onSuccess: (data) => {
            setDeposited(Number(data))
        },
    })

    const publicClient = usePublicClient()

    useEffect(
        () => console.log(isError, balance, isLoading),
        [isError, balance, isLoading]
    )

    const approveToken = async () => {
        const toastId = toast.loading("Approving tokens")
        try {
            if (!client)
                return toast.error("Connect a wallet", {
                    id: toastId,
                })

            const hash = await client.writeContract({
                address: TEST_ERC20,
                abi: ERC20_ABI,
                functionName: "approve",
                gas: 10000000n,
                args: [QIRO_ADDRESS, parseUnits(deposit as `${number}`, 18)],
            })

            await publicClient.waitForTransactionReceipt({
                hash,
            })

            toast.success("Successfully deposited tokens in pool", {
                id: toastId,
            })
        } catch (e) {
            toast.error("Cannot deposit tokens in pool", {
                id: toastId,
            })
        }
    }

    const depositTokens = async () => {
        await approveToken()

        const toastId = toast.loading("Depositing tokens in pool")
        try {
            if (!client)
                return toast.error("Connect a wallet", {
                    id: toastId,
                })

            const hash = await client.writeContract({
                address: QIRO_ADDRESS,
                abi: QIRO_POOL_ABI,
                functionName: "deposit",
                gas: 10000000n,
                args: [
                    parseUnits(deposit as `${number}`, 18),
                    client.account.address,
                ],
            })

            await publicClient.waitForTransactionReceipt({
                hash,
            })

            toast.success("Successfully deposited tokens in pool", {
                id: toastId,
            })
        } catch (e) {
            toast.error("Cannot deposit tokens in pool", {
                id: toastId,
            })
        }
    }

    const withdrawTokens = async () => {        
        const toastId = toast.loading("Withdrawing tokens in pool")

        try {
            if (!client)
                return toast.error("Connect a wallet", {
                    id: toastId,
                })

            const hash = await client.writeContract({
                address: QIRO_ADDRESS,
                abi: QIRO_POOL_ABI,
                functionName: "withdraw",
                gas: 10000000n,
                args: [
                    parseUnits(withdraw as `${number}`, 18),
                    client.account.address,
                    client.account.address,
                ],
            })

            await publicClient.waitForTransactionReceipt({
                hash,
            })

            toast.success("Successfully withdrawn tokens in pool", {
                id: toastId,
            })
        } catch (e) {
            toast.error("Cannot withdraw tokens in pool", {
                id: toastId,
            })
        }
    }

    const [principal, setPrincipal] = useState("0")
    const [interest, setInterest] = useState("0")

    const ___ = useContractRead({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "totalDeposit",
        args: [],
        onSuccess: (data: any) => {
            setPrincipal(formatUnits(data, 18))
        },
        onError: (e) => {
            console.log(e, "error")
        },
    })

    const __ = useContractRead({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "totalInterestCollected",
        args: [],
        onSuccess: (data: any) => {
            setInterest(formatUnits(data, 18))
        },
    })

    const riskMitigation = [
        {
            title: "Deal Structure",
            subtitle: "Unitranche",
            desc: "On-chain capital for this pool is being raised into a single tranche",
        },
        {
            title: "Post disbursement reporting",
            subtitle: "",
            desc: "Integrations into Loan management system for tracking and alerts",
        },
        {
            title: "Collateral",
            subtitle: "",
            desc: "Overcollateralized off-chain",
        },
        {
            title: "LTV(Loan-To-Value)",
            subtitle: "",
            desc: "75%",
        },
        {
            title: "Legal recourse",
            subtitle: "Loan agreement",
            desc: "Legal agreement with borrowers enforceable off-chain",
        },
    ]

    return (
        <main className="w-full min-h-screen bg-white">
            <Navbar />
            <main className="space-y-10 md:space-y-0 space-x-0 md:space-x-10 w-full min-h-screen flex-col flex justify-center items-start">
                <div className="w-full h-full flex space-x-10">
					<div className="w-full h-full flex justify-center items-center flex-col space-y-6">
						<div className="w-11/12 space-y-3 h-full flex justify-center items-center flex-col p-5 rounded-md">
							<Pool />
						</div>
					</div>
                    <div className="w-full h-full flex justify-center items-center flex-col space-y-6">
                        {/* <div className="w-8/12 text-black p-4">
                            <h1>Total Assets</h1>
                            <p className="text-2xl font-bold">
                                TUSDC 
                                {Number(
                                    formatUnits(BigInt(poolBalance), 18)
                                ).toFixed(2)}
                            </p>
                        </div> */}
                        <div className="w-8/12 space-y-3 h-full flex justify-center items-center flex-col border p-5 rounded-md">
                            <h1 className="font-bold text-3xl text-black">
                                Deposit
                            </h1>
                            <input
                                value={deposit}
                                onChange={(val) => setDeposit(val.target.value)}
                                type="number"
                                min={0}
                                className="text-black w-full p-3 border rounded-xl"
                                placeholder="Enter deposit amount"
                            />
                            <div className="w-full flex justify-end items-center space-x-1 text-sm">
								<p className="text-gray-500 text-right">
									Your balance - TUSDC {Number(formatUnits(BigInt(balance), 18)).toFixed(2)}
								</p>
								<p className="text-[#ff8802] font-bold cursor-pointer" onClick={() => setDeposit(formatUnits(BigInt(balance), 18))}>Max</p>
							</div>
                            <div
                                onClick={() => depositTokens()}
                                className="w-full p-3 bg-[#ff8802] text-black rounded-xl cursor-pointer text-center"
                            >
                                Deposit
                            </div>
                        </div>
                        <div className="w-8/12 space-y-3 h-full flex justify-center items-center flex-col border p-5 rounded-md">
                            <h1 className="font-bold text-3xl text-black">
                                Withdraw
                            </h1>
                            <input
                                value={withdraw}
                                onChange={(val) =>
                                    Number(val.target.value) > Number(formatUnits(BigInt(deposited), 18)) ? undefined : setWithdraw(val.target.value)
                                }
                                type="number"
                                min={0}
                                className="text-black w-full p-3 border rounded-xl"
                                placeholder="Enter withdraw amount"
                            />
							<div className="w-full flex justify-end items-center space-x-1 text-sm">
								<p className="text-gray-500 text-right">
									Your balance - QP {Number(formatUnits(BigInt(deposited), 18))}
								</p>
								<p className="text-[#ff8802] font-bold cursor-pointer" onClick={() => {        console.log(withdraw, Number(formatUnits(BigInt(deposited), 18)))
        if(Number(withdraw) < Number(formatUnits(BigInt(deposited), 18))) toast("withdrawn amount is larger than active pool amount");setWithdraw(Number(formatUnits(BigInt(poolBalance), 18)) < Number(formatUnits(BigInt(deposited), 18)) ? formatUnits(BigInt(poolBalance), 18) : formatUnits(BigInt(deposited), 18))}}>Max</p>
							</div>
                            <div
                                onClick={() => withdrawTokens()}
                                className="w-full p-3 bg-[#ff8802] text-black rounded-xl cursor-pointer text-center"
                            >
                                Withdraw
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-fit h-fit grid md:grid-cols-2 md:gap-5">
                    <div className="text-black w-11/12 h-full flex flex-col justify-center items-start space-y-3">
                        <h1>Overview</h1>

                        <div className="w-full h-full grid grid-cols-2 rounded-xl grid-rows-2 border border-black">
                            <div className="p-2 border-b border-r border-black">
                                <p className="text-sm text-gray-500">
                                    Principal
                                </p>
                                <h1 className="font-bold text-xl">
                                    TUSDC {principal}
                                </h1>
                            </div>
                            <div className="p-2 border-b border-black">
                                <p className="text-sm text-gray-500">
                                    Interest
                                </p>
                                <h1 className="font-bold text-xl">
                                    TUSDC {interest}
                                </h1>
                            </div>
                            <div className="p-2 border-r border-black">
                                <p className="text-sm text-gray-500">Total</p>
                                <h1 className="font-bold text-xl">
                                    TUSDC {Number(principal) + Number(interest)}
                                </h1>
                            </div>
                            <div className="p-2 border-black">
                                <p className="text-sm text-gray-500">
                                    Repayment Status
                                </p>
                                <h1 className="font-bold text-xl">On Time</h1>
                            </div>
                        </div>
                    </div>

                    {/* <div className="text-black w-11/12 h-full flex flex-col justify-center items-start space-y-3">
                        <h1>Highlights</h1>

                        <div className="w-full h-full flex-col flex justify-center items-center">
                            <div className="w-full flex justify-around text-white items-center space-x-3 bg-sand-800 p-3 rounded-xl">
                                <h1 className="font-bold text-xl">
                                    Quarterly Redemption Option
                                </h1>
                                <p className="text-sm">
                                    Investors can demand early repayment every
                                    quarter. This pool provides investors with
                                    the right to redeem (aka "call back") on a
                                    quarterly basis. 60 days notice is required
                                    for any calls.
                                </p>
                            </div>
                        </div>
                        <div className="w-full h-full flex justify-center items-center space-x-2">
                            <div className="w-full flex flex-col justify-center text-white items-center space-x-3 bg-sand-700 p-2 rounded-xl">
                                <h1 className="font-bold text-xl">
                                    Asia Fintech Exposure
                                </h1>
                                <p className="text-sm text-center">
                                    Exposure to SMEs in one of the
                                    fastest-growing regions in the world
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center text-white items-center space-x-3 bg-sand-700 p-2 rounded-xl">
                                <h1 className="font-bold text-xl">
                                    Real-world recourse
                                </h1>
                                <p className="text-sm text-center">
                                    Real-world, legally enforceable loan
                                    agreement
                                </p>
                            </div>
                            <div className="w-full flex flex-col justify-center text-white items-center space-x-3 bg-sand-700 p-2 rounded-xl">
                                <h1 className="font-bold text-xl">
                                    Ongoing monitoring
                                </h1>
                                <p className="text-sm text-center">
                                    Quarterly reporting and direct-to-borrower
                                    communications
                                </p>
                            </div>
                        </div>
                    </div> */}

                    <div className="text-black w-11/12 h-full flex flex-col justify-center items-start space-y-3">
                        <h1>Analysis</h1>

                        <div className="w-full h-full grid grid-cols-2 rounded-xl grid-rows-2 border border-black">
                            <div className="p-2 border-b border-r border-black">
                                <p className="text-sm text-gray-500">
                                    Probability of Default
                                </p>
                                <h1 className="font-bold text-xl">0.5%</h1>
                            </div>
                            <div className="p-2 border-b border-black">
                                <p className="text-sm text-gray-500">
                                    Loss Given Default (predicted)
                                </p>
                                <h1 className="font-bold text-xl">30%</h1>
                            </div>
                            <div className="p-2 border-r border-black">
                                <p className="text-sm text-gray-500">
                                    Expected Loss (if defaulted)
                                </p>
                                <h1 className="font-bold text-xl">
                                    TUSDC {(Number(principal) +
                                        Number(interest)) * 0.05 * 0.3}
                                </h1>
                            </div>
                            <div className="p-2 border-black">
                                <p className="text-sm text-gray-500">
                                    Credit Rating
                                </p>
                                <h1 className="font-bold text-xl">
                                    AA - Excellent
                                </h1>
                            </div>
                        </div>
                        <p className="w-fit text-sm p-2 bg-sand-100 rounded-xl">
                            Detailed Report
                        </p>
                    </div>

					<div className="w-full h-full flex flex-col justify-center items-start space-y-4">
						<div className="text-black w-11/12 h-full flex flex-col justify-center items-start space-y-3">
							<h1>Repayment Terms</h1>

							<div className="w-full h-full grid grid-cols-3 rounded-xl grid-rows-2 border border-black">
								<div className="p-2 border-b border-r border-black">
									<p className="text-sm text-gray-500">
										Loan term
									</p>
									<h1 className="font-bold text-xl">12 Months</h1>
								</div>
								<div className="p-2 border-b border-r border-black">
									<p className="text-sm text-gray-500">
										Term start date
									</p>
									<h1 className="font-bold text-xl">
										1 July, 2023
									</h1>
								</div>
								<div className="p-2 border-b border-black">
									<p className="text-sm text-gray-500">
										Loan maturity date
									</p>
									<h1 className="font-bold text-xl">
										1 July, 2024
									</h1>
								</div>
								<div className="p-2 border-r border-black">
									<p className="text-sm text-gray-500">
										Repayment structure
									</p>
									<h1 className="font-bold text-xl">Bullet</h1>
								</div>
								<div className="p-2 border-r border-black">
									<p className="text-sm text-gray-500">
										Repayment Frequency
									</p>
									<h1 className="font-bold text-xl">Monthly</h1>
								</div>
								<div className="p-2 border-black">
									<p className="text-sm text-gray-500">
										Total payments
									</p>
									<h1 className="font-bold text-xl">12</h1>
								</div>
							</div>
						</div>

						<div className="text-black w-11/12 h-fit flex flex-col justify-center items-start space-y-3">
							<h1>Borrower Details</h1>

							<div className="w-full p-2 rounded-xl h-full bg-[#ff8802] flex-col flex justify-center items-center">
								<div className="w-full h-full flex justify-between items-center">
									<div className="w-full h-full flex justify-start p-2 items-center space-x-2">
										<div className="w-10 h-10 rounded-full bg-gray-400"></div>
										<div>
											<h1 className="font-bold text-xl">
												Rikvin Capital
											</h1>
											<p className="text-sm text-gray-500">
												Real Estate Bridge Loans in Singapore
											</p>
										</div>
									</div>
									<div className="w-full h-full flex justify-end items-center p-2">
										<p className="w-fit text-sm p-1 bg-green-200 rounded-xl">
											Vetted Borrower
										</p>
									</div>
								</div>

								<div className="w-full h-full p-2 text-sm space-y-3">
									<p>
										Rikvin Capital provides short term asset-backed financing in Singapore & U.K. Rikvin’s asset based approach to financing sets them apart from conventional lenders and offers specialised options for HNWIs and corporates.
									</p>

									<div className="flex justify-start items-center space-x-4">
										<a href="https://www.rikvincapital.com/" className="w-fit text-sm p-2 bg-sand-100 rounded-xl">
											Website
										</a>
										<a href="https://www.linkedin.com/company/rikvincapital" className="w-fit text-sm p-2 bg-sand-100 rounded-xl">
											Linkedin
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>

                    <div className="text-black row-span-2 w-11/12 h-full flex flex-col justify-center items-start space-y-3">
                        <h1>Risk Mitigation</h1>

                        <p className="text-sm text-gray-500">
                            Information on deal structure, collateral used to
                            secure this loan, and options in the case of a
                            default on repayment by the borrower
                        </p>

                        <div className="w-full h-full flex flex-col border border-black rounded-xl justify-center items-center">
                            {riskMitigation.map((value) => (
                                <div className="w-full h-20 border-b border-black px-2 flex justify-center items-center">
                                    <div className="flex justify-start border-r border-black h-full items-center w-full">
                                        <h1 className="font-bold text-xl">
                                            {value.title}
                                        </h1>
                                    </div>
                                    <div className="space-y-1 w-full flex-start pl-3">
                                        {value.subtitle.length > 0 && (
                                            <h1 className="font-semibold">
                                                {value.subtitle}
                                            </h1>
                                        )}
                                        <p className="text-sm font-gray-500">
                                            {value.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </main>
    )
}

export default Deposit
