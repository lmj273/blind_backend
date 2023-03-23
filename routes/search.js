const express = require("express");
const router = express.Router();
const db = require("../public/function/db");

//제목, 내용 검색
router.get("/:search", (req, res) => {
  const { search } = req.params;
  let { page, count } = req.query;
  if (!count) {
    count = 10;
  }
  if (!page || page < 1) {
    page = 0;
  }

  db(
    `SELECT 
    b.b_id as bid,
    u.u_company as company,
    u.u_nick as nick,
    b.b_title as title,
    b.b_category as category,
    b.b_content as content,
    b.b_thumb as thumb,
    b.b_comment as comment,
    b.b_date as date
    FROM
    board b JOIN user u ON b.b_uid=u.u_id
    WHERE b_content like "%${search}%" ORDER BY b_date DESC LIMIT ${
      page * count
    },${count};`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "search",
          info: {
            rows,
          },
        });
      }
    }
  );
});

router.get("/dbview/user", (req, res) => {
  db(
    `SELECT 
  u_id as uid,
  u_email as email,
  u_nick as nick,
  u_company as company
  FROM
user ORDER BY u_date DESC LIMIT 0,10
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에러",
        });
      } else {
        res.status(200).json({
          status: "succes",
          message: "user 테이블 최근 10개",
          rows,
        });
      }
    }
  );
});

router.get("/dbview/board", (req, res) => {
  db(
    `SELECT 
  b_id as bid,
  b_uid as uid
  b_title as title,
  b_content as content,
  b_category as category,
  b_thumb as thumb,
  b_comment as comment
  FROM
board ORDER BY b_date DESC LIMIT 0,10
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에러",
        });
      } else {
        res.status(200).json({
          status: "succes",
          message: "board 테이블 최근 10개",
          rows,
        });
      }
    }
  );
});

router.get("/dbview/comment", (req, res) => {
  db(
    `SELECT 
  c_id as cid,
  c_uid as uid,
  c_bid as bid,
  c_content as content
  FROM
comment ORDER BY c_date DESC LIMIT 0,10
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에러",
        });
      } else {
        res.status(200).json({
          status: "succes",
          message: "commnet 테이블 최근 10개",
          rows,
        });
      }
    }
  );
});

router.get("/dbview/bookmark", (req, res) => {
  db(
    `SELECT 
  m_id as mid,
  m_uid as uid,
  m_bid as bid
  FROM
bookmark ORDER BY m_date DESC LIMIT 0,10
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에러",
        });
      } else {
        res.status(200).json({
          status: "succes",
          message: "bookmark 테이블 최근 10개",
          rows,
        });
      }
    }
  );
});

router.get("/dbview/thumb", (req, res) => {
  db(
    `SELECT 
  t_id as tid,
  t_uid as uid,
  t_bid as bid
  FROM
thumb ORDER BY t_id DESC LIMIT 0,10
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에러",
        });
      } else {
        res.status(200).json({
          status: "succes",
          message: "thumb 테이블 최근 10개",
          rows,
        });
      }
    }
  );
});

router.get("/dbview/auth", (req, res) => {
  db(
    `SELECT 
  a_id as aid,
  a_email as email,
  a_digit as digit,
  a_used as used
  FROM
auth ORDER BY a_date DESC LIMIT 0,10
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에러",
        });
      } else {
        res.status(200).json({
          status: "succes",
          message: "auth 테이블 최근 10개",
          rows,
        });
      }
    }
  );
});

module.exports = router;
