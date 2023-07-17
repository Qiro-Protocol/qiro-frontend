import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { toast } from "react-hot-toast";
import {
  ERC20_ABI,
  QIRO_ADDRESS,
  QIRO_POOL_ABI,
  TEST_ERC20,
} from "@/lib/config";
import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import Link from "next/link";

const Box = ({ children }: any) => {
    return (
        <div className="w-11/12 h-full flex flex-col md:flex-row justify-center items-center p-5 border rounded-xl space-y-5 md:space-y-0 space-x-0 md:space-x-5">
            {children}
        </div>
    )
}

const ComingSoon = (props: {name: string, amount: string, tenure: string, percent: string}) => {
  return (
    <Box>
      <h1 className="text-3xl">{props.name}</h1>
      <div className="w-full h-full flex justify-center items-center space-x-3">
          <div className="w-1/3 text-center py-5 h-full border rounded-xl flex flex-col justify-center items-center">
              <h1>Total Loan Amount</h1>
              <h1 className="text-xl font-bold">${props.amount}</h1>
          </div>
          <div className="w-1/3 text-center py-5  h-full border rounded-xl flex flex-col justify-center items-center">
              <h1>Loan term</h1>
              <h1 className="text-xl font-bold">{props.tenure}</h1>
          </div>
          <div className="w-1/3 text-center py-5  h-full border rounded-xl flex flex-col justify-center items-center">
              <h1>APY</h1>
              <h1 className="text-xl font-bold">{props.percent}%</h1>
          </div>
      </div>
      <Link href="/" className="w-40 py-4 text-sm rounded-xl cursor-pointer text-center bg-[#ff8802]">Coming Soon...</Link>
  </Box>
  )
}

