import React, { useCallback, useEffect, useState } from "react";
import { IndianRupeeIcon, Frown } from "lucide-react";
import WalletCard from "../../components/Common/wallet/WalletCard";
import WithdrawModal from "../../components/Common/wallet/WithdrawModal";
import TransactionList from "../../components/Common/wallet/TransactionList";
import TransactionFilters from "../../components/Common/wallet/TransactionFilter";
import { Pagination } from "@mui/material";
import { toast } from "react-toastify";
import { fetchWalletData } from "../../service/commonApi";
import { fetchHandleWithdraw } from "../../service/mentorApi";
import { WALLET_DATA } from "../../Constants/initialStates";
import { HttpStatusCode } from "axios";
import { Messages } from "../../Constants/message";
import Spinner from "../../components/Common/common4All/Spinner";
import useDebounce from "../../Hooks/useDebounce";

const WalletPage: React.FC = () => {
  const limit = 10;
  const [walletData, setWalletData] = useState<Iwallet>(WALLET_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDoc, setTotalDoc] = useState(0);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<Ttransaction>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  useEffect(() => {
    let flag: boolean = true;
    const wallet_Data = async () => {
      setLoading((pre) => !pre);
      const response = await fetchWalletData(
        "mentor",
        debouncedSearchQuery,
        typeFilter,
        currentPage,
        limit
      );
      setLoading((pre) => !pre);
      if (
        response?.status == HttpStatusCode?.Ok &&
        response?.data?.success &&
        flag
      ) {
        setWalletData(response?.data?.walletData);
        setTotalDoc(response?.data?.totalPage);
      }
    };
    if (flag) {
      wallet_Data();
    }
    return () => {
      flag = false;
    };
  }, [currentPage, debouncedSearchQuery, typeFilter]);

  const handleWithdraw = useCallback(
    async (amount: number) => {
      if (Number(amount) < 500 || !amount) {
        toast.error(Messages?.WITHDRAW_LIMIT);
      }
      if (Number(walletData?.balance ?? 0) < amount) {
        toast.error(Messages?.NOT_ENOUGH_FUND);
        return;
      }
      const response = await fetchHandleWithdraw(amount);

      if (response?.status == HttpStatusCode?.Ok && response?.data?.result) {
        setWalletData((pre) => ({
          ...pre,
          balance: String(Number(pre.balance) - Number(amount)),
          transaction: [response?.data?.result, ...pre.transaction],
        }));
      }
    },
    [walletData?.balance]
  );
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      event.preventDefault();
      setCurrentPage(value);
    },
    []
  );
  return (
    <div className="space-y-6  mt-16  ">
      {loading && <Spinner />}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <WalletCard
          icon={IndianRupeeIcon}
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
            onTypeFilterChange={(type) => setTypeFilter(type as Ttransaction)}
          />
        </div>
        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-400" />

        {walletData?.transaction.length > 0 ? (
          <div className="overflow-x-auto">
            <TransactionList transactions={walletData?.transaction} />
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4  mb-8 flex justify-center items-center ">
            <Frown className="w-5 mr-4" /> <span>No Data Available</span>
          </div>
        )}

        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="flex justify-center mt-2">
          <Pagination
            count={typeof totalDoc === "number" ? totalDoc : 1}
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
