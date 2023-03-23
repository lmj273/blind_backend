const express = require("express");
const router = express.Router();
const db = require("../public/function/db");

//topic 게시판 10개 조회
router.get("/topic", (req, res) => {
  db(
    `SELECT 
    b_id as bid,
    b_category as category,
    b_title as title,
    b_thumb as thumb,
    b_comment as comment FROM board
  ORDER BY b_thumb DESC LIMIT 10`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "load topic board",
          info: rows,
        });
      }
    }
  );
});

//메인페이지에서 카테고리별 게시판 5개 조회
router.get("/:category", (req, res) => {
  const { category } = req.params;
  db(
    `SELECT
    b_id as bid,
    b_title as title,
    b_category as category,
    b_thumb as thumb,
    b_comment as comment
    FROM board
  WHERE b_category="${category}"ORDER BY b_thumb DESC LIMIT 5`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "load category board",
          info: rows,
        });
      }
    }
  );
});

module.exports = router;
