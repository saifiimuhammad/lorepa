import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaCalendarAlt,
  FaRedo,
  FaDownload,
} from "react-icons/fa";
import { IoFunnelOutline, IoShareOutline } from "react-icons/io5";
import config from "../../../config";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { userPaymentTranslations } from "./translation/userPaymentTranslations";

pdfMake.vfs = pdfFonts.vfs;

// --- Helper Classes ---
const getStatusClasses = (status) => {
  switch (status) {
    case "paid":
      return "text-green-700 bg-green-100";
    case "Refunded":
      return "text-red-700 bg-red-100";
    default:
      return "text-gray-700 bg-gray-100";
  }
};

const getAmountClasses = (amount) => {
  return amount < 0
    ? "text-red-500 font-semibold"
    : "text-green-600 font-semibold";
};

// --- Main Component ---
const UserPayment = () => {
  const [transactions, setTransactions] = useState([]);
  const [t, setT] = useState(() => {
    const lang = localStorage.getItem("lang") || "fr";
    return userPaymentTranslations[lang] || userPaymentTranslations.fr;
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${config.baseUrl}/transaction/user/${userId}`
        );
        setTransactions(
          res.data.data.map((t) => ({
            id: t._id || t.id,
            date: new Date(t.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            name: t.trailerName || "N/A",
            amount: t.amount,
            status: t.status,
            transactor: "User",
            fee: t.fee || 0,
            feeSource: t.feeSource || "Stripe",
            receipt: t.status.toLowerCase() === "paid",
          }))
        );
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();

    // Handle language change dynamically
    const handleLangChange = () => {
      const lang = localStorage.getItem("lang") || "fr";
      setT(userPaymentTranslations[lang] || userPaymentTranslations.fr);
    };

    window.addEventListener("storage", handleLangChange);
    handleLangChange();

    return () => window.removeEventListener("storage", handleLangChange);
  }, []);

  const generatePDF = (singleTransaction = null) => {
    const tableBody = [
      [t.date, t.transactor, t.amount, "Fee", t.status], // translated table headers
    ];

    if (singleTransaction) {
      tableBody.push([
        singleTransaction.date,
        singleTransaction.transactor,
        `$${singleTransaction.amount.toFixed(2)}`,
        `$${singleTransaction.fee.toFixed(2)}`,
        singleTransaction.status,
      ]);
    } else {
      transactions.forEach((tn) => {
        tableBody.push([
          tn.date,
          tn.transactor,
          `$${tn.amount.toFixed(2)}`,
          `$${tn.fee.toFixed(2)}`,
          tn.status,
        ]);
      });
    }

    const docDefinition = {
      content: [
        {
          text: "LOREPA - Transaction Report",
          fontSize: 18,
          margin: [0, 0, 0, 10],
        },
        {
          text: `Generated on: ${new Date().toLocaleString()}`,
          fontSize: 12,
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"],
            body: tableBody,
          },
          layout: "lightHorizontalLines",
        },
      ],
      defaultStyle: { fontSize: 10 },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        singleTransaction
          ? `transaction_${singleTransaction.date}.pdf`
          : "transaction_report.pdf"
      );
  };

  return (
    <div className="">
      {/* Header and Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {t.paymentsReceipts}
        </h1>
        <div className="flex flex-col gap-y-2 sm:flex-row space-x-3">
          <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-150 shadow-sm">
            <IoFunnelOutline className="w-4 h-4" />
            <span>{t.filterByDate}</span>
          </button>
          <button
            onClick={() => generatePDF()}
            className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-150 shadow-sm"
          >
            <IoShareOutline className="w-4 h-4" />
            <span>{t.exportAll}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 h-[170px] rounded-xl shadow-md border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaDollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-[#9DA0A6] ml-auto">
              +5.2% MoM
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700 mb-4">
            {t.totalSpent}
          </span>
          <p className="text-4xl font-extrabold text-gray-900 leading-none">
            $
            {transactions
              .reduce((sum, t) => sum + (t.amount < 0 ? 0 : t.amount), 0)
              .toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-5 h-[170px] rounded-xl shadow-md border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaCalendarAlt className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-green-600 ml-auto">
              +5.2% MoM
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700 mb-4">
            {t.thisMonth}
          </span>
          <p className="text-4xl font-extrabold text-gray-900 leading-none">
            $
            {transactions
              .filter(
                (tr) => new Date(tr.date).getMonth() === new Date().getMonth()
              )
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-5 h-[170px] rounded-xl shadow-md border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaRedo className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-[#9DA0A6] ml-auto">
              +5.2% MoM
            </span>
          </div>
          <span className="text-sm font-medium text-[#EA4335] mb-4">
            {t.refunds}
          </span>
          <p className="text-4xl font-extrabold text-[#EA4335] leading-none">
            $
            {transactions
              .filter((t) => t.status.toLowerCase() === "refunded")
              .reduce((sum, t) => sum + Math.abs(t.amount), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {t.transactionHistory}
          </h2>
          <p className="text-sm text-gray-500">{t.transactionDesc}</p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-6 text-xs sm:text-sm font-medium text-gray-500 uppercase px-5 py-3 border-b border-gray-200">
              <div className="col-span-1 flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>{t.date}</span>
              </div>
              <span className="col-span-2">{t.trailerName}</span>
              <span className="col-span-1">{t.amount}</span>
              <span className="col-span-1">{t.status}</span>
              <span className="col-span-1">{t.receipt}</span>
            </div>

            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="grid grid-cols-6 text-sm text-gray-900 items-center px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition duration-100"
              >
                <div className="col-span-1 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium">{transaction.date}</span>
                </div>
                <span className="col-span-2">{transaction.name}</span>
                <span
                  className={`col-span-1 ${getAmountClasses(
                    transaction.amount
                  )}`}
                >
                  {transaction.amount < 0
                    ? `-$${Math.abs(transaction.amount).toFixed(2)}`
                    : `$${transaction.amount.toFixed(2)}`}
                </span>
                <div className="col-span-1">
                  <span
                    className={`text-xs capitalize font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <div className="col-span-1">
                  {transaction.receipt && (
                    <button
                      className="text-blue-600 hover:text-blue-800 p-1"
                      onClick={() => generatePDF(transaction)}
                    >
                      <FaDownload className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPayment;
