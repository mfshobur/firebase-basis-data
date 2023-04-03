// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsaf14nzxu8i_7_s4j3GZ4_qdtuNgXwV4",
  authDomain: "transaksikelompok.firebaseapp.com",
  projectId: "transaksikelompok",
  storageBucket: "transaksikelompok.appspot.com",
  messagingSenderId: "294255636619",
  appId: "1:294255636619:web:ba58ff376ef9fc75d4a48e"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

//buat akun
var loop = true;
while (loop) {
  var menu = prompt('======Selamat datang di ATM \n1. Buat akun \n2.Masuk akun \n3.Keluar');    

  if (menu == 1) {
      var name = prompt('Masukkan Nama : ');
      var password = prompt ('Masukkan password');
  
      var avail = await firestore.collection ('user').doc(name).get();
  
      if (avail.exists) {
      alert (' Akun dengan nama ${name} sudah ada. Gagal membuat akun')
      }else {
      await firestore.collection('user').doc('name').set ({
      'name' : name,
      'password' : password,
      'balance' : 500000
      })};

  } else if (menu == 2) {
      var nameInput = prompt('Masukkan nama');
      var passwordInput = prompt('Masukkan password');

      var account = firestore.collection('user').doc(nameInput);
      var accountGet = await account.get();
      var loginSuccess = !accountGet.exists ? false : passwordInput != accountGet.data()['password'] ? false : true

      if (!loginSuccess) {
          alert('Akun tidak ditemukan atau nama dan/atau password salah')
      } else {
          var name = accountGet.data()['name']
          var password = accountGet.data()['password']
          var currentBalance = accountGet.data()['balance']

          var act = prompt(`Selamat datang, ${name}\n1. Tarik tunai\n2. Transfer\n3. Setor tunai\n4. Cek saldo\n5. Keluar`)

          // tarik tunai
          if (act == 1) {
              var amount = prompt('Masukkan jumlah tarik tunai');
              var amountInt = Number(amount);
              
              await firestore.runTransaction(async(transaction) => {
                  await transaction.update(account, {
                    'balance': currentBalance - amountInt,
                  });
                }).then(() => {
                  alert('Tarik tunai berhasil');
                }).catch((error) => {
                  alert('Terjadi error. Tarik tunai gagal');
                });
          }
      }
  }
};