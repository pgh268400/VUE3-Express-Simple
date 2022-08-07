<template>
  <div>
    <!-- v-if, else를 통한 조건부 렌더링 -->
    <!-- id가 존재할때만 렌더링한다 -->
    <div v-if="state.account.id">
      <p>안녕하세요? {{ state.account.name }}님</p>
      <button @click="logout()">로그아웃</button>
    </div>
    <div v-else>
      <label for="loginID">
        <span>ID</span>
        <!-- input box 에 데이터 바인딩 v-model -->
        <input type="text" id="loginID" v-model="state.form.loginID" />
      </label>
      <label for="loginPW">
        <span>PW</span>
        <input type="password" id="loginPW" v-model="state.form.loginPW" />
      </label>
      <hr />
      <button @click="submit()">Login</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { reactive } from "vue";

export default {
  setup() {
    const state = reactive({
      account: {
        id: null,
        name: "",
      },
      form: {
        loginID: "",
        loginPW: "",
      },
    });
    //  처음 들어올때 바로 백엔드와 통신 (vue.config.js 에서 프록시가 설정되어 있어서 앞의 URL은 작성 필요 없음)

    axios.get("/api/account").then((res) => {
      //Promise 비동기 작업 통신 성공시
      // console.log(res.data);
      // get 요청시 쿠키값도 그대로 백엔드 단으로 넘어가는듯 함.
      state.account = res.data;
    });

    const submit = () => {
      const args = {
        loginID: state.form.loginID,
        loginPW: state.form.loginPW,
      };

      // 서버에 POST 요청
      axios
        .post("/api/account", args)
        .then((res) => {
          alert("로그인에 성공했습니다.");
          // console.log(res);
          state.account = res.data;
        })
        .catch((error) => {
          alert("로그인에 실패했습니다 :(");
          console.log(error);
        });
    };

    const logout = () => {
      // HTTP 메소드 delete = 서버의 데이터를 삭제
      axios
        .delete("/api/account")
        .then(() => {
          alert("로그아웃 하였습니다");

          // 로그인 정보를 초기화 하면 Vue의 데이터 바인딩에 따라 알아서 로그인 페이지로 다시 튕겨서 이동
          state.account.id = null;
          state.account.name = "";
        })
        .catch((error) => alert("로그아웃에 실패하였습니다."));
    };

    return { state, submit, logout };
  },
};
</script>

<style></style>
