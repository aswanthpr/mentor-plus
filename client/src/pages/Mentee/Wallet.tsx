import React, { useCallback, useEffect, useState } from "react";
import { Wallet } from "lucide-react";

import WalletCard from "../../components/Common/wallet/WalletCard";
import AddMoneyModal from "../../components/Common/wallet/AddMoneyModal";
import TransactionList from "../../components/Common/wallet/TransactionList";
import TransactionFilters from "../../components/Common/wallet/TransactionFilter";
import { Pagination } from "../../components/Common/common4All/Pagination";
import { fetchAddMoney, fetchWalletData } from "../../service/api";

const WalletPage: React.FC = () => {
  const itemsPerPage = 8;
  const [walletData, setWalletData] = useState<Iwallet>({
    _id: "",
    userId: "",
    balance: "",
    transaction: [],
  });
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "deposit" | "withdrawal" | "earning"
  >("all");

  useEffect(() => {
    let flag: boolean = true;
    const wallet_Data = async () => {
      const response = await fetchWalletData("mentee");
      if (response?.status == 200 && response?.data?.success && flag) {
        setWalletData(response?.data?.walletData);
      }
    };

    if (flag) {
      wallet_Data();
    }

    return () => {
      flag = false;
    };
  }, []);

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

  // const filteredTransactions = walletData?.transactions.filter((transaction) => {
  //   const matchesSearch =
  //     transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     transaction.notes.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesType = typeFilter === "all" || transaction.type === typeFilter;
  //   return matchesSearch && matchesType;
  // });

  const totalPages = Math.ceil(walletData?.transaction?.length / itemsPerPage);
  const paginatedTransactions = walletData?.transaction?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-5  mt-10">
      <div className="grid grid-cols-1  gap-6  ">
        <div className="w-full  ">
          <WalletCard
            icon={Wallet}
            title="Wallet Balance"
            amount={Number(walletData?.balance) as number}
            actionButton={{
              label: "Add Money",
              onClick: () => setShowAddMoney(true),
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
          <TransactionList transactions={paginatedTransactions} />
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
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
