const express = require("express");
const router = express.Router();
const db = require("../public/function/db");

//좋아요 기능
router.get("/check/:uid/:bid", (req, res) => {
  const { uid, bid } = req.params;
  db(
    `SELECT t_id, t_uid, t_bid FROM thumb 
    WHERE t_uid = "${uid}" AND t_bid = "${bid}"`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else if (rows.length) {
        db(`DELETE FROM thumb WHERE t_id = "${rows[0].t_id}";`, (err, rows) => {
          if (err) {
            res.status(500).json({
              status: "fail",
              message: "server err",
            });
          } else {
            db(
              `
            UPDATE board set b_thumb=b_thumb-1 WHERE b_id="${bid}"
            `,
              (err, row) => {
                if (err) {
                  res.status(500).json({
                    status: "fail",
                    message: "server err",
                  });
                } else if (rows.b_thumb < 1) {
                  rows.b_thumb = 0;
                  res.status(200).json({
                    status: "fail",
                    message: "already 0",
                  });
                }
              }
            );
            console.log("DELETE", rows.affectedRows);
            console.log(rows);
            res.status(200).json({
              status: "ok",
              message: "unthumb",
            });
          }
        });
      } else {
        db(
          `INSERT INTO thumb (t_uid, t_bid) VALUE ("${uid}", "${bid}");`,
          (err, rows) => {
            console.log("INSERT", rows.affectedRows);
            console.log(rows);
            if (err) {
              res.status(500).json({
                status: "fail",
                message: "server err",
              });
            } else {
              db(
                `
            UPDATE board set b_thumb=b_thumb+1 WHERE b_id="${bid}"
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
              res.status(200).json({
                status: "ok",
                message: "thumb",
              });
            }
          }
        );
      }
    }
  );
});

// 좋아요 합산
router.get("/count/:bid", (req, res) => {
  const { bid } = req.params;
  if (!bid) res.status(400).end();
  db(
    `
    SELECT
      COUNT(*) as count
    FROM thumb
    WHERE t_bid = ${bid};
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
