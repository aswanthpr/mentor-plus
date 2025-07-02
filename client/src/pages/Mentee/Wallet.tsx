import React, { useCallback, useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { Frown, Wallet } from "lucide-react";
import WalletCard from "../../components/Common/wallet/WalletCard";
import AddMoneyModal from "../../components/Common/wallet/AddMoneyModal";
import TransactionList from "../../components/Common/wallet/TransactionList";
import TransactionFilters from "../../components/Common/wallet/TransactionFilter";
import { fetchWalletData } from "../../service/commonApi";
import { fetchAddMoney } from "../../service/menteeApi";
import { WALLET_DATA } from "../../Constants/initialStates";
import { HttpStatusCode } from "axios";
import Spinner from "../../components/Common/common4All/Spinner";
import useDebounce from "../../Hooks/useDebounce";

const WalletPage: React.FC = () => {
  const limit = 10;
  const [walletData, setWalletData] = useState<Iwallet>(WALLET_DATA);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDoc, setTotalDoc] = useState(0);
  const [typeFilter, setTypeFilter] = useState<Ttransaction>("all");
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  useEffect(() => {
    let flag: boolean = true;
    const wallet_Data = async () => {
      setLoading((pre)=>!pre)
      const response = await fetchWalletData(
        "mentee",
        debouncedSearchQuery,
        typeFilter,
        currentPage,
        limit
      );
      if (response?.status == HttpStatusCode?.Ok && response?.data?.success && flag) {
        setWalletData(response?.data?.walletData);
        setTotalDoc(response?.data?.totalPage);
      }
      setLoading((pre)=>!pre)
    };

    if (flag) {
      wallet_Data();
    }

    return () => {
      flag = false;
    };
  }, [currentPage, debouncedSearchQuery, typeFilter]);

  const handleAddMoney = useCallback(async (amount: number) => {
   
    const response = await fetchAddMoney(amount);
    if (response?.status ==HttpStatusCode?.Ok && response?.data?.success) {
      if (response?.data.session?.url) {
        window.location.href = response?.data.session?.url;
      }
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
    <div className="space-y-5  mt-10">
        {loading && <Spinner />}
      <div className="grid grid-cols-1  gap-6  ">
        <div className="w-full  ">
          <WalletCard
            icon={Wallet}
            title="Wallet Balance"
            amount={Number(walletData?.balance)}
            actionButton={{
              label: "Add Money",
              onClick: () => setShowAddMoney(true),
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm h-[86vh]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
          <h2 className="text-xl font-bold">Transaction History</h2>
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={(type) =>
              setTypeFilter(type as "all" | "debit" | "credit" | "paid")
            }
          />
        </div>
        {walletData?.transaction.length > 0 ? (
          <div className="overflow-x-auto">
            <TransactionList transactions={walletData?.transaction} />
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4  mb-8 flex justify-center items-center ">
            <Frown className="w-10 mr-4" /> <span>No Data Available</span>
          </div>
        )}
        <hr className="h-px  bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="flex justify-center mt-2">
          <Pagination
            count={totalDoc}
            page={currentPage}
            onChange={handlePageChange}
            color="standard"
            shape="circular"
            size="small"
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      </div>

      <AddMoneyModal
        isOpen={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        onSubmit={handleAddMoney}
      />
    </div>
  );
};

export default WalletPage;
