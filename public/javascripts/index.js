const xhr = new XMLHttpRequest();

//인증메일 발송
document.getElementById("sign_send").addEventListener("click", () => {
  if (
    document.getElementById("sign_email").value &&
    document.getElementById("sign_email").disabled === false
  ) {
    const data = {
      email: document.getElementById("sign_email").value,
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 201) {
          console.log(xhr.responseText);
        } else {
          console.log(err);
        }
      }
    };
    xhr.open("POST", "http://localhost:3000/users/auth_mail");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
  } else {
    console.log("null");
  }
});

//인증받기

document.getElementById("sign_check").addEventListener("click", () => {
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.status === "success") {
      } else {
      }
    }
  };
  xhr.onerror = () => {
    console.log(err);
  };

  xhr.open(
    "GET",
    `http://localhost:3000/users/auth_check?email=${
      document.getElementById("sign_email").value
    }&digit=${document.getElementById("sign_value").value}`
  );
  xhr.send();
});

//가입

document.getElementById("sign").addEventListener("click", () => {
  if (
    !!document.getElementById("sign_email").value &&
    !!document.getElementById("sign_pwd").value &&
    !!document.getElementById("sign_company").value &&
    !!document.getElementById("sign_nick").value
  ) {
    const data = {
      email: document.getElementById("sign_email").value,
      pwd: document.getElementById("sign_pwd").value,
      nick: document.getElementById("sign_nick").value,
      company: document.getElementById("sign_company").value,
    };
    xhr.onload = () => {
      //성공
      if (xhr.status === 201) {
        const response = JSON.parse(xhr.responseText);
        if (response.status === "success") {
        } else {
          console.log(err);
        }
      } else if (xhr.status === 200) {
        //email 중복시
        console.log("already have email");
      }
    };
    xhr.onerror = () => {
      console.log(err);
    };

    xhr.open("POST", "http://localhost:3000/users/signup");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
  }
});
