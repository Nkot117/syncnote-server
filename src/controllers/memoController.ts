import { Request, Response } from "express";
import Memo from "../models/memoModel.js";

/**
 * メモ新規作成
 */
async function createMemo(req: Request, res: Response) {
  console.log("createMemo called");

  const userId = req.user._id;
  const { title, content } = req.body;

  try {
    const memo = await Memo.create({ userId, title, content });
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
async function getMemoList(req: Request, res: Response) {
  const userId = req.user._id;

  try {
    const memoList = await Memo.find({ userId });
    res.status(200).json({ memoList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "メモ一覧の取得に失敗しました" });
  }
}

/**
 * メモ１件取得
 */
async function getMemo(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const memo = await Memo.findById(id);
    res.status(200).json({ memo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "メモの取得に失敗しました" });
  }
}

/**
 * メモ更新
 */
async function updateMemo(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const memo = await Memo.findById(id);

    if (!memo) {
      res.status(404).json({ message: "メモが見つかりません" });
    }

    const updatedMemo = await Memo.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ updatedMemo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "メモの更新に失敗しました" });
  }
}

/**
 * メモ削除
 */
async function deleteMemo(req: Request, res: Response) {}

export { createMemo, getMemoList, getMemo, updateMemo, deleteMemo };
