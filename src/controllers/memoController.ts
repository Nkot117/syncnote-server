import { Request, Response } from "express";
import Memo from "../models/memoModel.js";

/**
 * メモ新規作成
 */
async function createMemo(req: Request, res: Response) {
  console.log("createMemo called");

  const id = req.user._id;
  const { title, content } = req.body;

  try {
    const memo = await Memo.create({ userId: id, title, content });
    console.log(memo);
    res.status(200).json({ memo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "メモの新規作成に失敗しました" });
  }
}

/**
 * メモ一覧取得
 */
async function getMemoList(req: Request, res: Response) {}

/**
 * メモ１件取得
 */
async function getMemo(req: Request, res: Response) {}

/**
 * メモ更新
 */
async function updateMemo(req: Request, res: Response) {}

/**
 * メモ削除
 */
async function deleteMemo(req: Request, res: Response) {}


export { createMemo, getMemoList, getMemo, updateMemo, deleteMemo };