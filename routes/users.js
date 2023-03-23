const express = require("express");
const router = express.Router();
const db = require("../public/function/db");
const { sendMail, randomNumber } = require("../public/function/mail");
const { encrypt } = require("../public/function/encrtpt");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//로그인 기능
router.post("/login", (req, res) => {
  const { email, pwd } = req.body;
  const encryptPwd = encrypt(pwd);

  db(
    `SELECT 
    u_id,
    u_email,
    u_pwd,
    u_nick,
    u_company
    FROM user WHERE u_email = "${email}"`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else if (rows.length > 0) {
        if (rows[0].u_pwd === encryptPwd) {
          res.status(200).json({
            status: "success",
            message: "login success",
            info: {
              uid: rows[0].u_id,
              email: rows[0].u_email,
              nick: rows[0].u_nick,
              company: rows[0].u_company,
            },
          });
        } else {
          res.status(200).json({
            status: "fail",
            message: "no pwd",
          });
        }
      } else {
        res.status(200).json({
          status: "fail",
          message: "no mail",
        });
      }
    }
  );
});

//비가입자 인증메일 발송
router.post("/auth_mail", (req, res) => {
  const { email } = req.body;
  const rnd = randomNumber();
  db(`SELECT u_email FROM user WHERE u_email = "${email}"`, (err, rows) => {
    if (err) {
      res.status(500).json({
        status: "fail",
        message: "server err",
      });
    } else if (rows.length > 0) {
      res.status(200).json({
        status: "fail",
        message: "already have email",
        info: {
          email: rows[0].u_email,
          aid: rows.insertId,
        },
      });
    } else {
      db(
        `INSERT INTO auth (a_email, a_digit) VALUES ("${email}", "${rnd}");`,
        (err, rows) => {
          if (err || rows.affectedRows < 1) {
            res.status(500).json({
              status: "fail",
              message: "서버에서 에러가 발생 했습니다.",
            });
          } else {
            sendMail(email, rnd, (err1) => {
              if (err1) {
                res.status(500).json({
                  status: "fail",
                  message: "서버에서 에러가 발생 하였습니다.",
                });
              } else {
                res.status(201).json({
                  status: "success",
                  message: "a_digit saved.",
                  info: {
                    email: email,
                    a_num: rnd,
                  },
                });
              }
            });
          }
        }
      );
    }
  });
});

//인증번호 일치여부
router.get("/auth_check/", (req, res) => {
  const { email, digit } = req.query;
  db(
    `SELECT a_id, a_digit FROM auth WHERE a_email = "${email}" AND a_used = 0 ORDER BY a_id DESC LIMIT 1`,
    (err, rows) => {
      if (err || rows.length < 1) {
        res.status(500).json({ status: "fail", message: "server error" });
      } else if (digit.toString() === rows[0].a_digit.toString()) {
        db(
          `UPDATE auth SET a_used = 1 WHERE a_id = ${rows[0].a_id}`,
          (err1, rows1) => {
            if (err1 || rows1.affectedRows < 1) {
              res.status(500).json({
                status: "fail",
                message: "error",
              });
            } else {
              res.status(200).json({
                status: "success",
                message: "check complete.",
              });
            }
          }
        );
      } else {
        res.status(200).json({ status: "fail", message: "match fail" });
      }
    }
  );
});

// 가입 email 중복 체크후 DB에 가입정보 저장
router.post("/signup", (req, res) => {
  const { email, pwd, nick, company } = req.body;
  const encryptPwd = encrypt(pwd);
  db(
    `SELECT u_id, u_email FROM user WHERE u_email = "${email}"`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else if (rows.length > 0) {
        res.status(200).json({
          status: "fail",
          message: "already have email",
          info: rows,
        });
      } else {
        db(
          `INSERT INTO user (u_email, u_pwd, u_nick,u_company) VALUES ("${email}","${encryptPwd}","${nick}","${company}");`,
          (err, row) => {
            if (err) {
              res.status(500).json({
                status: "fail",
                message: "server err",
              });
            } else {
              res.status(200).json({
                status: "success",
                message: "sign complete",
                info: {
                  uid: row.insertId,
                  email: email,
                  pwd: pwd,
                  nick: nick,
                  company: company,
                },
              });
            }
          }
        );
      }
    }
  );
});

//가입자 인증메일보내기
router.post("/auth_mail_user", (req, res) => {
  const { email } = req.body;
  const rnd = randomNumber();
  db(`SELECT u_email FROM user WHERE u_email = "${email}"`, (err, rows) => {
    if (err) {
      res.status(500).json({
        status: "fail",
        message: "",
      });
    } else if (rows.length > 0) {
      db(
        `INSERT INTO auth (a_email, a_digit) VALUES ("${email}", "${rnd}");`,
        (err, rows) => {
          if (err || rows.affectedRows < 1) {
            res.status(500).json({
              status: "fail",
              message: "err",
            });
          } else {
            sendMail(email, rnd, (err1) => {
              if (err1) {
                res.status(500).json({
                  status: "fail",
                  message: "err",
                });
              } else {
                res.status(201).json({
                  status: "success",
                  message: "a_digit saved.",
                  info: {
                    email: email,
                    a_num: rnd,
                  },
                });
              }
            });
          }
        }
      );
    }
  });
});

