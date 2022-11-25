const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const db = global.db;

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // max 30 requests
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return req.clientIp;
  },
  message: {
    code: 429,
    message:
      "Too many requests, you have been rate limited. Please try again later",
  },
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 200, // max 200 requests
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return req.clientIp;
  },
  message: {
    code: 429,
    message:
      "Too many requests, you have been rate limited. Please try again later",
  },
});

router.get("/", limiter, (req, res) => {
  res.status(200);
});

router.get("/redirect/:urlID", limiter, (req, res) => {
  const urlID = req.params.urlID;
  const data = db.fetch(`urls.${urlID}`);
  if (data === null) return res.json({ code: 404, messag: "Not found" });
  res.redirect(data.url);
  db.add(`urls.${urlID}.stats.clicks`, 1);
});

router.get('/info/:urlID', limiter, (req, res) => {
  const urlID = req.params.urlID
  const data = db.fetch(`urls.${urlID}`)
  if(data === null) return res.json({ code: 404, message: 'Not found' })
  res.json({
    code: 200,
    message: 'Success',
    data: data ?? []
  })
})

router.get("/mylinks", (req, res) => {
  const user = req.user;
  if (!user) return res.json({ code: 401, message: "Unauthorized" });
  try {
    const a = db.fetch("urls");
    if (a == null)
      return res.json({
        code: 404,
        message: "No links found for this user",
        data: [],
      });
    const data = Object.values(a).filter((x) => x.ownerId === user.id);
    if (data == "")
      return res.json({
        code: 404,
        message: "No links found for this user",
        data: [],
      });
    res.json({
      code: 200,
      message: "Success",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.json({ code: 500, message: "Internal server error" });
  }
});

router.post("/short", apiLimiter, (req, res) => {
  const user = req.user;
  if (!user) return res.json({ code: 401, message: "Unauthorized" });
  try {
    const url = req.body.url;
    const type = req.body.type;
    if (url.length <= 0)
      return res.json({ code: 411, message: "Length required" });
    const allUrls = db.fetch("urls");
    if (type === "random") {
      var a =
        allUrls == null
          ? false
          : Object.values(allUrls)
              .filter((a) => a.ownerId === user.id)
              .find((b) => b.url === url);
      if (a)
        return res.json({
          code: 999,
          message: "This url aleady added to system!",
        });
      var newID;
      newID = makeid(20);
      var b =
        allUrls === null
          ? false
          : Object.values(allUrls).find((a) => a.id === newID);
      if (b) return (newID = makeid(20));
      var Data = {
        id: newID,
        ownerId: user.id,
        url: url,
        type: 0,
        added: Date.now(),
        stats: {
          clicks: 0,
        },
      };
      db.set(`urls.${newID}`, Data);
      res.json({ code: 200, message: "Success" });
    } else if (type === "custom") {
      var a =
        allUrls === null
          ? false
          : Object.values(allUrls)
              .filter((a) => a.ownerId === user.id)
              .find((b) => b.url === url);
      if (a)
        return res.json({
          code: 999,
          message: "This url aleady added to system!",
        });
      var b =
        allUrls === null
          ? false
          : Object.values(allUrls).find((a) => a.id === req.body.customId);
      if (b) return res.json({ code: 999, message: "This id already in use" });
      var cid = req.body.customId.replaceAll(/[\W_]+/g, "");
      var Data = {
        id: cid,
        ownerId: user.id,
        url: url,
        type: 1,
        added: Date.now(),
        stats: {
          clicks: 0,
        },
      };
      db.set(`urls.${cid}`, Data);
      res.json({ code: 200, message: "Success" });
    } else {
      res.json({ code: 500, message: "Interval server error" });
    }
  } catch (err) {
    console.log(err);
    console.log(db.fetch("urls"));
    res.json({ code: 500, message: "Interval server error" });
  }
});

router.post("/delete/:urlID", apiLimiter, (req, res) => {
  const user = req.user;
  const urlID = req.params.urlID;
  if (!user) return res.json({ code: 401, message: "Unauthorized" });
  const data = db.fetch(`urls.${urlID}`);
  if (data == null) return res.json({ code: 404, message: "Not found" });
  if ((data.ownerId === user.id) == false)
    return res.json({
      code: 401,
      message: "You don't have permission to delete this url",
    });
  db.delete(`urls.${urlID}`);
  var Data = {
    ownerId: user.id,
    url: data.url,
    id: data.id,
    added: data.added,
    deleted: Date.now(),
  };
  db.push(`deletedUrls`, Data);
});

// random string generator

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
