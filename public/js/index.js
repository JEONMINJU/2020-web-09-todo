/****************글로벌설정***************/
var auth = firebase.auth();
var db = firebase.database();
var user = null;
var ref = null;
var google = new firebase.auth.GoogleAuthProvider(); //구글에 로그인할 수 있는 객체
var facebook = new firebase.auth.FacebookAuthProvider();

/****************사용자함수***************/
function dbInit() {
	db.ref('root/todo/'+user.uid).on('child_added', onAdd);
	db.ref('root/todo/'+user.uid).on('child_removed', onRev);
	db.ref('root/todo/'+user.uid).on('child_changed', onChg);
}

/****************이벤트콜백***************/ 
function onAdd(r) {
	console.log(r.val());
}

function onRev(r) {
	console.log(r.val());
}

function onChg(r) {
	console.log(r.val());
}




function onAuthChg(r) {
  if(r) {// if(r) <- 로그인되었다면..
    console.log(r);
		user = r;
		$('.sign-wrap .icon img').attr('src', user.photoURL);
		$('.sign-wrap .email').html(user.email);
		$('.modal-wrapper.auth-wrapper').hide();
    $('#btLogout').show();
    dbInit();
	} 
  else { //로그아웃되었다면..
		user = null;
		$('.sign-wrap .icon img').attr('src', 'https://via.placeholder.com/36'); // 로그아웃일때 빈 더미 이미지 가져와
		$('.sign-wrap .email').html('');
		$('.modal-wrapper.auth-wrapper').show();
		$('#btLogout').hide();
	}
}

function onGoogleLogin() {
  auth.signInWithPopup(google);
}

function onLogout() {
  auth.signOut();
}

function onAdded(r) {
  $('.list-wrapper').prepend('<div style="padding: 1em; border-bottom:1px solid #ccc">'+r.val().comment+'</div>')
}

/****************이벤트등록***************/
auth.languageCode = 'ko';
auth.onAuthStateChanged(onAuthChg); //auth의 상태가 변화되면 onAuthChg
//onAuthStateChanged 는 auth에서 제공해주는 이벤트 , watcher :로그인상태 감시자

$('#btGoogleLogin').click(onGoogleLogin);
$('#btLogout').click(onLogout);