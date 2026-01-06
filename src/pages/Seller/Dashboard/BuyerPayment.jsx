import React, { useState, useEffect } from 'react'
import { FaDollarSign, FaCalendarAlt, FaDownload } from 'react-icons/fa'
import { IoFunnelOutline } from 'react-icons/io5'
import axios from 'axios'
import config from '../../../config'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { earningsTranslations } from './translation/earningsTranslations'

pdfMake.vfs = pdfFonts.vfs;
const MetricCard = ({ icon: Icon, title, value, subtext, iconBgColor, valueColor }) => (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
        <div className={`p-3 rounded-full ${iconBgColor}`}>
            <Icon className={`w-6 h-6 ${valueColor}`} />
        </div>
        <p className="mt-4 text-sm text-gray-500 font-medium">{title}</p>
        <div className="flex items-baseline mt-1">
            <h2 className="text-3xl font-bold">{value}</h2>
            {subtext && <p className="ml-2 text-xs text-green-500 font-semibold">{subtext}</p>}
        </div>
    </div>
)

const EarningsDashboard = () => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    // Get translations from localStorage
    const [translations, setTranslations] = useState(() => {
        const lang = localStorage.getItem("lang")
        return earningsTranslations[lang] || earningsTranslations.fr
    })

    useEffect(() => {
        const handleStorageChange = () => {
            const lang = localStorage.getItem("lang")
            setTranslations(earningsTranslations[lang] || earningsTranslations.fr)
        }
        window.addEventListener('storage', handleStorageChange)
        handleStorageChange()
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    useEffect(() => {
        const userId = localStorage.getItem("userId")
        if (!userId) return
        const fetchTransactions = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${config.baseUrl}/transaction/user/${userId}`)
                setTransactions(
                    res.data.data.map((t) => ({
                        ...t,
                        date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        transactor: 'User',
                        fee: 0,
                        feeSource: 'Stripe',
                        receipt: t.status.toLowerCase() === 'paid',
                    }))
                )
            } catch (err) {
                console.error('Error fetching transactions:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [])

    const generatePDF = (singleTransaction = null) => {
        const tableBody = [
            translations.tableHeaders
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
            transactions.forEach(t => {
                tableBody.push([
                    t.date,
                    t.transactor,
                    `$${t.amount.toFixed(2)}`,
                    `$${t.fee.toFixed(2)}`,
                    t.status,
                ]);
            });
        }

        const docDefinition = {
            content: [
                { text: 'LOREPA - Transaction Report', fontSize: 18, margin: [0, 0, 0, 10] },
                { text: `Generated on: ${new Date().toLocaleString()}`, fontSize: 12, margin: [0, 0, 0, 20] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*'],
                        body: tableBody,
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            defaultStyle: {
                fontSize: 10
            }
        };

        pdfMake.createPdf(docDefinition).download(
            singleTransaction ? `transaction_${singleTransaction.date}.pdf` : "transaction_report.pdf"
        );
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'paid':
                return 'text-green-700 bg-green-100';
            case 'refunded':
                return 'text-red-700 bg-red-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    return (
        <div>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">{translations.pageTitle}</h1>
                <button
                    onClick={() => generatePDF()}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                >
                    <FaDownload className="w-4 h-4 mr-2" />
                    {translations.downloadPDF}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard
                    icon={FaDollarSign}
                    title={translations.thisMonthRevenue}
                    value={`$${transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}`}
                    subtext={translations.subtextRevenue}
                    iconBgColor="bg-green-100"
                    valueColor="text-green-600"
                />
                <MetricCard
                    icon={FaCalendarAlt}
                    title={translations.pendingPayouts}
                    value={`$${transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}`}
                    subtext={translations.subtextPending}
                    iconBgColor="bg-yellow-100"
                    valueColor="text-yellow-600"
                />
                <MetricCard
                    icon={IoFunnelOutline}
                    title={translations.feesAndCharges}
                    value="$0"
                    subtext={translations.subtextFees}
                    iconBgColor="bg-blue-100"
                    valueColor="text-blue-600"
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{translations.tableTitle}</h2>
                </div>

                {loading ? (
                    <p className="text-gray-500 text-center py-10">{translations.loading}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 px-2 py-3 text-left text-xs font-medium text-gray-500">
                                        <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                    </th>
                                    {translations.tableHeaders.map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((t, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-2 py-4">
                                            <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{t.date}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.transactor}</td>
                                        <td className="px-6 py-4 text-sm font-semibold">${t.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs capitalize font-semibold px-3 py-1 rounded-full ${getStatusClasses(t.status)}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {t.receipt ? (
                                                <FaDownload
                                                    onClick={() => generatePDF(t)}
                                                    className="w-4 h-4 text-indigo-500 cursor-pointer hover:text-indigo-700"
                                                />
                                            ) : (
                                                <span className="text-gray-400">{translations.receiptNA}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EarningsDashboard
