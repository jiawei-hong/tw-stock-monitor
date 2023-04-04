import * as vscode from "vscode";

import { getStockInfo } from "./api";
import {
  TW_STCK_DEFAULT_REFETCH_INTERVAL,
  TW_STOCK_COLOR_GREEN,
  TW_STOCK_COLOR_RED,
  TW_STOCK_MONITOR_INPUT,
} from "./constants";

const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
);

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(TW_STOCK_MONITOR_INPUT, async () => {
      vscode.window
        .showInputBox({ placeHolder: "query stock information" })
        .then((value) => {
          if (value) {
            context.workspaceState.update("stockId", value);
            updateStatusBarItem();
          }
        });
    })
  );

  updateStatusBarItem();
  setInterval(() => {
    updateStatusBarItem();
  }, TW_STCK_DEFAULT_REFETCH_INTERVAL);
}

const choiceColor = (stockChangePercent: number) => {
  if (stockChangePercent === 0) {
    return "#FFF";
  }
  return stockChangePercent > 0 ? TW_STOCK_COLOR_RED : TW_STOCK_COLOR_GREEN;
};

function updateStatusBarItem() {
  const config = vscode.workspace.getConfiguration("tw-stock-monitor");
  const stockId: string = config.get("input") || "2330";

  getStockInfo(stockId).then((stockInfo) => {
    const { stockName, stockPrice, stockChangePercent, stockTodayChange } =
      stockInfo;

    statusBarItem.text = `${stockName} ${stockPrice} ${stockTodayChange} (${stockChangePercent}%)`;
    statusBarItem.color = choiceColor(stockChangePercent);
    statusBarItem.show();
  });
}

export function deactivate() {}
