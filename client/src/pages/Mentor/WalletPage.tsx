import React, { useCallback, useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import WalletCard from "../../components/Common/wallet/WalletCard";
import WithdrawModal from "../../components/Common/wallet/WithdrawModal";
import TransactionList from "../../components/Common/wallet/TransactionList";
import TransactionFilters from "../../components/Common/wallet/TransactionFilter";
import { Pagination } from "../../components/Common/common4All/Pagination";
import { toast } from "react-toastify";
import { fetchWalletData } from "../../service/commonApi";
import { fetchHandleWithdraw } from "../../service/mentorApi";

const WalletPage: React.FC = () => {
  const [walletData, setWalletData] = useState<Iwallet>({
    _id: "",
    userId: "",
    balance: "",
    transaction: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "deposit" | "withdrawal" | "earning"
  >("all");
  const itemsPerPage = 5;

  useEffect(() => {
    let flag: boolean = true;
    const wallet_Data = async () => {
      const response = await fetchWalletData("mentor");
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

  // const filteredTransactions = transactions.filter(transaction => {
  //   const matchesSearch =
  //     transaction.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     transaction.transactionType.toLowerCase().includes(searchQuery.toLowerCase());
  //   // const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
  //   // return matchesSearch && matchesType;
  // });

  const totalPages = Math.ceil(walletData?.transaction?.length / itemsPerPage);
  const paginatedTransactions = walletData?.transaction?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