//비로그인시 비밀번호 변경
router.put("/change_pwd", (req, res) => {
  const { email, pwd } = req.body;
  const encryptPwd = encrypt(pwd);
  db(
    `UPDATE user SET u_pwd = "${encryptPwd}" WHERE u_email = "${email}"`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "err",
        });
      } else if (rows.affectedRows > 0) {
        res.status(200).json({
          status: "succes",
          message: "pwd change",
        });
      }
    }
  );
});

//회원정보 조회(마이페이지)
router.get("/user_info/:uid", (req, res) => {
  const { uid } = req.params;
  db(
    `
  SELECT u_email, u_nick, u_company FROM user WHERE u_id="${uid}"`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "err",
        });
      } else {
        // res.send(rows);
        res.status(200).json({
          status: "succes",
          message: "load user info",
          info: {
            email: rows[0].u_email,
            nick: rows[0].u_nick,
            company: rows[0].u_company,
          },
        });
      }
    }
  );

  //   db(
  //     `
  // SELECT u_email as email, u_nick as nick, u_company as company FROM user WHERE u_id="${uid}"`,
  //     (err, rows) => {
  //       if (err) {
  //         res.status(500).json({
  //           status: "fail",
  //           message: "err",
  //         });
  //       } else {
  //         // res.send(rows);
  //         res.status(200).json({
  //           status: "succes",
  //           message: "load user info",
  //           info: rows[0],
  //         });
  //       }
  //     }
  //   );
});

// 닉네임 변경
router.put("/change_nick", (req, res) => {
  const { uid, nick } = req.body;
  db(
    `UPDATE user SET u_nick = "${nick}" WHERE u_id = "${uid}"`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "err",
        });
      } else if (rows.affectedRows > 0) {
        res.status(200).json({
          status: "succes",
          message: "nick change",
        });
      }
    }
  );
});

// 회사 변경 (필요x)
router.put("/change_company", (req, res) => {
  const { uid, company } = req.body;
  db(
    `UPDATE user SET u_company = "${company}" WHERE u_id = "${uid}"`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "err",
        });
      } else if (rows.affectedRows > 0) {
        res.status(200).json({
          status: "succes",
          message: "company change",
          info: {
            nick: rows[0].u_company,
          },
        });
      }
    }
  );
});

// 내정보에서 비밀번호 변경
router.put("/my_change_pwd", (req, res) => {
  const { uid, pwd } = req.body;
  const encryptPwd = encrypt(pwd);
  db(
    `UPDATE user SET u_pwd = "${encryptPwd}" WHERE u_id = "${uid}"`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "err",
        });
      } else if (rows.affectedRows > 0) {
        res.status(201).json({
          status: "succes",
          message: "change",
        });
      }
    }
  );
});

//북마크 불러오기(리스트 띄우기)
router.get("/markget/:uid", (req, res) => {
  const { uid } = req.params;
  let { page, count } = req.query;
  if (!count) {
    count = 10;
  }
  if (!page || page < 1) {
    page = 0;
  }
  db(
    `
  SELECT
    m.m_id as mid,
    b.b_title as title,
    b.b_category as category,
    LEFT(b.b_content, 50) as content,
    b.b_date as date,
    u.u_nick as nick,
    u.u_company as company
  FROM
  bookmark m JOIN board b ON m.m_bid=b.b_id
  JOIN user u ON b.b_uid = u.u_id
  WHERE m_uid = "${uid}"
  ORDER BY m.m_date DESC LIMIT ${page * count},${count}
    `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          state: "fail",
          message: "err",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "load comment",
          info: {
            page: page,
            count: count,
            result: rows,
          },
        });
      }
    }
  );
});

//내 작성글 갯수
router.get("/board/:uid", (req, res) => {
  const { uid } = req.params;
  if (!uid) res.status(400).end();
  db(
    `
    SELECT
      COUNT(*) as board_count
    FROM board
    WHERE b_uid = ${uid};
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에서 에러가 발생 하였습니다.",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "success",
          info: rows,
        });
      }
    }
  );
});

//내가 누른 좋아요 갯수
router.get("/thumb/:uid", (req, res) => {
  const { uid } = req.params;
  if (!uid) res.status(400).end();
  db(
    `
    SELECT
      COUNT(*) as thumb_count
    FROM thumb
    WHERE t_uid = ${uid};
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에서 에러가 발생 하였습니다.",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "success",
          info: rows,
        });
      }
    }
  );
});

//내 댓글 갯수
router.get("/comment/:uid", (req, res) => {
  const { uid } = req.params;
  if (!uid) res.status(400).end();
  db(
    `
    SELECT
      COUNT(*) as comment_count
    FROM comment
    WHERE c_uid = ${uid};
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
          info: rows,
        });
      }
    }
  );
});

// 회원탈퇴
router.delete("/delete", (req, res) => {
  const { uid } = req.body;
  db(
    `
  DELETE
  FROM user
  WHERE u_id="${uid}"
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "err",
        });
      } else if (rows) {
        res.status(200).json({
          status: "succes",
          message: "delete user",
        });
      }
    }
  );
});

//
router.delete("/delete/test", (req, res) => {
  const { uid } = req.body;
  db(
    `
  ON DELETE CASCADE
  FROM
  user u
  WHERE u_id="${uid}"
  `,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "err",
        });
      } else if (rows) {
        res.status(200).json({
          status: "succes",
          message: "delete user",
        });
      }
    }
  );
});

module.exports = router;
