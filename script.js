import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
        const firebaseConfig = {
          apiKey: "AIzaSyA8SJvwFGzd46g71AX2tv2luNrU5JfVr64",
          authDomain: "test2-f2e28.firebaseapp.com",
          projectId: "test2-f2e28",
          storageBucket: "test2-f2e28.appspot.com",
          messagingSenderId: "910337455675",
          appId: "1:910337455675:web:6185a8a3226da4e86a8e1e"
        };
      
        const app = firebase.initializeApp(firebaseConfig);

        const firestore = firebase.firestore();

const go_to_sign_in_btn = document.querySelector("#go-to-sign-in-btn");
const go_to_sign_up_btn = document.querySelector("#go-to-sign-up-btn");
const container = document.querySelector(".container");

const sign_up_btn = document.getElementById('sign-up-btn');
const sign_in_btn = document.getElementById('sign-in-btn');

// pindah ke halaman sign up
go_to_sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});
// pindah ke halaman sign in
go_to_sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// sign in
sign_in_btn.addEventListener("click", async ()  => {
  const sign_in_username = document.getElementById('sign-in-username').value;
  const sign_in_password = document.getElementById('sign-in-password').value;
  var account = firestore.collection('user').doc(sign_in_username);
  var accountGet = await account.get();
  // alert(accountGet.data()['password']);
  var loginSuccess = !accountGet.exists ? false : sign_in_password != accountGet.data()['password'] ? false : true
  if (!loginSuccess) {
    alert('Akun tidak ditemukan atau nama dan/atau password salah')
  } else {
    var name = accountGet.data()['name']
    var password = accountGet.data()['password']
    var currentBalance = accountGet.data()['balance']
    window.location.href = "atm.html";
  }
});

// sign up
sign_up_btn.addEventListener("click", async () => {
  const username = document.getElementById('sign-up-username').value;
  const password = document.getElementById('sign-up-password').value;
  var avail = await firestore.collection('user').doc(username).get();
            
  if (avail.exists) {
    // akun sudah ada, gagal membuat akun
    alert(`Akun dengan nama ${sign_up_username} sudah ada. Gagal membuat akun`)
  } else {
    // create new account
    await firestore.collection('user').doc(username).set({
      'noRek': `1003${Math.floor(Math.random() * 100)}`,
      'name': username,
      'password': password,
      'balance': 500000
    });
    
    alert('akun berhasil dibuat');
  }
});