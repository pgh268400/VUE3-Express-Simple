const { application } = require("express");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); //쿠키값 보안을 위해 사용하는 jwt

const app = express();
const port = 3000;

const token_key = "p070600@";

const members = [
  {
    id: 1,
    name: "파일",
    loginID: "pgh268400",
    loginPW: "p070600@",
  },
  {
    id: 2,
    name: "아빠",
    loginID: "qkrfotmd",
    loginPW: "p45302684*",
  },
];

// req.body를 사용하려면 body-parser을 이용해야 함
app.use(bodyParser.json());

// req.cookie도 마찬가지
app.use(cookieParser());

app.get("/api/account", (req, res) => {
  const token = req.cookies.token;
  if (req.cookies && token) {
    // 쿠키와 쿠키의 계정정보(토큰)가 있으면
    jwt.verify(token, token_key, (err, decoded) => {
      if (err) {
        return res.send(401);
      }
      res.send(decoded); //오류 발생하지 않을시 디코딩된 값을 넣는다
    }); //jwt 토큰이 유효한지 검증
  } else {
    res.send(401); //쿠키값이 없으면 그냥 401 (Not Found)
  }
});

app.post("/api/account", (req, res) => {
  // Post 요청값 BackEnd 처리
  // ID, PW 요청이 들어오면 members 배열에서 확인후 로그인 상태 ON/OFF 처리 (DB 없이 만든 경우임)
  const loginID = req.body.loginID;
  const loginPW = req.body.loginPW;
  console.log(`<Login Detected> id : ${loginID} pw : ${loginPW}`);

  const member = members.find(
    (element) => element.loginID === loginID && element.loginPW === loginPW
  );

  if (member) {
    // 로그인 성공시
    const options = {
      domain: "localhost",
      path: "/",
      httpOnly: true,
    };

    const token = jwt.sign(
      {
        // 객체 정보를 jwt에 담는다
        id: member.id,
        name: member.name,
      },
      //암호화된 키와 , 유효시간, 발급자 등을 정해준다
      token_key,
      { expiresIn: "30m", issuer: "pgh268400" }
    );
    res.cookie("token", token, options); //쿠키값 설정 (계정 정보를 그대로 보내면 보안상 문제가 있으니 토큰으로 던져준다)
    // 맞는 멤버 요소를 찾았으면 그 멤버 정보를 send 해준다
    res.send(member);
  } else {
    // 못찾으면 404를 던진다
    res.send(404);
  }
});

app.delete("/api/account", (req, res) => {
  const token = req.cookies.token;
  if (req.cookies && token) {
    // 쿠키와 토큰값이 있으면
    res.clearCookie("token"); //토큰 쿠키를 초기화
  }

  res.send(200); //200 = 성공
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
