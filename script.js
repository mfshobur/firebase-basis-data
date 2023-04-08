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

// UNTUK FILE INDEX.HTML
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

document.getElementById('sign-in-form').addEventListener("submit", async (e) => {
  e.preventDefault();
  const sign_in_username = document.getElementById('sign-in-username').value;
  const sign_in_password = document.getElementById('sign-in-password').value;
  var userData = firestore.collection('user').doc(sign_in_username);
  var userDataGet = await userData.get();
  // alert(accountGet.data()['password']);
  var loginSuccess = !userDataGet.exists ? false : sign_in_password != userDataGet.data()['password'] ? false : true
  if (!loginSuccess) {
    alert('Akun tidak ditemukan atau nama dan/atau password salah')
  } else {
    // var accountGet = await account.get();
    var account = firestore.collection('account').doc(userDataGet.data()['accNumber']);
    var accountGet = await account.get();
    var name = accountGet.data()['name'];
    var accNum = accountGet.data()['accNumber'];
    var currentBalance = accountGet.data()['balance'];
    
    window.location.href = "atm.html?name="+btoa(name)+"&currentBalance="+btoa(currentBalance)+"&accNum="+btoa(accNum);
    // const name_display = document.getElementById('name-display');
    // name_display.innerText = name;
    // const balance_display = document.getElementById('balance-display');
    // balance_display.innerText = currentBalance;
  }
});

// sign up
document.getElementById('sign-up-form').addEventListener("submit", async (e) => {
  e.preventDefault();
  var username = document.getElementById('sign-up-username').value;
  var password = document.getElementById('sign-up-password').value;
  var avail = await firestore.collection('user').doc(username).get();
            
  if (avail.exists) {
    // akun sudah ada, gagal membuat akun
    alert(`Akun dengan nama ${username} sudah ada. Gagal membuat akun`)
  } else {
    // nomor rekening user
    var newAccNum = Math.floor(Math.random() * 100);
    var accNumber = `1003${newAccNum}`;
    // membuat data baru di database akun
    await firestore.collection('account').doc(accNumber).set({
      'accNumber': accNumber,
      'name': username,
      'balance': 500000,
    });

    // membuat data baru di database user
    await firestore.collection('user').doc(username).set({
      'name': username,
      'password': password,
      'accNumber': accNumber,
    });

    
    alert(`Akun berhasil dibuat. Silakan sign in dengan akun yang telah dibuat\nNama: ${username}\nNomor Rekening: ${accNumber}`);
    username = '';
    password = '';
  }
});