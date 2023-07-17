import Image from "next/image"
import { Navbar } from "../components/navbar"
import { useEffect, useState } from "react"
import {
    useAccount,
    useContractRead,
    usePublicClient,
    useWalletClient,
} from "wagmi"
import {
    ERC20_ABI,
    QIRO_ADDRESS,
    QIRO_POOL_ABI,
    TEST_ERC20,
} from "@/lib/config"
import { toast } from "react-hot-toast"
import { formatUnits, parseUnits } from "viem"
import { Pool } from "@/components/pool"

export default function Borrow() {
    const [borrow, setBorrow] = useState("")
    const [times, setTimes] = useState(new Array(100))
    const [loans, setLoans] = useState<any[]>([])
	const [balance, setBalance] = useState(0)

    useEffect(() => console.log(times), [times])

    const { address } = useAccount()

	const _ = useContractRead({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "lpPool",
        args: [],
        onSuccess: (data) => {
            setBalance(Number(data))
        },
    })

    const { data, isError, isLoading } = useContractRead({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "getUserBorrowDetails",
        args: [address],
        onSuccess: (data) => {
            console.log(data)
            setLoans(data as any[])
        },
    })

    const publicClient = usePublicClient()
    const { data: client } = useWalletClient()

    const approveToken = async () => {
        const toastId = toast.loading("Approving tokens")
        try {
            if (!client)
                return toast.error("Connect a wallet", {
                    id: toastId,
                })

            const balance: any = await publicClient.readContract({
                address: TEST_ERC20,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: [client.account.address],
            })

            const hash = await client.writeContract({
                address: TEST_ERC20,
                abi: ERC20_ABI,
                functionName: "approve",
                gas: 10000000n,
                args: [QIRO_ADDRESS, balance],
            })

            await publicClient.waitForTransactionReceipt({
                hash,
            })

            toast.success("Successfully approved tokens to pool", {
                id: toastId,
            })
        } catch (e) {
            toast.error("Cannot approve tokens to pool", {
                id: toastId,
            })
        }
    }

    const borrowTokens = async () => {
        const toastId = toast.loading("Borrowing tokens from pool")
        try {
            if (!client)
                return toast.error("Connect a wallet", {
                    id: toastId,
                })

            const hash = await client.writeContract({
                address: QIRO_ADDRESS,
                abi: QIRO_POOL_ABI,
                functionName: "borrow",
                gas: 10000000n,
                args: [parseUnits(borrow as `${number}`, 18), 12, "ipfs://"],
            })

            await publicClient.waitForTransactionReceipt({
                hash,
            })

            toast.success("Successfully borrowed tokens from pool", {
                id: toastId,
            })
        } catch (e) {
            toast.error("Cannot borrow tokens from pool", {
                id: toastId,
            })
        }
    }

    const repayLoans = async (id: any, time: number) => {
        await approveToken()

        const toastId = toast.loading("Repaying tokens to pool")
        try {
            if (!client)
                return toast.error("Connect a wallet", {
                    id: toastId,
                })

            const hash = await client.writeContract({
                address: QIRO_ADDRESS,
                abi: QIRO_POOL_ABI,
                functionName: "repay",
                gas: 10000000n,
                args: [id, time],
            })

            await publicClient.waitForTransactionReceipt({
                hash,
            })

            toast.success("Successfully repayed tokens to pool", {
                id: toastId,
            })
        } catch (e) {
            toast.error("Cannot repay tokens to pool", {
                id: toastId,
            })
        }
    }

    return (
        <main className="w-full min-h-screen bg-white">
            <Navbar />
            <main className="space-y-10 md:space-y-0 space-x-0 md:space-x-10 w-full min-h-screen flex-col md:flex-row flex justify-center items-start">
                <div className="w-full h-full flex justify-center md:justify-end items-center">
                    <div className="w-11/12 flex justify-center items-center">
                        <Pool />
                    </div>
                </div>
                <div className="w-full h-full flex justify-start items-center md:items-center flex-col space-y-6">
                    <div className="w-8/12 space-y-3 h-full flex justify-center items-center flex-col border p-5 rounded-md">
                        <h1 className="font-bold text-3xl text-black">
                            Borrow
                        </h1>
                        <input
                            value={borrow}
                            onChange={(e) => Number(e.target.value) > Number(formatUnits(BigInt(balance), 18)) ? undefined : setBorrow(e.target.value)}
                            type="number"
							max={Number(formatUnits(BigInt(balance), 18))}
                            className="text-black w-full p-3 border rounded-xl"
                            placeholder="Enter borrow amount"
                        />
						<div className="w-full flex justify-end items-center space-x-1 text-sm">
							<p className="text-gray-500 text-right">
								Pool balance - ${Number(formatUnits(BigInt(balance), 18))}
							</p>
							<p className="text-[#ff8802] font-bold cursor-pointer" onClick={() => setBorrow(formatUnits(BigInt(balance), 18))}>Max</p>
						</div>
                        <div
                            onClick={() => borrowTokens()}
                            className="w-full p-3 bg-[#ff8802] text-black rounded-xl cursor-pointer text-center"
                        >
                            Borrow
                        </div>
                    </div>
                    <div className="w-8/12 space-y-3 h-full flex justify-center items-center flex-col border p-5 rounded-md">
                        <h1 className="font-bold text-3xl text-black mb-4">
                            Your Loans
                        </h1>
                        {loans.map((loan, idx) => (
                            <div className="w-11/12 flex flex-col border rounded-xl p-4 justify-between items-center">
                                <div className="text-black flex border-b mb-3 justify-start items-center space-x-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-800">
                                            Borrow Amount
                                        </p>
                                        <h1 className="text-2xl font-bold">
                                            $
                                            {Number(
                                                formatUnits(
                                                    loan.borrowAmount.toString(),
                                                    18
                                                )
                                            ).toFixed(2)}
                                        </h1>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-800">
                                            Repaid Amount
                                        </p>
                                        <h1 className="text-2xl font-bold">
                                            $
                                            {Number(
                                                formatUnits(
                                                    loan.repaidAmount.toString(),
                                                    18
                                                )
                                            ).toFixed(2)}
                                        </h1>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-800">
                                            Tenure
                                        </p>
                                        <h1 className="text-2xl font-bold">
                                            {loan.timePeriod.toString()} Months
                                        </h1>
                                    </div>
                                </div>
                                <div className="space-y-2 text-center">
									<label htmlFor="pool" className="text-black">Enter repay months</label>
                                    <input
										name="pool"
                                        value={times[idx]}
                                        onChange={(e) =>
                                            setTimes((times) => {
                                                const [...t] = times
                                                if(Number(e.target.value) > 12) e.target.value = "12"
                                                t[idx] = Number(e.target.value)
                                                return t
                                            })
                                        }
                                        type="number"
                                        className="text-black w-full p-2 border rounded-xl"
                                        placeholder="Enter repay month"
                                    />
                                    {times[idx] &&
                                        <p className="text-black">You will be paying: {(((Number(
                                            formatUnits(
                                                loan.borrowAmount.toString(),
                                                18
                                            )
                                        ) / 12) * times[idx]) + (times[idx] * (Number(
                                            formatUnits(
                                                loan.borrowAmount.toString(),
                                                18
                                            )
                                        )) * 0.01)).toFixed(2)}</p>
                                    }
                                    <div
                                        onClick={() =>
                                            repayLoans(
                                                loan.borrowId,
                                                times[idx]
                                            )
                                        }
                                        className="text-black w-full p-2 bg-[#ff8802] rounded-xl cursor-pointer text-center"
                                    >
                                        Repay
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </main>
    )
}
