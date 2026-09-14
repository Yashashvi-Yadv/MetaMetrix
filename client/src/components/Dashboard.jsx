import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";
axios.defaults.withCredentials = true;

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Send, UploadCloud, Loader2, MessageSquare } from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
];

const Dashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [charts, setCharts] = useState(null); // Array of charts ke liye state
  const [rawParsedData, setRawParsedData] = useState(null);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about your uploaded data." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // --- UPLOAD HANDLER ---
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await axios.post(
        `https://metametrix.onrender.com/api/upload/analyze`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      // Yahan ab data.charts aayega backend se
      const { data, rawParsedData } = response.data;
      setAnalytics(data.analytics);
      setCharts(data.charts); // Array set kar rahe hain
      setRawParsedData(rawParsedData);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to analyze data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CHAT HANDLER ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await axios.post(
        `https://metametrix.onrender.com/api/upload/chat`,
        {
          question: userMessage,
          dataContext: rawParsedData,
        },
        { withCredentials: true },
      );

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't process that. Try again!" },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- MULTIPLE CHARTS RENDERER ---
  const renderCharts = () => {
    if (!charts || charts.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {charts.map((chart, index) => {
          // AI ke data ko Recharts format me map karna
          const formattedData = chart.labels.map((label, idx) => ({
            name: label,
            value: chart.values[idx] || 0,
          }));

          return (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-80 flex flex-col"
            >
              <h3 className="text-md font-bold text-slate-700 text-center mb-4">
                {chart.title}
              </h3>
              <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chart.chartType === "bar" ? (
                    <BarChart data={formattedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill={COLORS[index % COLORS.length]}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  ) : chart.chartType === "line" ? (
                    <LineChart data={formattedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={3}
                      />
                    </LineChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={formattedData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={{ fontSize: 12 }}
                      >
                        {formattedData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-grow bg-slate-50 p-6 md:p-12 min-h-screen">
      <div className="max-w-[90rem] mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-slate-500 mb-8">
          Here is your AI-Powered Data Workspace.
        </p>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">
              Analyzing your data magically...
            </p>
          </div>
        )}

        {!isLoading && !analytics && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-16 text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              Upload your CSV/Excel/JSON
            </h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Drop your file here or click to browse. Meta Metrix will instantly
              process and generate your analytics dashboard.
            </p>
            <label className="cursor-pointer inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              <input
                type="file"
                accept=".csv, .xlsx, .xls, .json"
                className="hidden"
                onChange={handleFileUpload}
              />
              Browse Files
            </label>
          </div>
        )}

        {!isLoading && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT COLUMN: Analytics & Charts (Takes up 3 columns) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-3 border-b pb-2">
                  AI Data Insights
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {analytics}
                </p>
              </div>

              {/* Yahan saare charts render honge Grid format me */}
              <div className="bg-slate-50 rounded-2xl">
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  Visual Representations
                </h2>
                {renderCharts()}
              </div>
            </div>

            {/* RIGHT COLUMN: Chatbot (Takes up 1 column) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[700px]">
              <div className="flex items-center gap-2 border-b pb-3 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">
                  Data Assistant
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 rounded-xl max-w-[85%] text-sm ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-slate-100 text-slate-800 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-800 p-3 rounded-xl rounded-tl-none text-sm flex gap-2 items-center">
                      <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="mt-4 flex gap-2 pt-2 border-t"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
