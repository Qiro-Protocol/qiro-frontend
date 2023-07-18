import { ERC20_ABI, QIRO_ADDRESS, TEST_ERC20 } from "@/lib/config";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAccount, useContractWrite, usePrepareContractWrite, useWalletClient } from "wagmi";

export const Navbar = () => {
  const { address, isConnected } = useAccount()
  const { config, error } = usePrepareContractWrite({
    address: TEST_ERC20,
    abi: ERC20_ABI,
    functionName: "mint",
    gas: 10000000n,
    args: [address, 100000000000000000000n],
  })

  const { data: walletClient, isError: _iserror, isLoading: _isloading } = useWalletClient()

  const addTokenToPool = async () => {
    if(walletClient) {
      await walletClient.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: QIRO_ADDRESS, // The address that the token is at.
            symbol: "QP", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
          },
        }
      })

      await walletClient.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: TEST_ERC20, // The address that the token is at.
            symbol: "TESTUSDC ", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
          },
        }
      })
    }
  }

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
    <div className="w-full flex-col md:flex-row flex justify-center md:justify-between text-black items-center">
      <div className="w-full pl-0 md:pl-20 h-20 flex justify-center md:justify-start items-center">
        <Link className="text-2xl font-bold" href="/">Qiro</Link>
      </div>
      <div className="w-full h-full mb-5 md:m-0 p-0 md:pr-20 h-20 flex-col md:flex-row flex justify-center md:justify-end items-center space-y-3 md:space-y-0 space-x-0 md:space-x-4">
        <Link href="/borrow">Borrow</Link>
        <Link href="/pool">Invest</Link>
        <div onClick={() => mint()} className="cursor-pointer">Mint</div>
        <div onClick={() => addTokenToPool()} className="cursor-pointer whitespace-nowrap">Add tokens</div>
        <ConnectButton />
      </div>
    </div>
  );
};
