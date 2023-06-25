export const Pool = () => {
    return (
        <div className="w-full h-full bg-[#F1E9D2] text-black rounded-xl flex flex-col justify-center items-center">
            <div className="w-full p-4 flex justify-between items-end">
                <div>
                    <p className="text-gray-600 text-sm">Qiro</p>
                    <h1 className="font-bold text-2xl">Qiro Senior Pool</h1>
                </div>
                <p>Etherscan</p>
            </div>

            <div className="w-full px-4 pb-4">
                <p>The Senior Pool is a pool of capital that is diversified across all Borrower Pools on the Goldfinch protocol. Liquidity Providers (LPs) who provide capital into the Senior Pool are capital providers in search of passive, diversified exposure across all Borrower Pools. This capital is protected by junior (first-loss) capital in each Borrower Pool.</p>
            </div>

            <div className="w-full flex justify-between items-center p-4">
                <div>
                    <p className="text-gray-600 text-sm">USDC APY</p>
                    <h1 className="font-bold text-2xl">12%</h1>
                </div>
                <div className="flex justify-end items-end flex-col">
                    <p className="text-gray-600 text-sm">Variable GFI APY</p>
                    <h1 className="font-bold text-2xl">0.1%</h1>
                </div>
            </div>

            <div className="w-full p-4 flex flex-col justify-center items-center">
                <div className="w-full flex justify-between items-center">
                    <p>
                        Loan Term
                    </p>
                    <p>Open Ended</p>
                </div>
                <div className="w-full border border-black my-2"></div>
                <div className="w-full flex justify-between items-center">
                    <p>
                        Liquidity
                    </p>
                    <p>Withdrawal Request</p>
                </div>
            </div>
        </div>
    )
}