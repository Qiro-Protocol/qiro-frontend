import { ERC20_ABI, TEST_ERC20 } from "@/lib/config";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

export const Navbar = () => {
  const { address, isConnected } = useAccount()
  const { config, error } = usePrepareContractWrite({
    address: TEST_ERC20,
    abi: ERC20_ABI,
    functionName: "mint",
    args: [address, 100000000000000000000n]
  })

  const { write, isLoading, isSuccess, isError } = useContractWrite(config)

  const mint = () => {
    if(!error && isConnected) {
      write?.()
    }
  }

  const [toastId, setToastId] = useState<string>()

  useEffect(() => {
    if(isLoading) {
      setToastId(toast.loading("Minting 100 test tokens"))
    }
  }, [isLoading])

  useEffect(() => {
    console.log(isSuccess, toastId, isError)
    if(isSuccess && toastId) {
      toast.success("Successfully minted 100 test tokens", {
        id: toastId
      })
    }

    if(isError && toastId) {
      toast.error("Cannot mint 100 test tokens", {
        id: toastId
      })
    }
  }, [isSuccess, isError])

  return (
    <div className="w-full flex justify-between items-center">
      <div className="w-full pl-20 h-20 flex justify-start items-center">
        <h1 className="text-2xl font-bold">Qiro</h1>
      </div>
      <div className="w-full pr-20 h-20 flex justify-end items-center space-x-4">
        <Link href="/borrow">Borrow / Repay</Link>
        <Link href="/">Deposit / Withdraw</Link>
        <div onClick={() => mint()} className="cursor-pointer">Mint</div>
        <ConnectButton />
      </div>
    </div>
  );
};
