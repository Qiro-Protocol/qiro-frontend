import Image from 'next/image'
import { Navbar } from '../components/navbar'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, usePublicClient, useWalletClient } from 'wagmi'
import { ERC20_ABI, QIRO_ADDRESS, QIRO_POOL_ABI, TEST_ERC20 } from '@/lib/config'
import { toast } from 'react-hot-toast'
import { formatUnits, parseUnits } from 'viem'
import { Pool } from '@/components/pool'

export default function Borrow() {
  const [borrow, setBorrow] = useState("")
  const [times, setTimes] = useState(new Array(100))
  const [loans, setLoans] = useState<any[]>([])

  useEffect(() => console.log(times), [times])

  const { address } = useAccount()
  
  const { data, isError, isLoading } = useContractRead({
    address: QIRO_ADDRESS,
    abi: QIRO_POOL_ABI,
    functionName: 'getUserBorrowDetails',
    args: [address],
    onSuccess: (data) => {
      console.log(data)
      setLoans(data as any[])
    }
  })

  const publicClient = usePublicClient()
  const { data: client } = useWalletClient()

  const approveToken = async () => {
    const toastId = toast.loading("Approving tokens")
    try {
      if(!client) return toast.error("Connect a wallet", {
        id: toastId
      })

      const balance: any = await publicClient.readContract({
        address: TEST_ERC20,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [client.account.address]
      })

      const hash = await client.writeContract({
        address: TEST_ERC20,
        abi: ERC20_ABI,
        functionName: "approve",
        gas: 10000000n,
        args: [QIRO_ADDRESS, balance]
      })
  
      toast.success("Successfully approved tokens to pool", {
        id: toastId
      })
    } catch (e) {
      toast.error("Cannot approve tokens to pool", {
        id: toastId
      })
    }
  }

  const borrowTokens = async () => {
    const toastId = toast.loading("Borrowing tokens from pool")
    try {
      if(!client) return toast.error("Connect a wallet", {
        id: toastId
      })

      const hash = await client.writeContract({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "borrow",
        gas: 10000000n,
        args: [parseUnits(borrow as `${number}`, 18), 12, "ipfs://"]
      })
  
      toast.success("Successfully borrowed tokens from pool", {
        id: toastId
      })
    } catch (e) {
      toast.error("Cannot borrow tokens from pool", {
        id: toastId
      })
    }
  }

  const repayLoans = async (id: number, time: number) => {
    await approveToken()

    const toastId = toast.loading("Repaying tokens to pool")
    try {
      if(!client) return toast.error("Connect a wallet", {
        id: toastId
      })

      const hash = await client.writeContract({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "repay",
        gas: 10000000n,
        args: [id, time]
      })
  
      toast.success("Successfully repayed tokens to pool", {
        id: toastId
      })
    } catch (e) {
      toast.error("Cannot repay tokens to pool", {
        id: toastId
      })
    }
  }

  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      <main className="space-y-10 md:space-y-0 space-x-0 md:space-x-10 w-full min-h-screen flex-col md:flex-row flex justify-center items-center">
      <div className="w-full h-full flex justify-center md:justify-end items-start">
        <div className="w-8/12 flex justify-center items-center">
          <Pool />
        </div>
      </div>
      <div className='w-full h-full flex justify-start items-center md:items-start flex-col space-y-6'>
        <div className='w-8/12 space-y-3 h-full flex justify-center items-center flex-col border p-5 rounded-md'>
          <h1 className='font-bold text-3xl text-black'>Borrow</h1>
          <input value={borrow} onChange={(e) => setBorrow(e.target.value)} type="number" className='text-black w-full p-3 border rounded-xl' placeholder='Enter borrow amount' />
          <div onClick={() => borrowTokens()} className="w-full p-3 bg-[#F1E9D2] text-black rounded-xl cursor-pointer text-center">Borrow</div>
        </div>
        <div className='w-8/12 space-y-3 h-full flex justify-center items-center flex-col border p-5 rounded-md'>
          <h1 className='font-bold text-3xl text-black mb-4'>Your Loans</h1>
          {loans.map((loan, idx) => (
            <div className='w-11/12 flex border-b p-2 justify-between items-center'>
              <div className='text-black'>
                <p className='text-sm text-gray-800'>Borrow Amount</p>
                <h1 className='text-2xl font-bold'>${formatUnits(loan.borrowAmount.toString(), 18)}</h1>
                <p className='text-sm text-gray-800'>Repaid Amount</p>
                <h1 className='text-2xl font-bold'>${formatUnits(loan.repaidAmount.toString(), 18)}</h1>
                <p className='text-sm text-gray-800'>Tenure</p>
                <h1 className='text-2xl font-bold'>{loan.timePeriod.toString()} Months</h1>
              </div>
              <div className='space-y-2'>
                <input value={times[idx]} onChange={(e) => setTimes(times => { const [...t] = times; t[idx] = Number(e.target.value); return t })} type="number" className='text-black w-full p-2 border rounded-xl' placeholder='Enter repay month' />
                <div onClick={() => repayLoans(loan, times[idx])} className="text-black w-full p-2 bg-[#F1E9D2] rounded-xl cursor-pointer text-center">Repay</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </main>
    </main>
  )
}