const Deposit = () => {
  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");
  const [balance, setBalance] = useState(0);
  const [poolBalance, setPoolBalance] = useState(0);

  const { data: client } = useWalletClient();
  const { address, isConnected } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: TEST_ERC20,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
    onSuccess: (data) => {
      setBalance(Number(data));
    },
  });

  const _ = useContractRead({
    address: TEST_ERC20,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [QIRO_ADDRESS],
    onSuccess: (data) => {
      setPoolBalance(Number(data));
    },
  });

  const publicClient = usePublicClient();

  useEffect(
    () => console.log(isError, balance, isLoading),
    [isError, balance, isLoading]
  );

  const approveToken = async () => {
    const toastId = toast.loading("Approving tokens");
    try {
      if (!client)
        return toast.error("Connect a wallet", {
          id: toastId,
        });

      const hash = await client.writeContract({
        address: TEST_ERC20,
        abi: ERC20_ABI,
        functionName: "approve",
        gas: 10000000n,
        args: [QIRO_ADDRESS, parseUnits(deposit as `${number}`, 18)],
      });

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      toast.success("Successfully deposited tokens in pool", {
        id: toastId,
      });
    } catch (e) {
      toast.error("Cannot deposit tokens in pool", {
        id: toastId,
      });
    }
  };

  const depositTokens = async () => {
    await approveToken();

    const toastId = toast.loading("Depositing tokens in pool");
    try {
      if (!client)
        return toast.error("Connect a wallet", {
          id: toastId,
        });

      const hash = await client.writeContract({
        address: QIRO_ADDRESS,
        abi: QIRO_POOL_ABI,
        functionName: "deposit",
        gas: 10000000n,
        args: [parseUnits(deposit as `${number}`, 18), client.account.address],
      });

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      toast.success("Successfully deposited tokens in pool", {
        id: toastId,
      });
    } catch (e) {
      toast.error("Cannot deposit tokens in pool", {
        id: toastId,
      });
    }
  };

  const withdrawTokens = async () => {
    const toastId = toast.loading("Withdrawing tokens in pool");

    try {
      if (!client)
        return toast.error("Connect a wallet", {
          id: toastId,
        });

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
      });

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      toast.success("Successfully withdrawn tokens in pool", {
        id: toastId,
      });
    } catch (e) {
      toast.error("Cannot withdraw tokens in pool", {
        id: toastId,
      });
    }
  };

  const [principal, setPrincipal] = useState("0")
    const [interest, setInterest] = useState("0")
    
    const ___ = useContractRead({
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

      const { config, error } = usePrepareContractWrite({
        address: TEST_ERC20,
        abi: ERC20_ABI,
        functionName: "mint",
        gas: 10000000n,
        args: [address, 100000000000000000000n],
      })
    
      const { write, isLoading: _isLoading, isSuccess, isError: _isError } = useContractWrite(config)
    
      const mint = () => {
        if(!error && isConnected) {
          write?.()
        }
      }
    
      const [toastId, setToastId] = useState<string>()
    
      useEffect(() => {
        if(_isLoading) {
          setToastId(toast.loading("Minting 100 test tokens"))
        }
      }, [_isLoading])
    
      useEffect(() => {
        console.log(isSuccess, toastId, _isError)
        if(isSuccess && toastId) {
          toast.success("Successfully minted 100 test tokens", {
            id: toastId
          })
        }
    
        if(_isError && toastId) {
          toast.error("Cannot mint 100 test tokens", {
            id: toastId
          })
        }
      }, [isSuccess, _isError])
    

  return (
    <main className="w-full text-black min-h-screen bg-white">
      <div className="w-full flex-col md:flex-row flex justify-center md:justify-between text-black items-center">
        <div className="w-full pl-0 md:pl-20 h-20 flex justify-center md:justify-start items-center">
          <Link className="text-2xl font-bold" href="/">Qiro</Link>
        </div>
        <div className="w-full h-full mb-5 md:m-0 p-0 md:pr-20 h-20 flex-col md:flex-row flex justify-center md:justify-end items-center space-y-3 md:space-y-0 space-x-0 md:space-x-4">
          <div onClick={() => mint()} className="cursor-pointer">Mint</div>
          <ConnectButton />
        </div>
      </div>
      <main className="space-y-10 w-full min-h-screen flex-col flex items-center justify-start bg-white">
        <Box>
            <div className="w-1/3 text-center py-5 h-full border rounded-xl flex flex-col justify-center items-center">
                <h1>Total Active Loans</h1>
                <h1 className="text-xl font-bold">${principal}</h1>
            </div>
            <div className="w-1/3 text-center py-5  h-full border rounded-xl flex flex-col justify-center items-center">
                <h1>Interest Earned</h1>
                <h1 className="text-xl font-bold">${interest}</h1>
            </div>
            <div className="w-1/3 text-center py-5  h-full border rounded-xl flex flex-col justify-center items-center">
                <h1>Default rate</h1>
                <h1 className="text-xl font-bold">0%</h1>
            </div>
        </Box>
        <Box>
            <h1 className="text-3xl">Rikvin Capital: Real estate bridge loans</h1>
            <div className="w-full h-full flex justify-center items-center space-x-3">
                <div className="w-1/3 text-center py-5 h-full border rounded-xl flex flex-col justify-center items-center">
                    <h1>Total Loan Amount</h1>
                    <h1 className="text-xl font-bold">${principal}</h1>
                </div>
                <div className="w-1/3 text-center py-5  h-full border rounded-xl flex flex-col justify-center items-center">
                    <h1>Loan term</h1>
                    <h1 className="text-xl font-bold">12 Months</h1>
                </div>
                <div className="w-1/3 text-center py-5  h-full border rounded-xl flex flex-col justify-center items-center">
                    <h1>APY</h1>
                    <h1 className="text-xl font-bold">12%</h1>
                </div>
            </div>
            <Link href="/pool" className="w-40 py-4 text-sm rounded-xl cursor-pointer text-center bg-[#ff8802]">Enter Pool</Link>
        </Box>
        <ComingSoon name="Unimoni: Gold backed loans in India" amount="50,000,000" tenure="1.5 years" percent="12.5" />
        <ComingSoon name="DigiAsia: Fintech Lending in Indonesia" amount="10,000,000" tenure="6 months" percent="10.5" />
      </main>
    </main>
  );
};

export default Deposit;
