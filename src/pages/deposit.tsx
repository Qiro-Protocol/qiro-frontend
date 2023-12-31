import { Pool } from "@/components/pool";
import { Navbar } from "../components/navbar";
import {
  useAccount,
  useContractRead,
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

const Deposit = () => {
  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");
  const [balance, setBalance] = useState(0);
  const [poolBalance, setPoolBalance] = useState(0);

  const { data: client } = useWalletClient();
  const { address } = useAccount();

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
    address: QIRO_ADDRESS,
    abi: QIRO_POOL_ABI,
    functionName: "lpPool",
    args: [],
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

  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      <main className="w-full min-h-screen flex justify-center items-center bg-white">
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-1/2 flex justify-center items-center">
            <Pool />
          </div>
        </div>
        <div className="w-full h-full flex justify-center items-center flex-col space-y-6">
          <div className="w-1/2 p-4">
            <h1>Total Assets</h1>
            <p className="text-2xl font-bold">
              TUSDC {formatUnits(BigInt(poolBalance), 18)}
            </p>
          </div>
          <div className="w-1/2 space-y-3 h-full flex justify-center items-center flex-col border p-5 rounded-md">
            <h1 className="font-bold text-3xl">Deposit</h1>
            <input
              value={deposit}
              onChange={(val) => setDeposit(val.target.value)}
              type="number"
              min={0}
              className="text-black w-full p-3 border rounded-xl"
              placeholder="Enter deposit amount"
            />
            <div
              onClick={() => depositTokens()}
              className="w-full p-3 bg-gray-500 rounded-xl cursor-pointer text-center"
            >
              Deposit
            </div>
          </div>
          <div className="w-1/2 space-y-3 h-full flex justify-center items-center flex-col border p-5 rounded-md">
            <h1 className="font-bold text-3xl">Withdraw</h1>
            <input
              value={withdraw}
              onChange={(val) => setWithdraw(val.target.value)}
              type="number"
              min={0}
              className="text-black w-full p-3 border rounded-xl"
              placeholder="Enter withdraw amount"
            />
            <div
              onClick={() => withdrawTokens()}
              className="w-full p-3 bg-gray-500 rounded-xl cursor-pointer text-center"
            >
              Withdraw
            </div>
          </div>
        </div>
      </main>
    </main>
  );
};

export default Deposit;
