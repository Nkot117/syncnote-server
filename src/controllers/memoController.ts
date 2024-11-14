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
    const result = await Memo.create({ userId, title, content });
    const response = {
      id: result._id.toString(), 
      title: result.title, 
      content: result.content, 
     };
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "メモの新規作成に失敗しました" });
  }
}

/**
 * メモ一覧取得
 */
async function getMemoList(req: Request, res: Response) {
  console.log("getMemoList called");
  const userId = req.user._id;

  try {
    const result = await Memo.find({ userId });
    const memoList = result.map((memo) => {
      return { 
        id: memo._id.toString(),
        title: memo.title, 
        content: memo.content, 
      };
    });

    const response = {
      memoList,
    }

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "メモ一覧の取得に失敗しました" });
  }
}

/**
 * メモ１件取得
 */
async function getMemo(req: Request, res: Response) {
  console.log("getMemo called");
  const id = req.params.id;
  const userId = req.user._id;

  try {
    const result = await Memo.findById(id);

    if (!result) {
      return res.status(404).json({ message: "メモが見つかりません" });
    }

    const response = {
      id: result._id.toString(),
      title: result.title,
      content: result.content,
    }
    
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "メモの取得に失敗しました" });
  }
}

/**
 * メモ更新
 */
async function updateMemo(req: Request, res: Response) {
  console.log("updateMemo called");
  const id = req.params.id;

  try {
    const memo = await Memo.findById(id);

    if (!memo) {
      return res.status(404).json({ message: "メモが見つかりません" });
    }

    const result = await Memo.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    const response = {
      id: result?._id.toString(),
      title: result?.title,
      content: result?.content,
    }

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "メモの更新に失敗しました" });
  }
}

/**
 * メモ削除
 */
async function deleteMemo(req: Request, res: Response) {
  console.log("deleteMemo called");
  const id = req.params.id;

  try {
    const memo = await Memo.findById(id);

    if (!memo) {
      return res.status(404).json({ message: "メモが見つかりません" });
    }

    await Memo.findByIdAndDelete(id);

    return res.status(200).json({ message: "メモを削除しました" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "メモの削除に失敗しました" });
  }
}

export { createMemo, getMemoList, getMemo, updateMemo, deleteMemo };
