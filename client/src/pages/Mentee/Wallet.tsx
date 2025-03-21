import React, { useCallback, useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import WalletCard from "../../components/Common/wallet/WalletCard";
import AddMoneyModal from "../../components/Common/wallet/AddMoneyModal";
import TransactionList from "../../components/Common/wallet/TransactionList";
import TransactionFilters from "../../components/Common/wallet/TransactionFilter";
import { fetchWalletData } from "../../service/commonApi";
import { fetchAddMoney } from "../../service/menteeApi";
import { Pagination } from "@mui/material";


const WalletPage: React.FC = () => {
  const limit = 10;
  const [walletData, setWalletData] = useState<Iwallet>({
    _id: "",
    userId: "",
    balance: "",
    transaction: [],
  });
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDoc, setTotalDoc] = useState(0);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "debit" | "credit" | "paid"
  >("all");

  useEffect(() => {
    let flag: boolean = true;
    const wallet_Data = async () => {
      const response = await fetchWalletData(
        "mentee",
        searchQuery,
        typeFilter,
        currentPage,
        limit
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
console.log(totalDoc,'lkasdf')
  const handleAddMoney = useCallback(async (amount: number) => {
    const response = await fetchAddMoney(amount);
    if (response?.status && response?.data?.success) {
      if (response?.data.session?.url) {
        window.location.href = response?.data.session?.url;
      }
      //set socket io here
      // setTransactions([newTransaction, ...transactions]);
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

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
          <h2 className="text-xl font-bold">Transaction History</h2>
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
           
            onTypeFilterChange={(type) => setTypeFilter(type as "all" | "debit" | "credit" | "paid")}
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
      <AddMoneyModal
        isOpen={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        onSubmit={handleAddMoney}
      />
    </div>
  );
};

export default WalletPage;
