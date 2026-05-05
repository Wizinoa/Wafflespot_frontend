import React from "react";
import type { Bill } from "../../types";
import { format } from "date-fns";

interface BillCardProps {
    bill: Bill;
    onPrint?: (bill: Bill) => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onPrint }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-sm text-gray-500">Bill #</p>
                    <p className="text-lg font-bold text-gray-900">{bill.billNumber}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-sm font-medium">
                        {format(new Date(bill.createdAt), "dd MMM yyyy, hh:mm a")}
                    </p>
                </div>
            </div>

            <div className="border-t border-gray-100 my-3"></div>

            <div className="space-y-2">
                {bill.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span>
                            {item.productName} x {item.quantity}
                        </span>
                        <span className="font-medium">₹{item.total}</span>
                    </div>
                ))}
                {bill.items.length > 3 && (
                    <p className="text-xs text-gray-500">
                        +{bill.items.length - 3} more items
                    </p>
                )}
            </div>

            <div className="border-t border-gray-100 my-3"></div>

            <div className="flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-bold text-indigo-600">₹{bill.total}</p>
                </div>
                {onPrint && (
                    <button
                        onClick={() => onPrint(bill)}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Print Bill
                    </button>
                )}
            </div>
        </div>
    );
};

export default BillCard;