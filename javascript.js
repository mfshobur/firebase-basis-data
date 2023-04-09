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

// get parameter value
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = atob(urlParams.get('name'));
var currentBalance = atob(urlParams.get('currentBalance'));
const accNum = atob(urlParams.get('accNum'));

const name_display = document.getElementById('name-display');
const balance_display = document.getElementById('balance-display');
// change text value
name_display.innerHTML = username;
balance_display.innerHTML = "IDR "+currentBalance;
var account = firestore.collection('account').doc(accNum);

// withdraw
document.getElementById('withdraw-form').addEventListener("submit", async (e) => {
	e.preventDefault();
	var amount = document.getElementById('withdraw-amount-input').value;
	var amountInt = Number(amount);
	var  currentBalanceInt = Number(currentBalance);
	// check if current balance is enough to withdraw
	if (amountInt < currentBalanceInt) {
		await firestore.runTransaction(async(transaction) => {
			await transaction.update(account, {
				'balance': currentBalance - amountInt,
			});
		}).then(() => {
			currentBalance = currentBalanceInt - amountInt;
			balance_display.innerHTML = 'IDR ' + (currentBalanceInt - amountInt);
			amount = '';
			alert('Tarik tunai berhasil\nSisa saldo: ' + (currentBalanceInt - amountInt));
		}).catch((error) => {
			alert('Terjadi error. Tarik tunai gagal.\n'+error);
		});
	}
	// if current balance is not enough
	else {
		alert('Jumlah uang tidak cukup')
	}
});

// transfer
document.getElementById('transfer-form').addEventListener("submit", async (e) => {
	e.preventDefault();
	var amount = document.getElementById('transfer-amount-input').value;
	var accountNumber = document.getElementById('transfer-account-input').value;
	
	var amountInt = Number(amount);
	var currentBalanceInt = Number(currentBalance);

	// check if current balance is enough to withdraw
	if (amountInt < currentBalanceInt) {
		// check if destination account exist or not
		var destAccount = firestore.collection('account').doc(accountNumber);
		var destAccountGet = await destAccount.get();
		if (!destAccountGet.exists) {
			alert(`Akun dengan nomor rekening ${accountNumber} tidak ditemukan.`);
		}
		// account found
		else {
			var destAccountNumber = destAccountGet.data()['balance'];
			// transfer transaction
			await firestore.runTransaction(async(transaction) => {
				await transaction.update(destAccount, {
					'balance': destAccountNumber + amountInt,
				});
				console.log('isi di akun penerima berhasil');
				await transaction.update(account, {
					'balance': currentBalanceInt - amountInt,
				});
				console.log('mengurangi di akun pengirim berhasil');
			}).then(() => {
				balance_display.innerHTML = 'IDR ' + (currentBalanceInt - amountInt);
				currentBalance = currentBalanceInt - amountInt;
				alert(`Transfer berhasil\nPenerima: ${destAccountGet.data()['name']}\nJumlah: ${amountInt}`);
				amount = '';
				accountNumber = '';
			}).catch((error) => {
				alert('Terjadi error. Transfer gagal');
			});
		}
	}
	// if not enough
	else {
		alert('Saldo Anda tidak cukup');
	}
});

// deposit
document.getElementById('deposit-form').addEventListener("submit", async (e) => {
	e.preventDefault();
	var amount = document.getElementById('deposit-amount-input').value
	var amountInt = Number(amount);
	var currentBalanceInt = Number(currentBalance);
	await firestore.runTransaction(async(transaction) => {
		await transaction.update(account, {
			'balance': currentBalanceInt + amountInt,
		});
	}).then(() => {
		balance_display.innerHTML = 'IDR ' + (currentBalanceInt + amountInt);
		currentBalance = currentBalanceInt + amountInt;
		amount = '';
		alert('Setor tunai berhasil\nJumlah saldo: ' + (currentBalanceInt + amountInt));
	}).catch((error) => {
		alert('Terjadi error. Setor tunai gagal');
	});
});

// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item=> {
	const a = item.parentElement.querySelector('a:first-child');
	a.addEventListener('click', function (e) {
		e.preventDefault();

		if(!this.classList.contains('active')) {
			allDropdown.forEach(i=> {
				const aLink = i.parentElement.querySelector('a:first-child');

				aLink.classList.remove('active');
				i.classList.remove('show');
			})
		}

		this.classList.toggle('active');
		item.classList.toggle('show');
	})
})



// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector('nav .toggle-sidebar');
const allSideDivider = document.querySelectorAll('#sidebar .divider');

if(sidebar.classList.contains('hide')) {
	allSideDivider.forEach(item=> {
		item.textContent = '-'
	})
	allDropdown.forEach(item=> {
		const a = item.parentElement.querySelector('a:first-child');
		a.classList.remove('active');
		item.classList.remove('show');
	})
} else {
	allSideDivider.forEach(item=> {
		item.textContent = item.dataset.text;
	})
}

toggleSidebar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');

	if(sidebar.classList.contains('hide')) {
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})

		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
	} else {
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})




sidebar.addEventListener('mouseleave', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})
	}
})



sidebar.addEventListener('mouseenter', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})


// MENU
const allMenu = document.querySelectorAll('main .content-data .head .menu');

allMenu.forEach(item=> {
	const icon = item.querySelector('.icon');
	const menuLink = item.querySelector('.menu-link');

	icon.addEventListener('click', function () {
		menuLink.classList.toggle('show');
	})
})


window.addEventListener('click', function (e) {
	// if(e.target !== imgProfile) {
	// 	if(e.target !== dropdownProfile) {
	// 		if(dropdownProfile.classList.contains('show')) {
	// 			dropdownProfile.classList.remove('show');
	// 		}
	// 	}
	// }

	allMenu.forEach(item=> {
		const icon = item.querySelector('.icon');
		const menuLink = item.querySelector('.menu-link');

		if(e.target !== icon) {
			if(e.target !== menuLink) {
				if (menuLink.classList.contains('show')) {
					menuLink.classList.remove('show')
				}
			}
		}
	})
})
