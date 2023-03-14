import axios from "axios";

const TW_STOCK_API_PREFIX =
  "https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=";

export type GetStockInfoResponse = {
  stockId: string;
  stockName: string;
  stockPrice: number;
  stockChange: number;
  stockChangePercent: number;
  stockTodayChange: string;
};

export const getStockInfo = async (stockId: string) => {
  const response = await axios.get(`${TW_STOCK_API_PREFIX}tse_${stockId}.tw`);
  const stockInfo = response.data.msgArray[0];
  const stockName = stockInfo.n;
  const stockPrice = stockInfo.z;
  const stockChange = stockInfo.y;
  const stockChangePercent = parseFloat(
    (((stockPrice - stockChange) / stockChange) * 100).toFixed(2)
  );
  const stockTodayChange = (stockPrice - stockChange).toFixed(2);

  return {
    stockId,
    stockName,
    stockPrice,
    stockChange,
    stockChangePercent,
    stockTodayChange,
  };
};
