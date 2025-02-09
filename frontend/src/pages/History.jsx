import React from "react";

const history = {
  _id: { $oid: "67a8235433a1ac6454d3ccf6" },
  userId: { $oid: "67a738f8bba2e098cb38eda5" },
  workflowName: "Email Summary and Spreadsheet Creation",
  status: "failed",
  startTime: { $date: "2025-02-09T03:39:00.494Z" },
  steps: [
    {
      appName: "Gmail",
      functionName: "Summarize Mail",
      status: "success",
      _id: { $oid: "67a8235433a1ac6454d3ccf7" }
    },
    {
      appName: "Google Sheets",
      functionName: "Create Spreadsheet",
      status: "failed",
      error: "Unsupported app",
      _id: { $oid: "67a8235433a1ac6454d3ccf8" }
    }
  ],
  endTime: { $date: "2025-02-09T03:39:00.503Z" },
  __v: 0
};

const History = () => {
  return (
    <div className="bg-slate-950 text-white p-2 text-center">
      <h1 className="text-4xl mt-2">History</h1>

      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800">{history.workflowName}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Status:{" "}
            <span className={`font-bold ${history.status === "success" ? "text-green-500" : "text-red-500"}`}>
              {history.status}
            </span>
          </p>
          <p className="text-sm text-gray-500">Start Time: {new Date(history.startTime.$date).toLocaleString()}</p>
          <p className="text-sm text-gray-500">End Time: {new Date(history.endTime.$date).toLocaleString()}</p>

          <h3 className="text-lg font-semibold mt-4">Steps:</h3>
          <div className="mt-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
            {history.steps.map((step) => (
              <div key={step._id.$oid} className="border-b py-2 last:border-none flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">{step.appName}</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-gray-700">{step.functionName}</span>
                </div>
                <p className={`text-sm ${step.status === "success" ? "text-green-500" : "text-red-500"}`}>
                  {step.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
