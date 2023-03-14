import * as vscode from "vscode";

import type { GetStockInfoResponse } from "./api";
import { getStockInfo } from "./api";
import {
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
            updateStatusBarItem(context);
          }
        });
    })
  );
  updateStatusBarItem(context);
}

function updateStatusBarItem(context: vscode.ExtensionContext) {
  const workspaceStateStockId: string | undefined =
    context.workspaceState.get("stockId");

  if (workspaceStateStockId) {
    getStockInfo(workspaceStateStockId).then(
      (stockInfo: GetStockInfoResponse) => {
        const {
          stockId,
          stockName,
          stockPrice,
          stockChange,
          stockChangePercent,
          stockTodayChange,
        } = stockInfo;
        statusBarItem.text = `${stockId} ${stockTodayChange} ${stockChangePercent.toFixed(
          2
        )}%`;
        statusBarItem.color =
          stockChangePercent > 0 ? TW_STOCK_COLOR_RED : TW_STOCK_COLOR_GREEN;
        statusBarItem.tooltip = `${stockId} ${stockName} ${stockPrice} ${stockChange} ${stockChangePercent}%`;
        statusBarItem.show();
      }
    );
  }
}

export function deactivate() {}
