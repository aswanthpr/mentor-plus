import React, { useCallback, useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import WalletCard from "../../components/Common/wallet/WalletCard";
import WithdrawModal from "../../components/Common/wallet/WithdrawModal";
import TransactionList from "../../components/Common/wallet/TransactionList";
import TransactionFilters from "../../components/Common/wallet/TransactionFilter";
import { Pagination } from "@mui/material";
import { toast } from "react-toastify";
import { fetchWalletData } from "../../service/commonApi";
import { fetchHandleWithdraw } from "../../service/mentorApi";

const WalletPage: React.FC = () => {
  const limit = 10;
  const [walletData, setWalletData] = useState<Iwallet>({
    _id: "",
    userId: "",
    balance: "",
    transaction: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDoc, setTotalDoc] = useState(0);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "deposit" | "withdrawal" | "earning"
  >("all");


  useEffect(() => {
    let flag: boolean = true;
    const wallet_Data = async () => {
      const response = await fetchWalletData("mentor",
        searchQuery,
        typeFilter,
        currentPage,
        limit,
      );
      if (response?.status == 200 && response?.data?.success && flag) {
        setWalletData(response?.data?.walletData);
        setTotalDoc(response?.data?.totalPage)
      }
    };
    if (flag) {
      wallet_Data();
    }
    return () => {
      flag = false;
    };
  }, [currentPage, searchQuery, typeFilter]);

  const handleWithdraw = useCallback(async (amount: number) => {
    if (Number(amount) < 500 || !amount) {
      toast.error("amount cannot be less than $500");
    }
    const response = await fetchHandleWithdraw(amount);

    if (response?.status == 200 && response?.data?.result) {
      console.log(response);
      setWalletData((pre) => ({
        ...pre,
        balance: String(Number(pre.balance) - Number(amount)),
        transaction: [response?.data?.result, ...pre.transaction],
      }));
    }
  }, []);
    const handlePageChange = useCallback(
      (event: React.ChangeEvent<unknown>, value: number) => {
        event.preventDefault();
        setCurrentPage(value);
      },
      []
    );
  return (
    <div className="space-y-6  mt-16  ">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <WalletCard
          icon={DollarSign}
          title="Balance"
          amount={parseInt(String(walletData?.balance))}
          actionButton={{
            label: "Withdraw",
            onClick: () => setShowWithdraw(true),
          }}
        />
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
          <h2 className="text-xl font-bold">Transaction History</h2>
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onTypeFilterChange={(type) => setTypeFilter(type as any)}
          />
        </div>

        <div className="overflow-x-auto">
          <TransactionList transactions={walletData?.transaction} />
        </div>

       <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700" />
              <div className="flex justify-center mt-2">
                <Pagination
                  count={totalDoc}
                  page={currentPage} // Current page
                  onChange={handlePageChange} // Page change handler
                  color="standard" // Pagination color
                  shape="circular" // Rounded corners
                  size="small" // Size of pagination
                  siblingCount={1} // Number of sibling pages shown next to the current page
                  boundaryCount={1} // Number of boundary pages to show at the start and end
                />
              </div>
      </div>
      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        onSubmit={handleWithdraw}
        maxAmount={Number(walletData?.balance)}
      />
    </div>
  );
};

export default WalletPage;
