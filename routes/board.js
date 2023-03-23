const express = require("express");
const router = express.Router();
const db = require("../public/function/db");

//토픽 게시글 리스트 최신순
router.get("/list/topic/new", (req, res) => {
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
    b.b_id as bid,
    u.u_company as company,
    u.u_nick as nick,
    b.b_title as title,
    b.b_category as category,
    LEFT(b.b_content, 50) as content,
    b.b_thumb as thumb,
    b.b_comment as comment,
    b.b_date as date
  FROM
  user u JOIN board b ON b.b_uid=u.u_id
  ORDER BY b.b_thumb DESC, b.b_date DESC LIMIT ${page * count},${count}
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
          message: "load success",
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

//토픽 게시글 리스트
router.get("/list/topic", (req, res) => {
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
    b.b_id as bid,
    u.u_company as company,
    u.u_nick as nick,
    b.b_title as title,
    b.b_category as category,
    LEFT(b.b_content, 50) as content,
    b.b_thumb as thumb,
    b.b_comment as comment,
    b.b_date as date
  FROM
  user u JOIN board b ON b.b_uid=u.u_id
  ORDER BY b.b_thumb DESC LIMIT ${page * count},${count}
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
          message: "load success",
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

//전체 게시글 리스트 최신순
router.get("/list/new", (req, res) => {
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
    b.b_id as bid,
    u.u_company as company,
    u.u_nick as nick,
    b.b_title as title,
    b.b_category as category,
    LEFT(b.b_content, 50) as content,
    b.b_thumb as thumb,
    b.b_comment as comment,
    b.b_date as date
  FROM
  board b JOIN user u ON b.b_uid=u.u_id
  ORDER BY b.b_date DESC LIMIT ${page * count},${count}
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

//전체 게시글 리스트 추천순
router.get("/list/thumb", (req, res) => {
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
    b.b_id as bid,
    u.u_company as company,
    u.u_nick as nick,
    b.b_title as title,
    b.b_category as category,
    LEFT(b.b_content, 50) as content,
    b.b_thumb as thumb,
    b.b_comment as comment,
    b.b_date as date
  FROM
  user u JOIN board b ON b.b_uid=u.u_id
  ORDER BY b.b_thumb DESC LIMIT ${page * count},${count}
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

//카테고리별 게시글 리스트 최신순 조회
router.get("/list/:category/new", (req, res) => {
  const { category } = req.params;
  let { page, count } = req.query;
  if (!count) {
    count = 10;
  }
  if (!page || page < 1) {
    page = 0;
  }
  console.log(category, page, count);
  db(
    `
  SELECT
    b.b_id as bid,
    u.u_company as company,
    u.u_nick as nick,
    b.b_title as title,
    LEFT(b.b_content, 50) as content,
    b.b_thumb as thumb,
    b.b_comment as comment,
    b.b_date as date
  FROM
  board b JOIN user u ON b.b_uid=u.u_id
  WHERE b_category = "${category}"
  ORDER BY b.b_date DESC LIMIT ${page * count},${count}
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

//카테고리별 게시글 리스트 추천순 조회

router.get("/list/:category/thumb", (req, res) => {
  const { category } = req.params;
  let { page, count } = req.query;
  if (!count) {
    count = 10;
  }
  if (!page || page < 1) {
    page = 0;
  }
  console.log(category, page, count);
  db(
    `
  SELECT
    b.b_id as bid,
    u.u_company as company,
    u.u_nick as nick,
    b.b_title as title,
    LEFT(b.b_content, 50) as content,
    b.b_thumb as thumb,
    b.b_comment as comment,
    b.b_date as date
  FROM
  board b JOIN user u ON b.b_uid=u.u_id
  WHERE b_category = "${category}"
  ORDER BY b.b_thumb DESC LIMIT ${page * count},${count}
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

//게시글 조회(상세보기)
router.get("/:bid", (req, res) => {
  const { bid } = req.params;
  db(
    `SELECT
    b.b_id as bid,
    b.b_title as title,
    u.u_nick as nick,
    u.u_company as company,
    b.b_content as content,
    b.b_date as date,
    b.b_category as category,
    b.b_uid as uid,
    b.b_thumb as thumb,
    b.b_comment as comment
    FROM
    board b JOIN user u ON b.b_uid=u.u_id
    WHERE b_id = "${bid}";`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에서 에러가 발생했습니다.",
        });
      } else if (rows.length <= 0) {
        res.status(200).json({
          status: "success",
          message: "없는 데이터입니다.",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "load",
          info: {
            rows,
          },
        });
      }
    }
  );
});

//게시글 생성
router.post("/create", (req, res) => {
  const { buid, category, title, content } = req.body;
  db(
    `INSERT INTO board (b_uid,b_category, b_title, b_content) VALUES ("${buid}","${category}","${title}","${content}");`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err!!!!!!!!!!!!!!!",
        });
      } else {
        res.status(200).json({
          status: "ok",
          message: "create board",
          bid: rows.insertId,
        });
      }
    }
  );
});

//게시글 삭제
router.delete("/delete/:buid/:bid", (req, res) => {
  const { buid, bid } = req.params;
  db(
    `DELETE FROM board WHERE b_id = "${bid}" AND b_uid = "${buid}";`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "서버에서 에러가 발생했습니다.",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "delete board",
        });
      }
    }
  );
});

//게시글 수정
router.put("/correction", (req, res) => {
  const { buid, bid, category, title, content } = req.body;
  db(
    `UPDATE board SET b_content = "${content}" , b_title = "${title}" , b_category = "${category}" WHERE b_id = "${bid}" AND b_uid = "${buid}";`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "sever err",
        });
      } else if (!buid || !bid || !category || !title || !content) {
        res.status(400).json({
          status: "fail",
          message: "빈 값을 채워주세요.",
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "correction board",
          info: {
            bid: bid,
          },
        });
      }
    }
  );
});

//북마크 추가 기능
router.get("/check/:uid/:bid", (req, res) => {
  const { uid, bid } = req.params;
  db(
    `SELECT m_id, m_uid, m_bid FROM bookmark WHERE m_uid = "${uid}" AND m_bid = "${bid}";`,
    (err, rows) => {
      if (err) {
        res.status(500).json({
          status: "fail",
          message: "server err",
        });
      } else if (rows.length) {
        db(
          `DELETE FROM bookmark WHERE m_id = "${rows[0].m_id}";`,
          (err, rows) => {
            if (err) {
              res.status(500).json({
                status: "fail",
                message: "server err",
              });
            } else {
              console.log("DELETE", rows.affectedRows);
              res.status(200).json({
                status: "ok",
                message: "unmark",
              });
            }
          }
        );
      } else {
        db(
          `INSERT INTO bookmark (m_uid, m_bid) VALUE ("${uid}", "${bid}");`,
          (err, rows) => {
            console.log("INSERT", rows.affectedRows);
            if (err) {
              res.status(500).json({
                status: "fail",
                message: "server err",
              });
            } else {
              res.status(200).json({
                status: "ok",
                message: "mark",
              });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
