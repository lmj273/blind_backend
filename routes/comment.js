const express = require("express");
const router = express.Router();
const db = require("../public/function/db");

//특정 게시글 댓글 조회
router.get("/get/:bid", (req, res) => {
  const { bid } = req.params;
  let { page, count } = req.query;
  if (!count) {
    count = 10;
  }
  if (!page || page < 1) {
    page = 0;
  }
  console.log(bid, page, count);
  db(
    `
  SELECT
    c.c_id as cid,
    u.u_company as company,
    u.u_nick as nick,
    c.c_content as content,
    c.c_date as date
  FROM
  comment c JOIN user u ON c.c_uid=u.u_id
  WHERE c_bid = "${bid}"
  ORDER BY c.c_date DESC LIMIT ${page * count},${count}
    `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          state: "fail",
          message: "err",
        });
      } else {
        db(
          `SELECT COUNT(*) as comment_count FROM comment WHERE c_bid="${bid}"`,
          (err, rows1) => {
            if (err) {
              res.status(500).json({
                state: "fail",
                message: "err",
              });
            } else {
              res.status(200).json({
                status: "success",
                message: "load comment",
                page: page,
                count: count,
                comment_count: rows1[0].comment_count,
                info: {
                  rows,
                },
              });
            }
          }
        );
      }
    }
  );
});

//댓글 작성
router.post("/write", (req, res) => {
  const { bid, uid, content } = req.body;
  if (!uid) {
    res.status(400).json({
      status: "fail",
      message: "need check login",
    });
  } else if (!content) {
    res.status(400).json({
      status: "fail",
      message: "no content",
    });
  } else if (!bid) {
    res.status(400).json({
      status: "fail",
      message: "need check bid",
    });
  }
  db(
    `
  INSERT INTO comment (c_bid, c_uid, c_content) VALUES ("${bid}","${uid}","${content}")
  `,
    (err, rows) => {
      if (err || rows.affectedRows < 1) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else {
        db(
          `
            UPDATE board set b_comment=b_comment+1 WHERE b_id="${bid}"
            `,
          (err, row) => {
            if (err) {
              res.status(500).json({
                status: "fail",
                message: "server err",
              });
            }
          }
        );
        res.status(201).json({
          status: "ok",
          message: "create comment, count +1",
          cid: rows.insertId,
        });
      }
    }
  );
});

//댓글 수정
router.put("/fix/:cid", (req, res) => {
  const { cid } = req.params;
  const { uid, content } = req.body;
  if (!cid || !uid || !content) {
    res.status(400).end();
  }
  //본인 확인
  db(
    `SELECT
      c_uid
    FROM comment
    WHERE c_id = "${cid}"
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else {
        if (rows[0].c_uid === Number(uid)) {
          db(
            `
          UPDATE comment SET c_content = "${content}" WHERE c_id = "${cid}"
          `,
            (err1) => {
              if (err1) {
                res.status(500).json({
                  status: "fail",
                  message: "server err",
                });
              } else {
                res.status(200).json({
                  status: "success",
                  message: "change success",
                  cid: cid,
                });
              }
            }
          );
        } else if (rows[0].c_uid !== Number(uid)) {
          res.status(200).json({
            status: "fail",
            message: "존재하지 않거나 일치하지 않습니다.",
          });
        }
      }
    }
  );
});

//댓글 삭제
router.delete("/delete/:cid/:uid", (req, res) => {
  const { cid, uid } = req.params;
  if (!cid || !uid) {
    res.status(400).end();
  }
  db(
    `SELECT
      c_bid,
      c_uid
    FROM
    comment
    WHERE c_id = "${cid}"
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else if (rows.length > 0) {
        if (rows[0].c_uid === Number(uid)) {
          db(
            `
          DELETE FROM comment WHERE c_id = "${cid}"
          `,
            (err1) => {
              if (err1) {
                res.status(500).json({
                  status: "fail",
                  message: "server err",
                });
              } else {
                db(
                  `
            UPDATE
            comment c JOIN board b ON c.c_bid=b.b_id
            set b.b_comment=b.b_comment-1 
            WHERE
            b.b_id
            `,
                  (err, row) => {
                    if (err) {
                      res.status(500).json({
                        status: "fail",
                        message: "server err",
                      });
                    } else if (rows.b_comment < 1) {
                      rows.b_comment = 0;
                      res.status(200).json({
                        status: "fail",
                        message: "already 0",
                      });
                    }
                    res.status(200).json({
                      status: "success",
                      message: "delete success",
                    });
                  }
                );
              }
            }
          );
        } else if (rows[0].c_uid !== Number(uid)) {
          res.status(200).json({
            status: "fail",
            message: "존재하지 않거나 일치하는게 없습니다.",
          });
        }
      } else {
        res.status(200).json({
          status: "fail",
          message: "존재하지 않거나 일치하는게 없습니다.",
        });
      }
    }
  );
});

//특정 게시글 댓글 갯수
router.get("/count/:bid", (req, res) => {
  const { bid } = req.params;
  if (!bid) res.status(400).end();
  db(
    `
    SELECT
      COUNT(*) as count
    FROM comment
    WHERE c_bid = ${bid};
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에서 에러가 발생 하였습니다.",
        });
      } else {
        // res.send(rows);
        res.status(200).json({
          status: "success",
          message: "success",
          info: {
            count: rows,
          },
        });
      }
    }
  );
});

module.exports = router;
