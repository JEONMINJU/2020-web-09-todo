/****************글로벌설정***************/
var auth = firebase.auth();
var db = firebase.database();
var user = null;
var ref = null;
var key = null;
var google = new firebase.auth.GoogleAuthProvider();
var facebook = new firebase.auth.FacebookAuthProvider();

/****************사용자함수***************/
function dbInit() {
	db.ref('root/todo/'+user.uid).on('child_added', onAdd);
	db.ref('root/todo/'+user.uid).on('child_removed', onRev);
	db.ref('root/todo/'+user.uid).on('child_changed', onChg);
}

/****************이벤트콜백***************/ 
var timeout;
function onCheck(el, chk) {
	 $(el).siblings('i').addClass('active');
	 $(el).removeClass('active');
	 if(chk) {
		 timeout =setTimeout(function(){
		$(el).parent().css('opacity', 0);
		setTimeout(function(){
			db.ref('root/todo'+user.uid+'/'+$(el).parent().attr('id')).update(data);
		}, 750);
	}, 3000);
}
		else {
			 clearTimeout(timeout);
			}
}

function onDoneClick() {
	$('.bt-done').toggleClass('active');
	var ref = db.ref('root/todo/'+user.uid);
	if($('.bt-done').hasClass('active')){  //감추기
			ref.orderByChild('checked').equalTo(false).once('value').then(onGetData);
	}
	else { //보이기
			reg.once('value').then(onGetData);
	}
}

function onGetData(r) {
	$('.list-wrap').empty();
	r.forEach(function(v){
		if(v.val().checked) addHTML(v.key, v.val());
	});
	r.forEach(function(v){
		if(!v.val().checked) addHTML(v.key, v.val());
	});
}

function onSubmit(f) {
	console.log(f.task.value);
	var data = {
		 task: f.task.value,
		 createdAt: new Date().getTime(), //작성인: 현재 날짜 저장
		 checked: false,
		
	}
	if(f.task.value !== '') db.ref('root/todo/'+user.uid).push(data);
	return false;
}

function onAdd(r) {
	//console.log(r.key); //key 는 고유 아이디
	//console.log(r.val()); //val 은 데이터
	if(!r.val().checked) {
		var html = '<li id="'+r.key+'">';
		html += '	<i class="active far fa-circle"  onclick="onCheck(this, true);"></i>';
		html += '	<i class="far fa-check-circle"  onclick="onCheck(this, false);"></i>';
		html += '	<span>'+r.val().task+'</span>';
		html += '</li>';
		var $li = $(html).prependTo($(".list-wrap"));
		$li.css("opacity");
		$li.css("opacity", 1);

	}

//$(".add-wrap")[0].reset(); //reset 이라는 함수는 폼을 초기화하는함순데 자바스크립트 함수다
//제이쿼리의 [0]데이터가 자바스크립트 객체다.
document.querySelector(".add-wrap").reset();
}

function onRev(r) {

}

function onChg(r) {
		$('#'+r.key).remove();
}




function onAuthChg(r) {
	user = r;
  if(r) {// if(r) <- 로그인되었다면..
    console.log(r);
		$('.sign-wrap .icon img').attr('src', user.photoURL);
		$('.sign-wrap .email').html(user.email);
		$('.modal-wrapper.auth-wrapper').hide();
		$('.sign-wrap').show();
    dbInit();
	} 
  else { //로그아웃되었다면..
		$('.sign-wrap .icon img').attr('src', 'https://via.placeholder.com/36'); // 로그아웃일때 빈 더미 이미지 가져와
		$('.sign-wrap .email').html('');
		$('.modal-wrapper.auth-wrapper').show();
		$('.sign-wrap').hide();
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